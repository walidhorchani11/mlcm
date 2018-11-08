<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Controller;

use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use ArgoMCMBuilder\VeevaVaultBundle\Form\FormZip\CreateBinderStep1Form;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use GuzzleHttp\Client;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use ArgoMCMBuilder\PresentationBundle\Objects\Catcher;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use GuzzleHttp\Exception\BadResponseException;
use ArgoMCMBuilder\VeevaVaultBundle\Exception\VeevaException;

/****
 * Class VeevaZipController
 * @package ArgoMCMBuilder\VeevaVaultBundle\Controller
 */
class VeevaZipController extends Controller
{
    /**
     * @param Request $request
     * @param $id_press
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     * @Route("/dashboard-vault-zip/{id_press}",name="dashboard_vault_zip")
     */
    public function dashboardVaultZipAction(Request $request, $id_press)
    {
        $em = $this->container->get('doctrine')->getManager();
        $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres($id_press);
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionVeeva = $helper->token_instance();
        $veevaDatas = $helper->existeBinders($id_press);
        $user = $this->get('security.context')->getToken()->getUser();
        $company = !empty($user->getCompany()) ? $user->getCompany() : '';
        $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
        $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
        $array = array();

        if (!empty($sessionVeeva)) {
            $message = '';
            foreach ($veevaDatas as $key => $veevaData) {
                $result = $helper->BinderDetails($veevaData->getBinderId());
                $checkoutVaultMcm[$veevaData->getBinderId()] = $this->checkoutVaultMcm($veevaData->getBinderId());

                if ($result->responseStatus == "SUCCESS") {
                    $documents = $helper->getCodeDocByBinder($veevaData->getBinderId());
                    if (!empty($result->document->owner__v->users[0])) {
                        $dataUser = $helper->getUsreDataById($result->document->owner__v->users[0]);
                    }
                    $array[] = array(
                        'binderData' => $result,
                        'docData' => $documents,
                        'dataUser' => $dataUser,
                    );
                } else {
                    $message = 'FAILURE';
                }
            }
            if ($message == 'FAILURE') {
                $request->getSession()->getFlashBag()->add(
                    'warning',
                    "Your permission is enough to see only your push(s). To create a new Binder, please click on \"Create Binder\"."
                );
            }
            $content = $this
                ->get('templating')
                ->render(
                    'VeevaVaultBundle:VeevaZip:createBinderVersion.html.twig',
                    array(
                        'id_press' => $id_press,
                        'id_rev' => $id_rev,
                        'array' => $array,
                        'veevaUrl' => $veevaUrl,
                        'checkoutVaultMcm' => !empty($checkoutVaultMcm) ? $checkoutVaultMcm : '',
                    )
                );

        } else {

            $form = $this->createFormBuilder()
                ->add('Email', EmailType::class)
                ->add('Password', PasswordType::class)
                ->add('Login', SubmitType::class)
                ->getForm();
            $form->handleRequest($request);
            if ($form->isSubmitted() && $form->isValid()) {
                $data = $form->getData();
                $email = $data['Email'];
                $pasword = $data['Password'];

                $client = new Client();
                try {
                    $response = $client->request(
                        'POST',
                        $veevaUrl.'/api/'.$veevaApi.'/auth',
                        [
                            'form_params' => [
                                'username' => $email,
                                'password' => $pasword,
                            ],
                        ]
                    );
                    $session = new Session();
                    $body = $response->getBody();
                    $obj = json_decode($body);

                    if ($obj->responseStatus == "FAILURE") {
                        $form->addError(new FormError($obj->errorType.'! '.$obj->responseMessage));
                    } else {
                        $sessionId = $obj->sessionId;
                        $session->set('TokenUserVeeva', $sessionId);
                        $request->getSession()->getFlashBag()->add('success', "Success Veeva Login");
                        $referer = $request->headers->get('referer');

                        return $this->redirect($referer);
                    }
                } catch (BadResponseException $e) {
                    trigger_error($e->getMessage());
                }
            }
            $content = $this
                ->get('templating')
                ->render(
                    'VeevaVaultBundle:VeevaPdf:VeevaLogin.html.twig',
                    array(
                        'form' => $form->createView(),
                        'veevaUrl' => $veevaUrl,

                    )
                );
        }

        return new Response($content);
    }

    /**
     * @param Request $request
     * @param int $id_press
     * @return Response
     * @Route("/zip-veeva-steps/{id_press}/{id}" ,defaults={"id" = null},name="zip_veeva_steps")
     */
    public function createBinderAction(Request $request, $id_press)
    {
        $em = $this->container->get('doctrine')->getManager();
        $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres($id_press);
        $projet = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
        $idProject = $projet->getProject()->getId();
        $presentationName = $projet->getName();
        $helper = $this->get('veeva_vault.helper.tools');
        /**Get MAJ zip and download zip**/
        $sessionVeeva = $helper->token_instance();
        if (!empty($sessionVeeva)) {
            $id_binder = !empty($request->query->get('id_binder')) ? $request->query->get('id_binder') : '';
            /**Verify Id Binder If exist in Vault**/
            if (!empty($id_binder)) {
                if (!$helper->checkVaultBinder($id_binder)) {

                    throw  $this->createNotFoundException(
                        'Document Not Found
                        You may have reached this page for one of the following reasons: 
                        
                        You do not have permission to view this document.
                        The URL was incorrect.
                        The document has been deleted or does not exist in this vault.
                        
                        Check the link you used or	contact your administrator if you feel you have reached this page in error.'
                    );
                }
            }
            $formData = array();
            $flow = $this->get('company.form.flow.createBinderZip');
            $flow->bind($formData);
            /**form of the current step**/
            $form = $flow->createForm();
            /** getCurrentStepNumber**/
            if ($flow->isValid($form)) {
                $flow->saveCurrentStepData($form);
                if ($flow->nextStep()) {
                    $form = $flow->createForm();

                } else {

                    $steps = $flow->getSteps();
                    $data_sent = $helper->GetDataStepes($steps);
                    /**Create Binder**/
                    if (empty($id_binder)) {
                        $result = $helper->CreateBinder($data_sent, $request, $id_press, $id_rev);
                    } else {
                        /**Create Document***/
                        /**Add With Ajax**/
                        /**See AddNewDocumentAction
                         **/
                    }
                    $flow->reset();
                    if (!empty($result) && $result->responseStatus == 'FAILURE') {
                        /**If Failure date send**/
                        $mssg = $result->responseStatus.' '.$result->errors[0]->message;
                        $request->getSession()
                            ->getFlashBag()
                            ->add('warning', $mssg);

                        return $this->redirect(
                            $this->generateUrl(
                                'presentations_edit_presentation',
                                array(
                                    'idPres' => $id_press,
                                )
                            )
                        );

                    } else {
                        return $this->redirect(
                            $this->generateUrl(
                                'zip_veeva_steps',
                                array(
                                    'id_press' => $id_press,
                                    'id_binder' => $result->id,
                                )
                            )
                        );
                    }
                }
            }

            $steps = $flow->getSteps();
            $data_sent = $helper->GetDataStepes($steps);
            $content = $this
                ->get('templating')
                ->render(
                    'VeevaVaultBundle:VeevaZip:createBinder.html.twig',
                    array(
                        'form' => $form->createView(),
                        'flow' => $flow,
                        'data_sent' => !empty($data_sent) ? $data_sent : 'Data Not Found',
                        'request' => $request,
                        'id_binder' => $id_binder,
                        'id_rev' => $id_rev,
                        'id_press' => $id_press,
                        /*'vaultUser' => $helper->currentUserDetailsAction(),*/
                        'idProject' => $idProject,
                        'presentationName'=>$presentationName,
                        'upload_zip_tree' => $this->GetUploadZipTree($id_rev, $id_press, $id_binder),

                    )
                );

        } else {
            $user = $this->get('security.context')->getToken()->getUser();
            $company = !empty($user->getCompany()) ? $user->getCompany() : '';
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $form = $this->createFormBuilder()
                ->add('Email', EmailType::class)
                ->add('Password', PasswordType::class)
                ->add('Login', SubmitType::class)
                ->getForm();
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $data = $form->getData();
                $email = $data['Email'];
                $pasword = $data['Password'];


                $client = new Client();
                try {
                    $response = $client->request(
                        'POST',
                        $veevaUrl.'/api/'.$veevaApi.'/auth',
                        [
                            'form_params' => [
                                'username' => $email,
                                'password' => $pasword,
                            ],
                        ]
                    );

                    $session = new Session();
                    $body = $response->getBody();
                    $obj = json_decode($body);

                    if ($obj->responseStatus == "FAILURE") {
                        $form->addError(new FormError($obj->errorType.'! '.$obj->responseMessage));
                    } else {
                        $sessionId = $obj->sessionId;
                        $session->set('TokenUserVeeva', $sessionId);
                        $request->getSession()->getFlashBag()->add('success', "Success Veeva Login");
                        $vaultUser = $helper->currentUserDetailsAction();
                        if ($vaultUser->responseStatus == "SUCCESS") {
                            $idCompanyVault = $vaultUser->users[0]->user->vault_id__v[0];
                        }
                        $vault = $em->getRepository('VeevaVaultBundle:Veeva')->getExistBinderByCompany(
                            $id_press,
                            'zip',
                            $idCompanyVault
                        );
                        if (!empty($vault)) {
                            return $this->redirect(
                                $this->generateUrl(
                                    'dashboard_vault_zip',
                                    array(
                                        'id_press' => $id_press,
                                    )
                                )
                            );

                        }
                        $referer = $request->headers->get('referer');

                        return $this->redirect($referer);
                    }
                } catch (BadResponseException $e) {
                    trigger_error($e->getMessage());
                }
            }

            $content = $this
                ->get('templating')
                ->render(
                    'VeevaVaultBundle:VeevaPdf:VeevaLogin.html.twig',
                    array(
                        'form' => $form->createView(),
                        'veevaUrl' => $veevaUrl,

                    )
                );

        }

        return new Response($content);
    }

    /**
     * @param $needle
     * @param $haystack
     * @param bool $strict
     * @return bool
     * If in array recursive
     */
    public function inArrayR($needle, $haystack, $strict = false)
    {
        foreach ($haystack as $key => $item) {
            if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && $this->inArrayR(
                        $needle,
                        $item,
                        $strict
                    ))
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param $needle
     * @param $haystack
     * @param bool $strict
     * @return bool
     * If Key in array recursive
     */
    public function KeyinArrayR($needle, $haystack, $strict = false)
    {
        foreach ($haystack as $key => $item) {
            if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && $this->inArrayR(
                        $needle,
                        $item,
                        $strict
                    ))
            ) {
                return $key;
            }
        }

        return 'Key Not Found';
    }

    /**
     * @param Request $request
     * @return Response
     * @Route("/zip-add-new-document" ,name="zip_add_new_document")
     */
    public function AddNewDocumentAction(Request $request)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $em = $this->getDoctrine()->getManager();
        /**Get Data from twig ajax**/
        $data_sent = $request->request->get('send');
        $id_binder = $request->request->get('id_binder');
        $id_rev = $request->request->get('id_rev');
        $id_press = $request->request->get('id_press');
        $project = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
        $projectName = !empty($project->getName()) ? $project->getName() : '';
        /**Get Array data from twig ajax**/
        if (is_array($data_sent)) {
            $array = array();
            $array_doc = array();
            $arrayUpdate = array();
            $arrayUpdateVault = array();
            /**Create 2 array for create doc and update doc**/
            foreach ($data_sent as $key => $data) {
                foreach ($data as $key2 => $val) {
                    $array_doc[$key2] = array('name' => $key2, 'contents' => $val);
                    $arrayUpdate[$key2] = $val;
                }
                $array[] = array_values($array_doc);
                $arrayUpdateVault[] = $arrayUpdate;
            }
            /**Get Array Document**/
            $array_uploads = array();
            $uploads = $helper->ZipExist($id_rev);

            foreach ($uploads as $key => $upload) {
                $array_uploads[] = array(
                    'name' => 'file',
                    'contents' => fopen($upload['path'], 'r'),

                );
            }


            $rev = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
            $slides = (array)json_decode($rev->getSlides());

            $arraySlide = array();
            foreach ($slides as $slide) {
                if (property_exists($slide, 'children')) {
                    foreach ($slide->{'children'} as $children) {
                        $arraySlide[] = $children;
                    }
                } else {
                    $arraySlide[] = $slide;
                }
            }


            foreach ($array_uploads as $key => $array_upload) {

                /**Set default value shared Created**/
                if (!is_numeric(substr($uploads[$key]['fileName'], 0, 1))) {
                    /**Required add __ to name shared no delete(__)**/
                    $array[$key][1]['contents'] = substr($uploads[$key]['fileName'], 0, 6).'__'.$projectName;
                    /* $shared = $this->KeyinArrayR('crm_shared_resource__v', $array[$key]);
                     $array[$key][$shared]['contents'] = 'true';*/

                } else {
                    /**Set default value not shared In created**/
                    $name = property_exists(
                        $arraySlide[$key]->{'attributes'},
                        'data-screen-name'
                    ) ? $arraySlide[$key]->{'attributes'}->{'data-screen-name'} :
                        $uploads[$key]['fileName'];
                    $array[$key][1]['contents'] = $name;
                }

                $statusDoc = $this->statusDoc($id_binder, $id_rev);

                /**Not First Push**/
                if (!empty($statusDoc)) {
                    /**Update version old shared**/
                    if (!is_numeric(substr($uploads[$key]['fileName'], 0, 1))) {

                        $idShared = $helper->getSharedIdByBinder($id_binder);
                        $promises[$key] = $helper->addNewVersionDocument(
                            $array[$key],
                            array($array_upload),
                            $idShared
                        );
                        $promiseResult[$key] = json_decode($promises[$key]->getBody());
                        $customResults[$key] = array('id' => $idShared);
                        $results[$key] = (object)array_merge($customResults[$key], (array)$promiseResult[$key]);
                    }

                    /**Update version old document(Update zip)**/
                    if (isset($statusDoc['old'][$key])) {
                        /**Set name zip in update**/
                        $name = property_exists(
                            $arraySlide[$key]->{'attributes'},
                            'data-screen-name'
                        ) ? $arraySlide[$key]->{'attributes'}->{'data-screen-name'} :
                            $uploads[$key]['fileName'];
                        $arrayUpdateVault[$key]['name__v'] = $name;

                        $promises[$key] = $helper->updateDocument($statusDoc['old'][$key], $arrayUpdateVault[$key]);
                        if ($promises[$key] == false) {
                            $request->getSession()->getFlashBag()->add(
                                'warning',
                                "You do not have permission to access this binder or update document."
                            );

                            return false;
                        }
                        $results[$key] = json_decode($promises[$key]->getBody());

                    }


                    if (isset($statusDoc['new'][$key])) {

                        $promises[$key] = $helper->CreateDocument($array[$key], array($array_upload));
                        $results[$key] = json_decode($promises[$key]->getBody());

                    }
                    /**Update only metadata without zip .Update Doc without increment version**/
                    if (isset($statusDoc['update'][$key])) {
                        $promises[$key] = $helper->addNewVersionDocument(
                            $array[$key],
                            array($array_upload),
                            $statusDoc['update'][$key]
                        );
                        $promiseResult[$key] = json_decode($promises[$key]->getBody());
                        $customResults[$key] = array('id' => $statusDoc['update'][$key]);
                        $results[$key] = (object)array_merge($customResults[$key], (array)$promiseResult[$key]);
                    }
                } else {
                    /**First Push**/
                    /**Create Document(s)**/
                    $promises[$key] = $helper->CreateDocument($array[$key], array($array_upload));
                    $results[$key] = json_decode($promises[$key]->getBody());


                }
            }

            /**Move Document to Binder**/
            $result = \GuzzleHttp\Promise\any($promises)->then(
                function ($values) use (
                    $results,
                    $helper,
                    $id_binder,
                    $promises,
                    $request,
                    $arraySlide,
                    $rev,
                    $em
                ) {
                    if ($values->getStatusCode() == 200) {

                        /**Get Id Shared**/
                        $GetShaerdId = $this->GetShaerdId($results);
                        $shared = $GetShaerdId[1];
                        foreach ($results as $keyRes => $result) {
                            if (!empty($result) && $result->responseStatus != 'FAILURE') {
                                /**Related Document to Binder**/
                                $id_document = $result->id;
                                $move_doc = $helper->MoveDocumentToBinder($id_binder, $id_document);
                                $shared_resource = $helper->PromiseCreateMoveDocumentToBinder($promises, $move_doc);
                                /**Related Shared Resource In New Promise**/
                                try {
                                    $resource = \GuzzleHttp\Promise\any($shared_resource)->then(
                                        function ($values) use ($result, $request, $shared) {

                                            $isShared = $this->IsShared($result->id);
                                            if (!$isShared) {
                                                $result_shared = $this->relatedShared($result->id, $shared);
                                                if ($result_shared->responseStatus == 'FAILURE') {
                                                    $mssg = $result_shared->errors[0]->message;
                                                    /**Warning Related shared**/
                                                    /*$request->getSession()
                                                        ->getFlashBag()
                                                        ->add('warning', $mssg);*/
                                                }
                                            }
                                        }
                                    );
                                    $resource->wait();
                                } catch (BadResponseException $e) {
                                    trigger_error($e->getMessage());
                                }
                                /**Create array of data document for send to Db**/
                                $success[] = $result->responseStatus;
                                if (isset($arraySlide[$keyRes])) {

                                    if (property_exists($arraySlide[$keyRes]->{'attributes'}, 'data-id')) {
                                        $ids[] = $arraySlide[$keyRes]->{'attributes'}->{'data-id'};
                                    }

                                    $idsDoc[$ids[$keyRes]] = $result->id;
                                }
                            }
                        }


                        if (in_array("FAILURE", $success) && $resource->getState() != "fulfilled") {
                            $mssg = $result->errors[0]->message;
                            $request->getSession()
                                ->getFlashBag()
                                ->add('warning', $mssg);
                        } else {
                            /**Delete zip updated from presentation version**/
                            $history = $rev->getHistoryRevision();
                            if (!empty($history)) {
                                $rev->setHistoryRevision(null);
                            }

                            $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($id_binder);
                            $veeva->setVeevaDocuments($idsDoc);
                            $em->flush();
                            $mssg = $result->responseMessage;
                            $request->getSession()
                                ->getFlashBag()
                                ->add('success', $mssg);
                        }
                    }
                }
            );

            $result->wait();
        }


        return new Response(
            '<html><body>Success</body></html>'
        );
    }

    /***
     * @param $results
     * @return array
     */
    public function GetShaerdId($results)
    {
        $array = array();
        foreach ($results as $key => $result) {
            $id = $result->id;
            if ($this->IsShared($id)) {
                $array[$this->IsShared($id)] = $id;
            }
        }

        return $array;
    }

    /**
     * @param $id_doc
     * @param $target_id
     * @return mixed
     */
    public function relatedShared($id_doc, $target_id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            $user = $this->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            //The relationship type retrieved from the Document Relationships Metadata call above.
            //{major_version}	The document major_version_number__v field value.
            //{minor_version}	The document minor_version_number__v field value.
            $version = $helper->DocumentDetails($id_doc);
            $major_version = $version->document->major_version_number__v;
            $minor_version = $version->document->minor_version_number__v;
            try {
                $response = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$id_doc.'/versions/'.$major_version.'/'.$minor_version.'/relationships',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],
                        'form_params' => [
                            'target_doc_id__v' => $target_id,
                            'relationship_type__v' => 'related_shared_resource__v',
                        ],

                    ]
                );

                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }

                return $options;

            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        }
    }

    /**
     * @param $id_shared
     * @return bool
     */
    public function IsShared($id_shared)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            $user = $this->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$id_shared,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],
                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
                if (!empty($options['document']['crm_shared_resource__v']) && $options['document']['crm_shared_resource__v']) {
                    return true;
                } else {
                    return false;
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        }

    }

    /**
     * @Route("/zip-move-document/{id_binder}/{id_document}" ,name="zip_move_document")
     */
    public function moveDocumentAction($id_binder, $id_document)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            $user = $this->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$id_binder.'/documents',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],
                        'form_params' => [
                            'document_id__v' => $id_document,

                        ],

                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );


                    return $options;
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id_binder
     * @param $id_document
     * @return mixed|Response
     */
    public function removeDocumentFromBinder($id_binder, $id_document)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            $user = $this->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->request(
                    'DELETE',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$id_binder.'/documents/'.$id_document,
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],

                    ]
                );

                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );


                    return $options;
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id_rev
     * @param $id_press
     * @param $idBinder
     * @return array
     */
    public function GetUploadZipTree($id_rev, $id_press, $idBinder)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        /** @var Revision $rev */
        $em = $this->getDoctrine()->getManager();
        $rev = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
        $slides = (array)json_decode($rev->getSlides());


        $pres = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
        $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company = $presService->recursiveFindParent($pres->getCompany()->getId());

        $s3Folder = $em->getRepository('PresentationBundle:Revision')->getS3FolderVeevaByRev($id_rev);
        /** @var AwsMedia $awsConfig */
        $awsConfig = $this->container->get('mcm.aws_media');
        $s3Client = $awsConfig->getS3Client();
        $args = array(
            'Bucket' => $awsConfig->expectedBucketName,
            'Prefix' => $company->getName().'/zip/veeva-wide/'.$s3Folder['dataFolderVeevaS3'].'_vault',
        );

        $list = $s3Client->getIterator('ListObjects', $args);

        $output = array();
        foreach ($list as $elt) {
            $key = $elt['Key'];

            $PathDirectory = explode('/', $key);
            $pos = sizeof($PathDirectory) - 1;
            $PathDirectory[$pos];

            $output[] = array('title' => $PathDirectory[$pos]);
        }

        sort($output);


        $thumbnails = $this->getParameter('thumbs');
        $em = $this->getDoctrine()->getManager();

        $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($idBinder);

        $arraySlide = array();
        foreach ($slides as $slide) {
            if (property_exists($slide, 'children')) {
                foreach ($slide->{'children'} as $children) {
                    $arraySlide[] = $children;
                }
            } else {
                $arraySlide[] = $slide;
            }
        }

        $arrayState = array();
        if (!empty($veeva) && isset($veeva)) {
            $vaultArray = array();
            if (!empty($veeva->getVeevaDocuments())) {
                if (is_array($veeva->getVeevaDocuments())) {
                    $vaultArray = $veeva->getVeevaDocuments();
                } else {
                    $vaultArray = (array)json_decode($veeva->getVeevaDocuments());
                }
            }

            foreach ($arraySlide as $slide) {
                if (property_exists($slide->{'attributes'}, 'data-id')) {
                    $ids[] = $slide->{'attributes'}->{'data-id'};
                }
            };

            $array_diff = array_diff_key(array_flip($ids), $vaultArray);
            $isNew = array_flip($array_diff);

            $changedSlides = array();
            $history = $rev->getHistoryRevision();
            if (!empty($history)) {
                $changedSlides = json_decode($history->getChangedSlides());
            }


            if (!empty($ids)) {
                foreach ($ids as $id) {
                    if (in_array($id, $isNew)) {
                        $arrayState[$id] = 'New';
                    } else {
                        if (in_array($id, $changedSlides)) {
                            $arrayState[$id] = 'Update';
                        } else {
                            $arrayState[$id] = 'Old';
                        }
                    }

                }
            }

        }

        $output_data = array();

        foreach ($output as $key => $data) {

            if (!empty($arraySlide[$key])) {
                $output_data[] = array(
                    'name_zip' => preg_replace('/\\.[^.\\s]{3,4}$/', '', $data['title']),
                    'screenName' => property_exists(
                        $arraySlide[$key]->{'attributes'},
                        'data-screen-name'
                    ) ? $arraySlide[$key]->{'attributes'}->{'data-screen-name'} :
                        'No Screen Name',
                    'chapterName' => property_exists(
                        $arraySlide[$key]->{'attributes'},
                        'data-chapter-name'
                    ) ? $arraySlide[$key]->{'attributes'}->{'data-chapter-name'} :
                        'No Chapter Name',
                    'keyMessage' => property_exists(
                        $arraySlide[$key]->{'attributes'},
                        'data-key-msg'
                    ) ? $arraySlide[$key]->{'attributes'}->{'data-key-msg'} :
                        'No Key Message',
                    'thumb' => !empty($ids[$key]) ? 'https://s3-eu-west-1.amazonaws.com/'.$awsConfig->expectedBucketName.'/'.$company->getName(
                        )."/thumbs/".$id_press."-".$id_rev."/slides/screen-200-".$ids[$key].".jpg" : '',
                    'status' => !empty($arrayState[$arraySlide[$key]->{'attributes'}->{'data-id'}]) ? $arrayState[$arraySlide[$key]->{'attributes'}->{'data-id'}] : '',
                );
            }


            /**Get Data For Children**/

            /**Get Data Sheared Folder**/
            if (empty($arraySlide[$key])) {
                array_push(
                    $output_data,
                    array(
                        'name_zip' => preg_replace('/\\.[^.\\s]{3,4}$/', '', $output[$key]['title']),
                        'screenName' => 'Shared__'.$pres->getName(),
                        'chapterName' => 'No Chapter Name',
                        'keyMessage' => 'No Key Message',
                        'thumb' => $this->container->getParameter(
                            'veeva_wide_framework_thumbs'
                        ),
                        'status' => '',
                    )
                );
            }
        }

        return $output_data;


    }


    /**
     * @param Request $request
     * @param $helper
     * @param $id_rev
     * @param $id_press
     * @return bool|\Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function diffDateZip(Request $request, $helper, $id_rev, $id_press)
    {
        $em = $this->container->get('doctrine')->getManager();
        $rev = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
        if (!empty($rev)) {
            $lastUpdateRev = $rev->getDataUpdatedAt()->getTimestamp();
        } else {
            /**If Try to download zip without save ar with out add document**/
            $request->getSession()->getFlashBag()->add('warning', "You should add document(s) and save as.");
        }


        $fileName = $em->getRepository('PresentationBundle:Presentation')->getZipName($id_rev);
        $dir_zip = $this->get('kernel')->getRootDir().'/../web/zip_output/veeva_wide';
        $pattern = $dir_zip.'/'.$helper->slugifyZip(strtolower($fileName['pres']))."_".$helper->slugifyZip(
                strtolower($fileName['company'])
            )."_".$helper->slugifyZip(
                strtolower(
                    $fileName['country']
                )
            )."_*".strtolower($fileName['version']).".zip";
        $zips = glob($pattern);

        if (empty($zips)) {
            return true;
        }
        $structureFile = explode($dir_zip, $zips[0]);
        $getTimeFromZipFile = explode('_', $structureFile[1]);
        $index = sizeof($getTimeFromZipFile) - 2;
        if ($lastUpdateRev > (int)$getTimeFromZipFile[$index]) {
            return true;
        }

        return false;
    }


    /**
     * @param $idBinder
     * @return bool
     */
    public function checkoutVaultMcm($idBinder)
    {
        $em = $this->getDoctrine()->getManager();
        $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($idBinder);
        $helper = $this->get('veeva_vault.helper.tools');
        $getDocByBinder = !empty($helper->getDocByBinder($idBinder)) ? $helper->getDocByBinder($idBinder) : '';
        $vaultArray = !empty($veeva->getVeevaDocuments()) ? json_decode($veeva->getVeevaDocuments()) : '';
        if (!empty($getDocByBinder)) {
            foreach ($getDocByBinder as $key => $doc) {
                if ($this->IsShared($doc)) {
                    unset($getDocByBinder[$key]);
                }
            }
        }

        $vaultArray = array_values((array)$vaultArray);
        sort($vaultArray);
        if (is_array($getDocByBinder)) {
            sort($getDocByBinder);
        }

        if ($getDocByBinder == $vaultArray) {
            return true;
        }

        return false;
    }

    /**
     * @param Request $request
     * @param $idBinder
     * @param $id_rev
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     * @Route("/synchro-document-mcm-veeva/{idBinder}/{id_rev}/{id_press}" ,name="synchro_document_mcm_veeva")
     */
    public function synchroDocMcmVaultAction(Request $request, $idBinder, $id_rev, $id_press)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $em = $this->getDoctrine()->getManager();
        $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($idBinder);
        $vaultArray = array();
        if (!empty($veeva->getVeevaDocuments())) {
            if (is_array($veeva->getVeevaDocuments())) {
                $vaultArray = $veeva->getVeevaDocuments();
            } else {
                $vaultArray = (array)json_decode($veeva->getVeevaDocuments());
            }
        }

        $rev = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
        $slides = (array)json_decode($rev->getSlides());

        $ids = array();

        $arraySlide = array();
        foreach ($slides as $slide) {
            if (property_exists($slide, 'children')) {
                foreach ($slide->{'children'} as $children) {
                    $arraySlide[] = $children;
                }
            } else {
                $arraySlide[] = $slide;
            }
        }

        foreach ($arraySlide as $slide) {
            if (property_exists($slide->{'attributes'}, 'data-id')) {
                $ids[] = $slide->{'attributes'}->{'data-id'};
            }
        }


        $array_diff = array_diff(array_keys($vaultArray), $ids);
        $statusDoc = $this->statusDoc($idBinder, $id_rev);
        /**Check If Doc is deleted**/
        if (!empty($array_diff)) {
            //Get node document(s) for remove
            $node = $this->getNodeBinder($idBinder, $helper);
            $success = array();
            foreach ($array_diff as $key => $id) {
                $vaultDoc = $helper->DocumentDetails($vaultArray[$id]);
                if ($vaultDoc->responseStatus == "SUCCESS" && isset($node[$vaultArray[$id]])) {
                    $res = $this->removeDocumentFromBinder($idBinder, $node[$vaultArray[$id]]);
                    $success[] = $res['responseStatus'];
                } else {
                    $request->getSession()->getFlashBag()->add('warning', "Problem synchronisation.");
                }
            }
            if (in_array("FAILURE", $success)) {
                if (empty($statusDoc['new']) && empty($statusDoc['update'])) {
                    $request->getSession()->getFlashBag()->add('warning', "Problem synchronisation.");
                }
            } else {
                $request->getSession()->getFlashBag()->add('success', "Success synchronisation with Vault.");
                $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($idBinder);
                /**Get New slide after update(delete create update screen) **/
                $out = array_diff_key($vaultArray, array_flip($array_diff));
                $veeva->setVeevaDocuments($out);
                $em->flush();
            }
        }


        if (!empty($statusDoc)) {
            if (!empty($statusDoc['new']) || !empty($statusDoc['update'])) {
                return $this->redirectToRoute(
                    'zip_veeva_steps',
                    array('id_press' => $id_press, 'id_binder' => $idBinder)
                );
            } else {
                if (empty($array_diff)) {
                    $request->getSession()->getFlashBag()->add(
                        'success',
                        "Your presentation has not been changed. You are already synchronise with Vault."
                    );
                }
            }
        }

        $referer = $request->headers->get('referer');

        return $this->redirect($referer);

    }


    /**
     * @param $idBinder
     * @param $helper
     * @return array
     */
    public function getNodeBinder($idBinder, $helper)
    {

        $binderDatas = $helper->BinderDetails($idBinder);
        $binderDatas = $binderDatas->binder->nodes;
        $array = array();
        foreach ($binderDatas as $key => $binderData) {
            $array[$binderData->properties->document_id__v] = $binderData->properties->id;
        }

        return $array;
    }

    /**
     * @param $idBinder
     * @param $id_rev
     * @return array
     */
    public function statusDoc($idBinder, $id_rev)
    {
        $em = $this->getDoctrine()->getManager();
        $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($idBinder);
        /** @var Revision $rev */
        $rev = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
        $changedSlides = array();

        $slides = (array)json_decode($rev->getSlides());

        if (!empty($veeva) && isset($veeva)) {
            $vaultArray = array();
            if (!empty($veeva->getVeevaDocuments())) {
                if (is_array($veeva->getVeevaDocuments())) {
                    $vaultArray = $veeva->getVeevaDocuments();
                } else {
                    $vaultArray = (array)json_decode($veeva->getVeevaDocuments());
                }
            }
            $ids = array();
            $arraySlide = array();
            foreach ($slides as $slide) {
                if (property_exists($slide, 'children')) {
                    foreach ($slide->{'children'} as $children) {
                        $arraySlide[] = $children;
                    }
                } else {
                    $arraySlide[] = $slide;
                }
            }
            /**Get all zip**/
            foreach ($arraySlide as $slide) {
                if (property_exists($slide->{'attributes'}, 'data-id')) {
                    $ids[] = $slide->{'attributes'}->{'data-id'};
                }
            }
            /**End**/
            $array_diff = array_diff_key(array_flip($ids), $vaultArray);
            /**Get New zip**/
            $isNew = array_flip($array_diff);
            /**End**/
            /**Get Array zip without new**/
            $isOldArray = array_diff_key($ids, $isNew);
            $flipIsOld = array_flip($isOldArray);
            $arrayBinderId = array();

            foreach ($vaultArray as $key => $vault) {
                if (isset($flipIsOld[$key])) {
                    $arrayBinderId[$flipIsOld[$key]] = $vault;
                }
            }

            /**End**/
            /**Get Array updated zip from data base**/
            $history = $rev->getHistoryRevision();

            if (!empty($history)) {
                $changedSlides = json_decode($history->getChangedSlides());
            }

            /**End**/
            /**Get old slide**/
            $treeChangedList = array_diff_key($ids, array_diff($ids, $changedSlides));
            $isOld = array_diff_key($arrayBinderId, $treeChangedList);
            /**End**/
            /**Get Array updated zip with tree**/
            $isUpdate = array_diff_key($arrayBinderId, $isOld);

            /**End**/
            return array('old' => $isOld, 'new' => $isNew, 'update' => $isUpdate);
        }


    }

}
