<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Controller;

use Elastica\Exception\NotFoundException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Exception\InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use ArgoMCMBuilder\VeevaVaultBundle\Form\FormPdf\CreateBinderStep1Form;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\BadResponseException;
use ArgoMCMBuilder\VeevaVaultBundle\Exception\VeevaException;
use Aws\S3\S3Client;

/****
 * Class VeevaPdfController
 * @package ArgoMCMBuilder\VeevaVaultBundle\Controller
 */
class VeevaPdfController extends Controller
{
    /**
     * Generate Pdf Action
     */
    public function generatePDFAction($idPres, $idRev, $plateform, $tabChecked)
    {

        $em = $this->getDoctrine()->getManager();
        $fileName = $em->getRepository('PresentationBundle:Presentation')->getZipName($idRev);
        $currentDate = new \DateTime();
        $pdf = $fileName['pres'].'_'.$fileName['company'].'_'.$fileName['country'].'_'.$currentDate->format(
                'mdY'
            ).'_'.$fileName['version'];
        $fileName = $this->slugify($pdf);
        if (empty($fileName)) {
            return $fileName = $idRev;
        }

        //Add List of Pdf
        if (strrpos($tabChecked, 'link-rcp-pdf') == false) {
            $rcpList = "null";
        } else {
            $rcpList = $this->getListRcp($idPres, $idRev);
        }

        $presentationService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $companyParent = $presentationService->recursiveFindParent($pres->getCompany()->getId());
        $baseUrl = $this->get('request')->getSchemeAndHttpHost().'/';
        $urlPDF = $baseUrl.$this->getParameter(
                'locale'
            ).'/medias/showPdf/'.$fileName.'?key='.$idPres.'-'.$idRev.'&company='.$companyParent->getName();

        return array("fileName" => $fileName, "rcpList" => $rcpList, "urlPdf" => $urlPDF);

    }

    /**
     * push Pdf to Veeva Vault
     */
    public function pushPDFToVault($idRev, $idPres)
    {

        $tabChecked = "chapter-name,name-screen,page-id,key-message,title-screen-name,scrollable-txt,link-popin,link-screen,animations,link-pdf,references,ref-popup,rcp-popup,popin,annimation-slide,list-ref,list-rcp,survey,flow-diagram,comments,link-rcp-pdf";

        $result = $this->generatePDFAction($idPres, $idRev, "veeva", $tabChecked);

        // print pdf with template
        $response = $this->get('clm.print_pdf')->printPdf(
            $idRev,
            $idPres,
            $result["fileName"],
            $tabChecked,
            $result["rcpList"],
            'veeva',
            $result["urlPdf"],
            "0"
        );
        if ($response) {
            return $result["fileName"];
        }

        return "failed";
    }

    public function slugify($text)
    {
        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '-', $text);

        // trim
        $text = trim($text, '-');

        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return 'n-a';
        }

        return $text;
    }

    public function getRevisionAction($idRev)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($idRev);

        return $revision;
    }

    public function getListRcp($idPres, $idRev)
    {
        $revision = $this->getRevisionAction($idRev);
        $pdfs = $revision->getPdf()->toArray();
        $resultpdf = null;
        $pdfList = '';
        //Find RCP List
        foreach ($pdfs as $pdf) {
            if ($resultpdf == null) {
                $pdfList = $pdfList.'{"title":"'.$pdf->title.'","url":"'.$pdf->url.'"}';
            } else {
                $pdfList = $pdfList.',{"title":"'.$pdf->title.'","url":"'.$pdf->url.'"}';
            }
            $resultpdf = 1;
        }

        //Find List PDF Linked
        $slides = json_decode($revision->getSlides());
        foreach ($slides as $slide) {
            if (isset($slide->blocks) and !is_null($slide->blocks)) {
                foreach ($slide->blocks as $block) {
                    if (isset($block->{'attributes'}->{'pdf-link'}) and !is_null(
                            $block->{'attributes'}->{'pdf-link'}
                        )
                    ) {
                        $pdfLink = $block->{'attributes'}->{'pdf-link'};
                        $pdfName = $block->{'attributes'}->{'data-pdf-name'};
                        $pdf = '{"title":"'.$pdfName.'","url":"'.$pdfLink.'"}';
                        if (strrpos($pdfList, $pdf) === false) {
                            if ($resultpdf == null) {
                                $pdfList = $pdfList.$pdf;
                            } else {
                                $pdfList = $pdfList.','.$pdf;
                            }
                            $resultpdf = 1;
                        }
                    }
                }
            }
        }
        $pdfList = '['.$pdfList.']';
        if ($resultpdf == null) {
            $pdfList = "null";
        }

        return $pdfList;
    }

    /**
     * @param $id_rev
     * @param $id_press
     * @return array
     */
    public function pdfPromoMats($id_rev, $id_press)
    {
        $em = $this->container->get('doctrine')->getManager();
        $pdfName = $this->pushPDFToVault($id_rev, $id_press);
        $parseUrl = array();
        if ($pdfName != "failed") {
            $pres = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
            $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
            $company = $presService->recursiveFindParent($pres->getCompany()->getId());
            $awsConfig = $this->container->get('mcm.aws_media');
            $s3Client = $awsConfig->getS3Client();
            $url = $s3Client->getObjectUrl(
                $awsConfig->expectedBucketName,
                $company->getName().'/exported-pdf/'.$id_press.'-'.$id_rev.'/'.$pdfName.'.pdf'
            );

            if ($url) {
                $parseUrl[] = array('Name' => $pdfName.'.pdf');
            }
        }

        return $parseUrl;
    }

    /**
     * @param Request $request
     * @param int $id_press
     * @return Response
     * @Route("/pdf-veeva-steps/{id_press}/{id}" ,defaults={"id" = null},name="veeva_steps")
     */
    public function createBinderAction(Request $request, $id_press)
    {
        $em = $this->container->get('doctrine')->getManager();
        $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres($id_press);
        $projet = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
        $idProject = $projet->getProject()->getId();
        $helper = $this->get('veeva_vault.helper.tools');

        $sessionVeeva = $helper->token_instance();
        if (!empty($sessionVeeva)) {
            $id_binder = !empty($request->query->get('id_binder')) ? $request->query->get('id_binder') : '';
            /**Verify Id Binder In URL**/
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
            $flow = $this->get('company.form.flow.createBinder');
            $flow->bind($formData);
            /**form of the current step**/
            $form = $flow->createForm();
            if (!empty($id_binder) && $flow->getCurrentStep() == 1) {
                /**generate Pdf into S3**/
                $parseUrl = $this->pdfPromoMats($id_rev, $id_press);
                /**End**/
            }
            /** getCurrentStepNumber**/
            if ($flow->isValid($form)) {


                $flow->saveCurrentStepData($form);
                if ($flow->nextStep()) {
                    $form = $flow->createForm();
                } else {
                    $steps = $flow->getSteps();
                    $data_sent = $helper->GetDataStepesPdf($steps);
                    /**Create Binder**/
                    if (empty($id_binder)) {
                        $result = $helper->CreateBinder($data_sent, $request, $id_press, $id_rev);
                        $document_listing = $helper->DocumentListing();
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
                                'veeva_steps',
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
            $data_sent = $helper->GetDataStepesPdf($steps);

            $content = $this
                ->get('templating')
                ->render(
                    'VeevaVaultBundle:VeevaPdf:createBinder.html.twig',
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
                        'upload_pdf_tree' => !empty($parseUrl) ? $parseUrl : $this->PdfExist($id_rev),
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
     * @Route("/add-new-document" ,name="add_new_document")
     */
    public function AddNewDocumentAction(Request $request)
    {
        $data_sent = $request->request->get('send');
        $id_binder = $request->request->get('id_binder');
        $id_rev = $request->request->get('id_rev');
        $id_press = $request->request->get('id_press');
        $helper = $this->get('veeva_vault.helper.tools');
        $em = $this->container->get('doctrine')->getManager();
        if (is_array($data_sent)) {
            foreach ($data_sent as $key => $data) {
                $array[] = array('name' => $key, 'contents' => $data);
            }


            $pdfName = $em->getRepository('PresentationBundle:Presentation')->getZipName($id_rev);
            $currentDate = new \DateTime();
            $pdf = $pdfName['pres'].'_'.$pdfName['company'].'_'.$pdfName['country'].'_'.$currentDate->format(
                    'mdY'
                ).'_'.$pdfName['version'];
            $pdfName = $this->slugify($pdf);
            $pres = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
            $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
            $company = $presService->recursiveFindParent($pres->getCompany()->getId());
            $awsConfig = $this->container->get('mcm.aws_media');
            $s3Client = $awsConfig->getS3Client();
            try {
                $response = $s3Client->doesObjectExist(
                    $awsConfig->expectedBucketName,
                    $company->getName().'/exported-pdf/'.$id_press.'-'.$id_rev.'/'.$pdfName.'.pdf'
                );

            } catch (S3Exception $e) {
                trigger_error($e->getAwsErrorMessage());
            }
            $path = '';
            if ($response == true) {
                $path = 'https://s3-eu-west-1.amazonaws.com/'.$awsConfig->expectedBucketName.'/'.$company->getName(
                    ).'/exported-pdf/'.$id_press.'-'.$id_rev.'/'.$pdfName.'.pdf';

            } else {
                $filename = 'Test_document_PDF.pdf';
                $dir = __DIR__.'/../../../../web/pdfveeva';
                $path = $dir.'/'.$filename;
            }

            $upload[] = array(
                'Content-type' => 'application/pdf',
                'name' => 'file',
                'contents' => fopen($path, 'r'),
            );

            $create_doc = $helper->CreateDocument($array, $upload);
            $results = json_decode($create_doc->getBody());

            if (!empty($results) && $results->responseStatus != 'FAILURE') {
                $id_document = $results->id;
                $move_doc = $helper->MoveDocumentToBinder($id_binder, $id_document);
                $helper->PromiseCreateMoveDocumentToBinder($create_doc, $move_doc);
                /**return result and "id": "1509026105100:-1073969147"**/
                $res = json_decode($move_doc->getBody());
                if ($res->responseStatus == 'SUCCESS') {

                    $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($id_binder);
                    $veeva->setVeevaDocuments($id_document);
                    $em->flush();
                }

                $request->getSession()
                    ->getFlashBag()
                    ->add('success', $results->responseMessage);

            } else {
                if ($results->errors[0]->message) {
                    $message = 'Error '.$results->errors[0]->message;
                } else {
                    $message = "Error Vault";
                }
                $request->getSession()
                    ->getFlashBag()
                    ->add('warning', $message);

            }


            return new Response();
        }

    }

    /**
     * @Route("/move-document/{id_binder}/{id_document}" ,name="move_document")
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
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }

                return $options;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @Route("/veeva-profile",name="veeva_profile")
     */
    public function currentUserAction()
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/users/me',
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],

                    ]
                );
                $body = $response->getBody();
                $obj = json_decode($body);
                $content = $this
                    ->get('templating')
                    ->render(
                        'VeevaVaultBundle:VeevaPdf:userDetails.html.twig',
                        array(
                            'datas' => $obj,
                        )
                    );

                return new Response($content);
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id_press
     * @param $id_rev
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     * @Route("/logout-veeva/{id_press}/{id_rev}",name="logout_veeva")
     */

    public function logOutVeevaAction($id_press, $id_rev)
    {
        /**@todo delete others var session* */
        $session = new Session();
        $session->remove('TokenUserVeeva');

        return $this->redirect(
            $this->generateUrl(
                'presentations_edit_presentation',
                array(
                    'idPres' => $id_press,
                )
            )
        );
    }

    /**
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     * @Route("/logout-veeva-general",name="logout_veeva_general")
     */

    public function logOutGeneralVeevaAction(Request $request)
    {

        $session = new Session();
        $session->remove('TokenUserVeeva');
        $request->getSession()->getFlashBag()->add('success', "You are disconnect from Veeva Vault.");
        $referer = $request->headers->get('referer');

        return $this->redirect($referer);
    }

    /**
     * @Route("/reset-password/{id}",name="reset_password")
     */
    public function resetPasswordAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/users/'.$id.'/password',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],
                        'form_params' => [
                            'password__v' => 'Vo7t2017',
                            'new_password__v' => 'Test123',
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
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id_rev
     * @return array
     */
    public function PdfExist($id_rev)
    {

        $path = $this->get('kernel')->getRootDir().'/../web/pdfveeva';

        $output = array();
        if (is_dir($path)) {
            // si il contient quelque chose
            if ($dh = opendir($path)) {

                // boucler tant que quelque chose est trouve
                while (($file = readdir($dh)) !== false) {
                    if ($file != '.' && $file != '..') {
                        // affiche le nom et le type
                        $output[] = array(
                            'path' => $path.'/'.$file,
                            'fileName' => preg_replace('/\\.[^.\\s]{3,4}$/', '', $file),
                            'Name' => $file,
                        );
                    }

                }
                // on ferme la connection
                closedir($dh);
            }

        }

        return $output;


    }


    /***
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     * @Route("/vault-connect" ,name="vault_connect")
     */
    public function generalVaultConnectAction(Request $request)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $company = !empty($user->getCompany()) ? $user->getCompany() : '';
        $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
        $form = $this->createFormBuilder()->setMethod('POST')->setAction($this->generateUrl('vault_login'))
            ->add('Email', EmailType::class)
            ->add('Password', PasswordType::class)
            ->add('Login', SubmitType::class)
            ->getForm();
        $form->handleRequest($request);


        return $this->render(
            'VeevaVaultBundle:VeevaPdf:VeevaGeneralLogin.html.twig',
            array(
                'form' => $form->createView(),
                'veevaUrl' => $veevaUrl,

            )

        );

    }

    /**
     * @return string
     * @route("/vault-login", name="vault_login")
     */
    public function vaultLogin(Request $request)
    {

        $user = $this->get('security.context')->getToken()->getUser();
        $company = !empty($user->getCompany()) ? $user->getCompany() : '';
        $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
        $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
        $data = $request->request->get('form');

        $email = $data['Email'];
        $pasword = $data['Password'];

        $client = new Client();
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
            $request->getSession()->getFlashBag()->add(
                'warning',
                $obj->responseMessage.'<p> Wrong login or password. </p>'
            );

        } else {
            $sessionId = $obj->sessionId;
            $session->set('TokenUserVeeva', $sessionId);
            $request->getSession()->getFlashBag()->add('success', "Success Veeva Login");
        }
        $referer = $request->headers->get('referer');

        return $this->redirect($referer);

    }

    /**
     * @Route("/dashboard-vault-pdf/{id_press}",name="dashboard_vault_pdf")
     * @param $id_press
     * @return Response
     */
    public function dashboardVaultPdfAction(Request $request, $id_press)
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
                $checkoutVaultMcm[$veevaData->getBinderId()] = $this->checkoutPdfVaultMcm($veevaData->getBinderId());
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
                    'VeevaVaultBundle:VeevaPdf:Dashboard.html.twig',
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
     * @param $idBinder
     * @return bool
     */
    public function checkoutPdfVaultMcm($idBinder)
    {
        $em = $this->getDoctrine()->getManager();
        $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($idBinder);
        $helper = $this->get('veeva_vault.helper.tools');
        $getDocByBinder = !empty($helper->getDocByBinder($idBinder)) ? $helper->getDocByBinder($idBinder) : '';
        $vaultArray = !empty($veeva->getVeevaDocuments()) ? \GuzzleHttp\json_decode($veeva->getVeevaDocuments()) : '';

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
     * @param $id_binder
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     * @Route("/synchro-document-pdf-mcm-veeva/{id_press}/{id_binder}" ,name="synchro_document_pdf_mcm_veeva")
     */
    public function synchroDocPdfMcmVaultAction(Request $request, $id_press, $id_binder)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $em = $this->container->get('doctrine')->getManager();
        $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres($id_press);
        /**regenerate pdf**/
        $parseUrl = $this->pdfPromoMats($id_rev, $id_press);
        if (!empty($parseUrl)) {
            $pdfName = $em->getRepository('PresentationBundle:Presentation')->getZipName($id_rev);
            $currentDate = new \DateTime();
            $pdf = $pdfName['pres'].'_'.$pdfName['company'].'_'.$pdfName['country'].'_'.$currentDate->format(
                    'mdY'
                ).'_'.$pdfName['version'];
            $pdfName = $this->slugify($pdf);
            $pres = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
            $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
            $company = $presService->recursiveFindParent($pres->getCompany()->getId());
            $awsConfig = $this->container->get('mcm.aws_media');
            $s3Client = $awsConfig->getS3Client();
            try {
                $response = $s3Client->doesObjectExist(
                    $awsConfig->expectedBucketName,
                    $company->getName().'/exported-pdf/'.$id_press.'-'.$id_rev.'/'.$pdfName.'.pdf'
                );

            } catch (S3Exception $e) {
                trigger_error($e->getAwsErrorMessage());
            }
            $path = '';
            if ($response == true) {
                $path = 'https://s3-eu-west-1.amazonaws.com/'.$awsConfig->expectedBucketName.'/'.$company->getName(
                    ).'/exported-pdf/'.$id_press.'-'.$id_rev.'/'.$pdfName.'.pdf';

            } else {

                $filename = 'Test_document_PDF.pdf';
                $dir = __DIR__.'/../../../../web/pdfveeva';
                $path = $dir.'/'.$filename;
            }

        } else {

            $filename = 'Test_document_PDF.pdf';
            $dir = __DIR__.'/../../../../web/pdfveeva';
            $path = $dir.'/'.$filename;
        }


        /**End**/
        $upload[] = array(
            'Content-type' => 'application/pdf',
            'name' => 'file',
            'contents' => fopen($path, 'r'),
        );
        $pdfExist = $helper->getDocByBinder($id_binder);
        $array = array();
        if (!empty($pdfExist)) {
            $docId = array_shift($pdfExist);
            $update_doc = $helper->addNewVersionDocument($array, $upload, $docId);
            $results2 = json_decode($update_doc->getBody());
            if (!empty($results2) && $results2->responseStatus != 'FAILURE') {
                $veeva = $em->getRepository('VeevaVaultBundle:Veeva')->getBinder($id_binder);
                $veeva->setVeevaDocuments($docId);
                $em->flush();

                $request->getSession()
                    ->getFlashBag()
                    ->add('success', $results2->responseMessage);
            } else {
                if (!empty($results2->errors[0])) {
                    if ($results2->errors[0]->type == "INSUFFICIENT_ACCESS") {
                        $request->getSession()
                            ->getFlashBag()
                            ->add(
                                'warning',
                                'You do not have permission to access this binder. To create a new binder, please click on "Create Binder".'
                            );
                    }
                } else {
                    $request->getSession()
                        ->getFlashBag()
                        ->add('warning', 'Insufficient access.');

                }

            }

            $referer = $request->headers->get('referer');

            return $this->redirect($referer);
        }


    }
}
