<?php

namespace ArgoMCMBuilder\PresentationBundle\Controller;

use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\PresentationBundle\Objects\Catcher;
use FOS\UserBundle\Tests\TestUser;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Entity\Reference;
use ArgoMCMBuilder\PresentationBundle\Form\Type\CreatePresentationType;
use ArgoMCMBuilder\PresentationBundle\Form\Type\editPresentationType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use Aws\S3\S3Client;
use Symfony\Component\Filesystem\Filesystem;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;
/**
 * Class PresentationController.
 */
class PresentationController extends Controller
{
    const ACTIVE_PRESENTATION   = 20;
    const ARCHIVED_PRESENTATION = 10;

    /**
     * @Route("/my-clm-presentations/my-active-clm-presentations", name="presentations")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function indexAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {
            $aJson = $this->ajax($request, self::ACTIVE_PRESENTATION);

            return new Response($aJson, 200, ['Content-Type' => 'application/json']);
        }

        return $this->render(
            'PresentationBundle:Presentation:index.html.twig'
        );
    }

    /**
     * @param Request $request
     * @param null $idProject
     * @Route("/my-clm-presentations/create_new_presentation/{idProject}", name="create_new_pres")
     *
     * @return RedirectResponse|Response
     */
    public function createPresentationFormAction(Request $request, $idProject = null)
    {
        $user = $this->getUser();
        $company = $user->getCompany();
        $presentation = new Presentation();
        $companyProject = null;
        if ($idProject != null) {
            $project = $this->getDoctrine()->getRepository('ProjectBundle:Project')->find($idProject);
            $companyProject = $project->getCompany()->getId();
        }
        $form = $this->createForm(
            new CreatePresentationType($company->getId(), $idProject, $user, $companyProject, $request->getHttpHost()),
            $presentation
        );

        $session = $request->getSession();

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);
            $territories = $request->get('territories');
            $companies = $request->get('campanies');
            if ($form->isValid()) {
                try {
                    $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
                    $presService->CreateNewPresentation($form->getData(), $form, $territories, $companies, $user);
                    $session->getFlashBag()->add(
                        'success',
                        $this->get('translator')->trans('presentation.success.create', array(), 'presentations')
                    );

                    return new RedirectResponse(
                        $this->generateUrl('projects_view', array('id' => $form->getData()->getProject()->getId()))
                    );
                } catch (BusinessException $be) {
                    $session->getFlashBag()->add($be->getLevel(), $be->getMessage());
                }
            }
        }

        return $this->render(
            'PresentationBundle:Presentation:createPresentationForm.html.twig',
            array(
                'presForm' => $form->createView(),
            )
        );
    }

    /**
     * @param Request $request
     * @param int $idPres
     * @Route("/my-clm-presentations/edit-presentation/{idPres}", name="edit_form_pres")
     *
     * @return RedirectResponse|Response
     */
    public function editPresentationFormAction(Request $request, $idPres)
    {
        $presentation = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find($idPres);
        if ($presentation === null) {
            throw $this->createNotFoundException('Presentation does not exist');
        }

        if ($presentation->getType() == 'Localisation') {
            $company = $presentation->getParent()->getCompany();
        } else {
            $company = $presentation->getProject()->getCompany();
        }
        $form = $this->createForm(new editPresentationType($company->getId(), $request->getHttpHost()), $presentation);
        $em = $this->getDoctrine()->getManager();
        $session = $request->getSession();

        if ($request->getMethod() == 'POST') {
            $oldType = $presentation->getType();
            $form->handleRequest($request);
            $territories = $request->get('territories');
            $companies = $request->get('campanies');
            $newType = $presentation->getType();
            $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
            if ($form->isValid()) {
                try {
                    if ($oldType == $newType) {
                        if ($oldType == 'Master') {
                            $presService->EditPresentationForm($form->getData(), $form, $territories, $companies);
                        }
                        $em->flush();
                    } else {
                        $presService->EditPresentationForm($form->getData(), $form, $territories, $companies);
                    }

                    $session->getFlashBag()->add(
                        'success',
                        $this->get('translator')->trans('presentation.success.edit', array(), 'presentations')
                    );

                    return new RedirectResponse(
                        $this->generateUrl('projects_view', array('id' => $presentation->getProject()->getId()))
                    );
                } catch (BusinessException $be) {
                    $session->getFlashBag()->add($be->getLevel(), $be->getMessage());
                }
            }
        }
        $localisations = $presentation->getChildren();

        return $this->render(
            'PresentationBundle:Presentation:editPresentationForm.html.twig',
            array(
                'presForm' => $form->createView(),
                'localisations' => $localisations,
            )
        );
    }

    /**
     * edit Presentation.
     *
     * @param int $idPres
     * @Route("/my-clm-presentations/{idPres}/edit", name="presentations_edit_presentation")
     *
     * @return Response
     */
    public function editPresentationAction(Request $request, $idPres)
    {
        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();
        $id = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres($idPres);
        $revision = $em->getRepository('PresentationBundle:Revision')->findOneBy(
            array('id' => $id, 'presentation' => $idPres)
        );

        if ($revision === null) {
            throw $this->createNotFoundException('Revision does not exist');
        }
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        if ($pres === null) {
            throw $this->createNotFoundException('Presentation does not exist');
        }
        if ($this->container->getParameter('kernel.environment') != 'dev') {
            $currentDate = new \DateTime();
            $currentDate = $currentDate->getTimestamp();
            if ($pres->getLastUsed()) {
                $lastUsed = $pres->getLastUsed()->getTimestamp();
            } else {
                $lastUsed = 0;
            }

            $diff = $currentDate - $lastUsed;
            $usedBy = null;
            if ($pres->getUsedBy()) {
                $usedBy = $pres->getUsedBy()->getId();
            }
            if ($pres->getModeEdit() == 20 && $diff <= 70 && $usedBy != $user->getId()) {
                $session = $this->getRequest()->getSession();
                $session->getFlashBag()->add(
                    'success',
                    'the presentation '.$pres->getName().' is actualy used by another user'
                );

                return new RedirectResponse(
                    $this->generateUrl('projects_view', array('id' => $pres->getProject()->getId()))
                );
            }
        }
        $PageIdToRemove = false;
        //find pdf
        $idCompany = $this->getUser()->getCompany()->getId();
        $companyName = $this->getUser()->getCompany()->getName();
        // $pdfByCompany = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->findBy(
        //     array('Company' => $idCompany, 'contentType' => 'application/pdf')
        // );

        $pdfByRev = $revision->getPdf();
//        if ($pdfByPres === null) {
//            throw $this->createNotFoundException('pdf does not exist');
//        }
        $presentationService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $companyParent = $presentationService->recursiveFindParent($pres->getCompany()->getId());
        $aReference = $em->getRepository('PresentationBundle:Reference')->findBy(array('presentation' => $pres));
        $formRef = $this->createForm('ArgoMCMBuilder\PresentationBundle\Form\ReferenceType');
        if ($this->container->getParameter('kernel.environment') != 'dev') {
            $pres->setLastUsed(new \DateTime());
            $pres->setModeEdit(20);
            $pres->setUsedBy($user);
            $em->flush();
        }
        $env = $this->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();
        /**Get Exist Binder with type**/
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $types = $em->getRepository('VeevaVaultBundle:Veeva')->getExistTypeBinder($presentation);
        /**Get Company user vault**/
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionVeeva = $helper->token_instance();
        if (!empty($sessionVeeva)) {
            $dataUser = $helper->currentUserDetailsAction();
            if ($dataUser->responseStatus == "SUCCESS") {
                $idCompanyVault = $dataUser->users[0]->user->vault_id__v[0];
            }
        }
        $idCompanyVault = !empty($idCompanyVault) ? $idCompanyVault : '';
        if (!empty($types)) {
            foreach ($types as $type) {
                switch ($type['type']) {
                    case 'pdf':
                        $is_binder_pdf = $em->getRepository('VeevaVaultBundle:Veeva')->getExistBinderByCompany(
                            $presentation,
                            'pdf',
                            $idCompanyVault
                        );
                        break;
                    case 'zip':
                        $is_binder_zip = $em->getRepository('VeevaVaultBundle:Veeva')->getExistBinderByCompany(
                            $presentation,
                            'zip',
                            $idCompanyVault
                        );
                        break;
                }
            }
        }

        /**End**/
        $Listrevisions = $em->getRepository('PresentationBundle:Revision')->getListRevisionByPres($idPres);
        return $this->render(
            'PresentationBundle:Presentation:editPresentation.html.twig',
            array(
                'user' => $user,
                'data' => $revision,
                'references' => $aReference,
                'formRef' => $formRef->createView(),
                'version' => $revision->getVersion(),
                'idPres' => $idPres,
                'idRev' => $id,
                'idCompany' => $idCompany,
                'companyName' => $companyName,
                'companyParentName' => $companyParent->getName(),
                // 'pdfbycomp' => $pdfByCompany,
                'pdfbyrev' => $pdfByRev,
                'additionalText' => $pres->getAdditionalText(),
                'env' => $env[$currentUrl],
                'PageIdToRemove' => $PageIdToRemove,
                'revisions' => $Listrevisions,
                'max_size_zip' => $this->container->getParameter('max_size_zip'),
                'isBinderPdf' => !empty($is_binder_pdf) ? $is_binder_pdf->getBinderId() : '',
                'isBinderZip' => !empty($is_binder_zip) ? $is_binder_zip->getBinderId() : '',
            )
        );
    }


        public function recursiveFindParent($companyId, $em)
        {
            $company = $em->getRepository('UserBundle:Company')->find($companyId);

            if ($company !== null and $company->getParent() !== null)
            {
                 $parentName = $this->recursiveFindParent($company->getParent()->getId(), $em);

                 return $parentName;
            }
            else
            {
                return $company->getName();
            }
        }

    /**
     * @param $name
     * @return null
     */
    public function getParameterIfNotNull($name)
    {
        if (isset($name)) {
            return $name;
        }

        return null;
    }

    /**
     * @Route("/ajax-save-presentation/{idPres}", name="presentation_ajax_save_pres")
     *
     * @param int $idPres
     *
     * @return JsonResponse
     */
    public function ajaxSavePres($idPres)
    {
        $em = $this->getDoctrine()->getManager();
        $data = $this->get('request')->request->all();
        $this->get('mcm.save_slides')->save($data, $idPres);
        $revision = $em->getRepository('PresentationBundle:Revision');
        $revision = $revision->getLastIdRevisionByPres($idPres);

        return new JsonResponse(
            array(
                "version" => $revision->getVersion(),
                "comment" => $revision->getComment(),
                "user" => $revision->getUser()->getFullName(),
                "idRev" => $revision->getId(),
                "createAt" => $revision->getCreatedAt()->format('d-m-Y H:i'),
                "parent" => $revision->getParent(),
            )
        );
    }

    /**
     * @Route("/save-new-revision/{idPres}/{idRev}", name="presentation_save_new_revision")
     *
     * @param int $idPres
     * @param int $idRev
     *
     * @return JsonResponse
     */
    public function ajaxSaveNewRev($idPres, $idRev)
    {
        $this->get('mcm.save_slides')->cloneRevision($idRev, $idPres, "1");
        return new JsonResponse(array('success' => 'true'));
    }

    /**
     * @param int $id
     * @Route("/backup_version/{id}", name="presentation_backup_version")
     *
     * @return RedirectResponse
     */
    public function backupVersionAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($id);
        $revision->setClmParameters($revision->getOldParameters());
        $revision->setData($revision->getOldData());
        $revision->setDataPopin($revision->getDataOldPopin());
        $em->flush();

        return new RedirectResponse($this->generateUrl('presentations'));
    }

    /**
     * @param Request $request
     * @param int $id
     * @Route("/delete_ref_byrevision/{id}", name="pres_delete_reference")
     *
     * @return Response
     */
    public function deleteReferenceAction(Request $request, $id)
    {
        if ($request->isXmlHttpRequest()) { // pour vérifier la présence d'une requete Ajax
            $em = $this->getDoctrine()->getManager();
            $reference = $em->getRepository('PresentationBundle:Reference')->find($id);
            $em->remove($reference);
            $em->flush();

            return new Response('success');
        }

        return new Response('failure');
    }

    /**
     * @param Request $request
     * @Route("/save-reference", name="presentation_save_reference")
     *
     * @return Response
     */
    public function saveReferenceAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {

            $title = $this->get('request')->request->get('title');
            $description = $this->get('request')->request->get('description');
            $idPres = $this->get('request')->request->get('idPres');

            $em = $this->getDoctrine()->getManager();
            $presentation = $em->getRepository('PresentationBundle:Presentation')->find($idPres);

            $reference = new Reference();
            $reference->setTitle($title);
            $reference->setDescription($description);
            $reference->setPresentation($presentation);

            $checkRand = true;
            do {
                $rand = $this->randomString(5);
                $referenceTest = $em->getRepository('PresentationBundle:Reference')->findBy(array('code' => $rand));
                if (!$referenceTest) {
                    $checkRand = false;
                }
            } while ($checkRand);

            $reference->setCode($rand);
            $em->persist($reference);
            $em->flush();

            $html = '';
            $html = '<div class="item-ref sheet" id="'.$reference->getCode().'">
            <input class="refId" name="refId" value="'.$reference->getId().'" type="hidden">
            <span id="'.$reference->getCode().'" class="title ref-title">'.$title.'</span>
            <a href="javascript:void(0)" class="ref-link close-link pull-right" data-toggle="tooltip"
            data-original-title="Delete Reference" data-href="//delete_ref_byrevision/'.$reference->getId().'">
            <i class="fa fa-trash"></i></a><a class="ref-link ref-edit pull-right"><i class="fa fa-edit"></i></a>
            <a class="ref-link cancel-link pull-right" style="display: none;"><i class="fa fa-close"></i></a>
            <a class="ref-link ref-save pull-right" style="display: none;"><i class="fa fa-save"></i></a>
            <div class="ref-desc">'.$description.'</div></div>';

            return new Response($html);
        }

        return new Response('failure');
    }

    /**
     * @param Request $request
     * @Route("/update_reference", name="presentation_revision_reference_update")
     *
     * @return Response
     */
    public function updateReferenceAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) { // pour vérifier la présence d'une requete Ajax
            $em = $this->getDoctrine()->getManager();
            $title = $this->get('request')->request->get('title');
            $description = $this->get('request')->request->get('description');
            $refID = $this->get('request')->request->get('refId');

            $reference = $em->getRepository('PresentationBundle:Reference')->find($refID);
            $reference->setTitle($title);
            $reference->setDescription($description);
            $em->flush();

            return new Response('success');
        }

        return new Response('failure');
    }

    /**
     * @param Request $request
     * @Route("/my-clm-presentations/archived-clm-presentation", name="presentations_archived_presentation")
     *
     * @return Response
     */
    public function archivedPresentationAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {
            $aJson = $this->ajax($request, self::ARCHIVED_PRESENTATION);

            return new Response($aJson, 200, ['Content-Type' => 'application/json']);
        }

        return $this->render('PresentationBundle:Presentation:archivedPresentation.html.twig');
    }

    /**
     * @param int $img
     * @param int $idRev
     * @Route("/my-clm-presentations/{img}/{idRev}/image", name="presentations_image")
     *
     * @return Response
     */
    public function getImageAction($img, $idRev)
    {
        return $this->render(
            'PresentationBundle:Presentation:snappy.html.twig',
            array(
                'img' => $img,
                'idRev' => $idRev,
            )
        );
    }

    /**
     * @param inetger $idRev
     * @Route("/my-clm-presentations/{idRev}/preview", name="presentations_preview")
     *
     * @return Response
     */
    public function previewAction(Request $request, $idRev)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($idRev);
        $pdf = $revision->getPdf()->toArray();
        $env = $this->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();

        $settings = json_decode($revision->getPreSettings());

        return $this->render(
            'PresentationBundle:Presentation:preview.html.twig',
            array(
                'data' => $revision,
                'pdfList' => $pdf,
                'parameters' => $settings,
                'env' => $env[$currentUrl],
            )
        );
    }

    /**
     * @param int $idRev
     * @param int $dataId
     * @param int $height
     * @param int $width
     * @Route("/my-clm-presentations/{idRev}/{dataId}/{height}/{width}/popin", name="popin_preview")
     *
     * @return Response
     */
    public function previewPopinAction($idRev, $dataId, $height, $width)
    {

        $em = $this->getDoctrine()->getManager();
        /**
         * @var Revision $revision
         */
        $revision = $em->getRepository('PresentationBundle:Revision')->getJsonPopins($idRev);
        $dataPopin = (array)json_decode($revision['popin']);
        // foreach ($dataPopin as $popin) {
        //             dump($popin->{'class'});
        // }
        //die();


        // libxml_use_internal_errors(true);  // Pour l'HTML 5
        // $document = new \DOMDocument();
        // libxml_clear_errors();  // Pour l'HTML 5
        // $popins = $revision->getDataPopin();
        // $content = str_replace("\n", '', $popins);
        // $document->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
        // $xpath = new \DOMXPath($document);
        // $firstPopins = $xpath->query("//*[contains(@data-id, '$dataId')]")->item(0);
        //
        // $innerHTML = '';
        //
        // $tmpDom = new \DOMDocument();
        // $tmpDom->appendChild($tmpDom->importNode($firstPopins, true));
        // $innerHTML .= trim($tmpDom->saveHTML());

        // dump($dataPopin);
        // die();

        return $this->render(
            'PresentationBundle:Presentation:preview_popin.html.twig',
            array(
                'popinId' => $dataId,
                'data' => $dataPopin,
                'height' => $height,
                'width' => $width,
            )
        );
    }

    /**
     * Print pdf with chrome or chromium (css).
     *
     * @param int $idRev
     * @Route("/my-clm-presentations/{idRev}/preview-pdf", name="presentations_preview_pdf")
     *
     * @return Response
     */
    public function lightPreviewAction(Request $request, $idRev)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($idRev);
        $env = $this->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();
        $settings = json_decode($revision->getPreSettings());

        return $this->render(
            'PresentationBundle:Presentation:preview.min.html.twig',
            array(
                'data' => $revision,
                'parameters' => $settings,
                'env' => $env[$currentUrl],
            )
        );
    }

    /**
     * get Revsion.
     *
     * @param int $idRev
     *
     * @todo correct function name "i"
     *
     * @return Response
     */
    public function getRevisionAction($idRev)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($idRev);

        return $revision;
    }

    /**
     * Print Notes pdf with chrome or chromium (css).
     *
     * @param int $idRev
     * @Route("/my-clm-note-presentations/{idRev}/{plateform}/{tabChecked}", name="presentations_note_preview_pdf")
     *
     * @return Response
     */
    public function notePreviewAction(Request $request, $idRev, $plateform, $tabChecked)
    {
        $revision = $this->getRevisionAction($idRev);
        $settings = json_decode($revision->getPreSettings());
        $dataPopin = $revision->getPopin();
        $pdf = $revision->getPdf()->toArray();

        $companyName = $revision->getPresentation()->getCompany()->getName();
        $version = $revision->getPresentation()->getVersion();
        if (null === $revision->getPresentation()->getOwner()) {
            throw $this->createNotFoundException('Owner is not Found');
        }
        $presOwnerName = $revision->getPresentation()->getOwner()->getFullName();
        $projectOwnerName = $revision->getPresentation()->getProject()
                ->getOwner()->getFirstname().' '.$revision->getPresentation()->getProject()->getOwner()->getLastname();
        $projectName = $revision->getPresentation()->getProject()->getName();
        $btClosePopin = json_decode($revision->getPreSettings())->dataBgBtnClose;
        $env = $this->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();
        $optionlist = null;
        if (strrpos($tabChecked, 'chapter-name') == false && strrpos($tabChecked, 'name-screen') == false
            && strrpos($tabChecked, 'page-id') == false && strrpos($tabChecked, 'scrollable-txt') == false
            && strrpos($tabChecked, 'link-popin') == false && strrpos($tabChecked, 'link-screen') == false
            && strrpos($tabChecked, 'animations') == false && strrpos($tabChecked, 'link-pdf') == false
            && strrpos($tabChecked, 'references') == false) {
            if (strrpos($tabChecked, 'comments') == false) {
                $optionlist = "comments-options-list-pdf";
            } else {
                $optionlist = "options-list-pdf";
            }
        }else{
            if (strrpos($tabChecked, 'comments') == false) {
                $optionlist = "options-list-pdf";
            }
        }
        $comments = true;
        if (strrpos($tabChecked, 'comments') == false) {
            $comments = false;
        }

        return $this->render(
            'PresentationBundle:Presentation:notePreview.html.twig',
            array(
                'data' => $revision,
                'pdfList' => $pdf,
                'presOwnerName' => $presOwnerName,
                'projectOwnerName' => $projectOwnerName,
                'projectName' => $projectName,
                'version' => $version,
                'companyName' => $companyName,
                'dataPopin' => $dataPopin,
                'idRev' => $idRev,
                'plateform' => $plateform,
                'btClosePopin' => $btClosePopin,
                'env' => $env[$currentUrl],
                'tabChecked' => $tabChecked,
                'optionlist' => $optionlist,
                'comments' => $comments,
                'parameters' => $settings,
            )
        );
    }

    /**
     * Print Notes pdf with chrome or chromium (css).
     *
     * @param int $idRev
     * @Route("/my-clm-first-page-presentations/{idRev}", name="presentations_first_page_preview_pdf")
     *
     * @return Response
     */
    public function notePreviewFirstPageAction($idRev)
    {
        $revision = $this->getRevisionAction($idRev);
        if (null === $revision->getPresentation()->getOwner()) {
            throw $this->createNotFoundException('Owner is not Found');
        }
        $presOwnerName = $revision->getPresentation()->getOwner()->getFullName();
        $projectOwnerName = $revision->getPresentation()->getProject()->getOwner()
                ->getFirstname().' '.$revision->getPresentation()
                ->getProject()->getOwner()->getLastname();
        $projectName = $revision->getPresentation()->getProject()->getName();
        $companyName = $revision->getPresentation()->getCompany()->getName();
        $curentDate = date('d-m-Y');
        $url = json_decode($revision->getPreSettings())->dataLogoPresUrl;

        return $this->render(
            'PresentationBundle:Presentation:firstPagePdfPreview.html.twig',
            array(
                'presOwnerName' => $presOwnerName,
                'projectOwnerName' => $projectOwnerName,
                'projectName' => $projectName,
                'curentDate' => $curentDate,
                'urlLogo' => $url,
                'companyName' => $companyName,
            )
        );
    }

    /**
     * @param $array
     * @param $key
     *
     * @return array
     */
    public function unique_multidim_array($array, $key)
    {
        $temp_array = array();
        $i = 0;
        $key_array = array();

        foreach ($array as $val) {
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[$i] = $val;
            }
            ++$i;
        }

        return $temp_array;
    }

    /**
     * Print Notes pdf with chrome or chromium (css).
     *
     * @param int $idRev
     * @Route("/my-clm-last-page-presentations/{idRev}/{plateform}/{tabChecked}", name="presentations_last_page_preview_pdf")
     *
     * @return Response
     */
    public function notePreviewLastPageAction(Request $request, $idRev, $plateform, $tabChecked)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $revision = $this->getRevisionAction($idRev);
        $idPres = $revision->getPresentation()->getId();
        $dataPopin = $revision->getPopin();
        $pdf = $revision->getPdf()->toArray();
        $aReference = $em->getRepository('PresentationBundle:Reference')->findBy(array('presentation' => $idPres));
        $companyName = $revision->getPresentation()->getCompany()->getName();
        $version = $revision->getPresentation()->getVersion();
        if (null === $revision->getPresentation()->getOwner()) {
            throw $this->createNotFoundException('Owner is not Found');
        }
        $presOwnerName = $revision->getPresentation()->getOwner()->getFirstname().' '.$revision->getPresentation()
                ->getOwner()->getLastname();
        $projectOwnerName = $revision->getPresentation()->getProject()->getOwner()
                ->getFirstname().' '.$revision->getPresentation()->getProject()->getOwner()->getLastname();
        $projectName = $revision->getPresentation()->getProject()->getName();
        $env = $this->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();

        return $this->render(
            'PresentationBundle:Presentation:lastPagePdfPreview.html.twig',
            array(
                'data' => $revision,
                'aReference' => $aReference,
                'pdfList' => $pdf,
                'presOwnerName' => $presOwnerName,
                'projectOwnerName' => $projectOwnerName,
                'projectName' => $projectName,
                'version' => $version,
                'companyName' => $companyName,
                'dataPopin' => $dataPopin,
                'idRev' => $idRev,
                'plateform' => $plateform,
                'env' => $env[$currentUrl],
                'tabChecked' => $tabChecked,
            )
        );
    }

    /**
     * flow Diagram Print Notes pdf with chrome or chromium (css).
     *
     * @param int $idPres
     * @param int $idRev
     * @Route("/my-clm-flow-diagram-presentations/{idPres}/{idRev}", name="presentations_flow_diagram_pdf")
     *
     * @return Response
     */
    public function flowDiagramAction($idPres, $idRev)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $this->getRevisionAction($idRev);
        $slides = json_decode($revision->getSlides());
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $presentationService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $companyParent = $presentationService->recursiveFindParent($pres->getCompany()->getId());

        $aws = $this->getParameter('aws');
        $urlS3 = "https://s3-".$aws['region'].".amazonaws.com/".$aws['env_bucket']."/".$companyParent->getName()."/thumbs";

        $htmlCode = '';
        foreach ($slides as $i => $slide) {
            if (property_exists($slides[$i], 'children')) {
                $children = (array)$slide->{'children'};
                foreach ($children as $k => $child) {
                    $img = '<img width="150px" height="100px" src="'.$urlS3.'/'.$idPres.'-'.$idRev.'/slides/screen-'.$child->{'attributes'}->{'data-id'}.'.jpg" />';
                    if (0 == $k) {
                        $htmlCode = $htmlCode.'<div class="pull-left">'.$img;
                    } else {
                        $htmlCode = $htmlCode.'<div class="pull-rigth" >'.$img.'</div>';
                    }
                }
                $htmlCode = $htmlCode.'</div>';
            } else {
                $htmlCode .= '<div class="pull-left"><img width="150px" height="100px" src="'.$urlS3.'/'.$idPres.'-'.$idRev.'/slides/screen-'.$slide->{'attributes'}->{'data-id'}.'.jpg" /></div>';
            }
        }
        return $this->render(
            'PresentationBundle:Presentation:flowDiagramPdf.html.twig',
            array('htmlCode' => $htmlCode)
        );
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
                        )) {
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
     * print Pdf Decktape.
     *
     * @param int $idPres
     * @param int $idRev
     * @param string $plateform
     * @param Request $request
     * @Route("/my-clm-presentations/{idPres}/{idRev}/{plateform}/{tabChecked}/pdf", name="presentations_preview_pdf_decktape")
     *
     * @return JsonResponse
     */
    public function printPdfDecktapeAction($idPres, $idRev, $plateform, $tabChecked, Request $request)
    {
        //Add name PDf
        $em = $this->getDoctrine()->getManager();
        $fileName = $em->getRepository('PresentationBundle:Presentation')->getZipName($idRev);
        $currentDate = new \DateTime();
        $pdf = $fileName['pres'].'_'.$fileName['company'].'_'.$fileName['country'].'_'.$currentDate->format('mdY').'_'.$fileName['version'];
        $fileName = $this->slugify($pdf);
        if (empty($fileName)) {
            return $fileName = $idRev;
        }

        //Add List of Pdf
        if (strrpos($tabChecked, 'link-rcp-pdf') == false)
        {
            $rcpList = "null";
        }else{
            $rcpList = $this->getListRcp($idPres, $idRev);
        }

        $presentationService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $companyParent = $presentationService->recursiveFindParent($pres->getCompany()->getId());
        $baseUrl = $this->get('request')->getSchemeAndHttpHost().'/';
        $urlPDF = $baseUrl.$this->getParameter('locale').'/medias/showPdf/'.$fileName.'?key='.$idPres.'-'.$idRev.'&company='.$companyParent->getName();
        // print pdf with template
        $response = $this->get('clm.print_pdf')->printPdf($idRev, $idPres, $fileName, $tabChecked, $rcpList, $plateform, $urlPDF, "1");
        if($response){
            return new JsonResponse(array('pdfURL' => $urlPDF, 'pdfName' => $fileName));
        }else{
            return new JsonResponse(array('message' => 'Failed to generated PDF'), 400);
        }
    }

    /**
     * GET Route annotation.
     *
     * @Method({"GET", "POST"})
     * @Route("/medias/showPdf/{pdfName}", name="show_pdf")
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function showPdfAction(Request $request, $pdfName)
    {
        if ($this->getUser()) {
            $key = $request->query->get('key');
            $company = $request->query->get('company');
            $s3Client = new S3Client(
                [
                    'version' => '2006-03-01',
                    'region' => 'eu-west-1',
                    'credentials' => [
                        'key' => 'AKIAIBJ5TEFCI26MLU2A',
                        'secret' => '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',
                    ],
                ]
            );
            /*'key' => 'AKIAIQD2ECGCACM6ETUA',
            'secret' => '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',*/
            $url = $s3Client->getObjectUrl('veeva-summit', $company.'/exported-pdf/'.$key.'/'.$pdfName.'.pdf');
            $response = new Response();
            $response->headers->set('Content-Type', 'application/pdf');
            $response->headers->set('Content-Disposition', 'inline');
            $response->setContent(file_get_contents($url));

            return $response;
        } else {
            throw $this->createAccessDeniedException('You cannot access this page!');
        }
    }

    /**
     * @param int $idPres
     * @param Request $request
     * @Route("/my-clm-presentations/{idPres}/duplicate", name="presentations_duplicate")
     *
     * @return RedirectResponse
     */
    public function duplicateAction($idPres, Request $request)
    {
        $session = $request->getSession();
        $duplicatePres = $this->container->get('mcm.cloner_presentation');
        $em = $this->getDoctrine()->getManager();
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        if ($presentation->getCompany() == null) {
            $session->getFlashBag()->add('notice', 'this presentation cannot be duplicated');
        } else {
            $duplicatePres->duplicate($idPres);
            $session->getFlashBag()->add('success', 'The presentation is successfully duplicated');
        }
        $idProject = $presentation->getProject()->getId();

        return new RedirectResponse(
            $this->generateUrl('projects_view', array('id' => $idProject))
        );
    }

    /**
     * change State Presentation.
     *
     * @param int $id
     * @param int $activeOrArchive
     * @Route("my-clm-presentations/change-state-presentation/{id}/{activeOrArchive}", name="presentations_change_state_presentation")
     *
     * @return RedirectResponse
     */
    public function changeStatePresentationAction($id, $activeOrArchive)
    {
        $em = $this->getDoctrine()->getManager();
        $oPresentation = $em->getRepository('PresentationBundle:Presentation')->find($id);

        if (null == $oPresentation) {
            throw $this->createNotFoundException('Presentation is not Found');
        }

        if ('archive' === $activeOrArchive) {
            $oPresentation->setIsActive(self::ACTIVE_PRESENTATION);
            if ($oPresentation->getType() == 'Master') {
                $localPres = $oPresentation->getChildren();
                foreach ($localPres as $loc) {
                    $loc->setIsActive(self::ACTIVE_PRESENTATION);
                }
            }
            $em->flush();
            $this->get('session')->getFlashBag()->add('notice', 'The presentation is active');

            return new RedirectResponse($this->generateUrl('presentations_archived_presentation'));
        }

        $oPresentation->setIsActive(self::ARCHIVED_PRESENTATION);
        if ($oPresentation->getType() == 'Master') {
            $localPres = $oPresentation->getChildren();
            foreach ($localPres as $loc) {
                $loc->setIsActive(self::ARCHIVED_PRESENTATION);
            }
        }
        $em->flush();
        $this->get('session')->getFlashBag()->add('notice', 'The presentation is archive');

        return new RedirectResponse($this->generateUrl('presentations'));
    }

    /**
     * @param Request $request
     * @param bool $isActive
     *
     * @return string
     */
    public function ajax(Request $request, $isActive)
    {
        /*
        * Param for pagination
        */
        $length = $request->get('length');
        $length = $length && ($length != -1) ? $length : 0;
        $start = $request->get('start');
        $start = $length ? ($start && ($start != -1) ? $start : 0) / $length : 0;

        $search = $request->get('search');
        $order = $request->get('order');

        $data = ['query' => @$search['value']];

        // filters
        $data['presentationName'] = $request->get('presentationName');
        $data['status'] = $request->get('status');
        $data['type'] = $request->get('type');
        $data['product'] = $request->get('product');
        $data['company'] = $request->get('company');
        $data['agency'] = $request->get('agency');
        $data['project'] = $request->get('project');
        $data['owner'] = $request->get('owner');
        $data['territory'] = $request->get('territory');

        $user = $this->getUser();
        $company = $this->getUser()->getCompany();
        $em = $this->getDoctrine()->getManager();
        $data['idUser'] = $user->getId();
        $data['idCompany'] = $company->getId();
        $data['isActive'] = $isActive; // 20 is Active, 10 is not
        $data['order'] = $order[0];
        $data['userRole'] = $user->getRoles();
        $presentationList = $em->getRepository('PresentationBundle:Presentation')->findAllByUserCompany(
            $data,
            $start,
            $length,
            true
        );
        $listCompId = $em->getRepository('UserBundle:Company')->getAllChildrenRecursive(
            $user->getCompany()->getId()
        );
        $all = $em->getRepository('PresentationBundle:Presentation')->findAllByUserCompany($data, 0, false);

        $output = array(
            'data' => array(),
            'recordsFiltered' => count($all), // $filters, 0, false
            'recordsTotal'    => count($all),
            'userId'          => $user->getId(),
            'userRole'        => $user->getRoles(),
            'listCompany'     => $listCompId,
        );
        foreach ($all as $one) {
            $output['filter'][] = [
                'type' => $one['type'],
                'status' => $one['status'],
                'companyName' => $one['companyName'],
                'agencyName' => $one['agencyName'],
                'project' => $one['projectName'],
                'owner' => $one['firstname'].' '.$one['lastname'],
                'territories' => $one['territoryName'],
            ];
        }
        $productsForSearch = array();

        foreach ($presentationList as $presentation) {
            //$listProduct = array();
            $pres = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find(
                $presentation['id']
            );

            $products = '';
            foreach ($pres->getProducts() as $product) {
                $products .= $product->getName().' ';
                array_push($productsForSearch, $product->getName());
            }
            $editors = array();
            foreach ($pres->getEditors() as $editor) {
                array_push($editors, $editor->getId());
            }
            $viewers = array();
            foreach ($pres->getViewers() as $viewer) {
                array_push($viewers, $viewer->getId());
            }
//            if ($user->hasRole('ROLE_MANAGER') || $user->hasRole('ROLE_ADMIN') || $user->hasRole('ROLE_SUPER_ADMIN')
//                || in_array($user->getId(), $editors) || in_array($user->getId(), $viewers) || $user->getId()
//                == $presentation['ownerId'] || $user->getId() == $pres->getProject()->getOwner()->getId()
//            ) {
            $date = $presentation['lastUpDate']->format('Y-m-d H:i:s');
            $id = $presentation['id'];
            $revisionId = $presentation['revId'];
            $activeOrArchive = $request->get('twigParent'); // twigParent not the state!
            $url = $this->generateUrl(
                'presentations_change_state_presentation',
                array('id' => $id, 'activeOrArchive' => $activeOrArchive)
            );
            $editUrl = $this->generateUrl(
                'presentations_edit_presentation',
                array('idPres' => $id)
            );
            $urlDelete = $this->generateUrl(
                'delete_presentation',
                array('idPres' => $presentation['id'])
            );
            $editFormUrl = $this->generateUrl(
                'edit_form_pres',
                array('idPres' => $presentation['id'])
            );
            $duplicateUrl = $this->generateUrl(
                'presentations_duplicate',
                array('idPres' => $presentation['id'])
            );

            $urlPreview = $this->generateUrl(
                'presentations_preview',
                array('idRev' => $presentation['revId'])
            );
            $title = ($activeOrArchive == "active") ? $this->get('translator')->trans('presentations.archive.title', array(), 'presentations') : $this->get('translator')->trans('presentations.active.title', array(), 'presentations');
            $productsForSearch = array_values(array_unique($productsForSearch));
            $idPresentation = $presentation['id'];
            $output['productForSearch'] = $productsForSearch;
            $output['host'] = $request->getHttpHost();
            $output['data'][] = [
                'change' => "<a href=\"javascript:void(0)\" class=\"$activeOrArchive-presentation\" data-href=\"$url\" data-id=\"$idPresentation\" title =\"$title\" data-toggle=\"tooltip\"><span></span></a>",
                'name' => $presentation['name'],
                'project' => $presentation['projectName'],
                'product' => $products,
                'type' => $presentation['type'],
                'status' => $presentation['status'],
                'territories' => $presentation['territoryName'],
                'companyName' => $presentation['companyName'],
                'agencyName' => $presentation['agencyName'],
                'companyId' => $presentation['companyId'],
                'owner' => $presentation['firstname'].' '.$presentation['lastname'],
                'lastUpDate' => $date,
                'version' => $presentation['version'],
                'id' => $presentation['id'],
                'isActive' => $presentation['isActive'],
                'lock' => $presentation['lock'],
                'presentation_actions' => '<span class="actions"></span>',
                'urlEdit' => $editUrl,
                'urlDelete' => $urlDelete,
                'urlArchiveOrActive' => $url,
                'urlEditForm' => $editFormUrl,
                'ownerId' => $presentation['ownerId'],
                'creationDate' => $presentation['creationDate']->format('d-m-Y'),
                'ownerProjectId' => $pres->getProject()->getOwner()->getId(),
                'editors' => $editors,
                'urlDuplicate' => $duplicateUrl,
                'urlPreview' => $urlPreview,
            ];
//            } else {
//                $output['recordsFiltered'] = $output['recordsFiltered'] - 1;
//                $output['recordsTotal'] = $output['recordsTotal'] - 1;
//            }
        }

        return json_encode($output);
    }

    /**
     * @param int $idPres
     * @param int $idRev
     * @Route("/my-clm-presentations/{idPres}/{idRev}/thumbnail", name="presentations_thumbnails")
     *
     * @return Response
     */
    public function addThumbnail($idPres, $idRev)
    {
        $urlPres = $this->generateUrl('presentations_preview', array('idRev' => $idRev), true);
        $service = $this->get('service.argomcmbuilder_presentation.presentation');
        $thumbPath = $service->addThumbnail($idPres, $idRev, $urlPres);

        return $this->render(
            'PresentationBundle:Presentation:test.html.twig',
            array(
                'thumb' => $thumbPath,
            )
        );
    }

    /**
     * @param int $idRev
     * @param string $clm
     * @param string $type
     * @param Request $request
     * @Route("/my-clm-presentations/{idRev}/{clm}/{type}/rend", name="presentation_download_zip")
     *
     * @return BinaryFileResponse|Response
     */
    public function rend($idRev, $clm, $type, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        // $slides = $em->getRepository('PresentationBundle:Slider')->getSliderByRevision($idRev);
        /** @var Revision $rev */
        $rev = $em->getRepository('PresentationBundle:Revision')->find($idRev);
        $idPres = $rev->getPresentation()->getId();
        /** @var Presentation $pres */
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($pres->getCompany()->getId());
//        $companyParentName = $this->recursiveFindParent($pres->getCompany()->getId(), $em);
        // $menu = $rev->getMenu();
        // $popins = $rev->getDataPopin();

        $parameters = $rev->getPreSettings();

        $env = $this->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();

        //$veevaWide = $this->get('zip.veeva_wide');
        $veevaWide = $this->get('zip.veeva_wide_S3');
        // $miDeep = $this->get('zip.mi_deep');
        $miDeepS3 = $this->get('zip.mi_deep_S3');

        $catcher = new Catcher();
        set_error_handler(array($catcher, 'exceptionsErrorHandler'));
       // try {
            $zipName = '';
            switch ($clm) {
                case 'veeva':
                    switch ($type) {
                        case 'wide':
                            $zipName = $veevaWide->zip($pres, $rev, $env[$currentUrl], $company->getName());
                            break;
                    }
                    break;
                case 'mi':
                    switch ($type) {
                        case 'deep':
                            $zipName = $miDeepS3->zip($pres, $rev, $env[$currentUrl], $company->getName());
                            break;
                    }
                    break;
            }
            /* send Mail */

            if($zipName and is_object($zipName) and property_exists($zipName, "uploadedZipKey")):
                $objectPdfEmail = $this->get('translator')->trans(
                    'presentation.object.zipemail',
                    array(),
                    'presentations'
                );
                $body = $this->renderView(
                    'PresentationBundle:Presentation:sendUrlZIP.html.twig',
                    array(
                        'urlZIP' => "https://s3-eu-west-1.amazonaws.com/veeva-summit/".$zipName->uploadedZipKey,
                        'fullName' => $this->getUser()->getFullName(),
                        'hostUrl' => 'http://'.$this->get('router')->getContext()->getHost(),
                    )
                );
                $this->get('clm.print_pdf')->sendMailer($objectPdfEmail, $body);

                return new Response(json_encode(array("success" => true)));
            else:
                return new Response(json_encode(array('others' => 'zip failed')));
            endif;

//            /* end */
//        } catch (\Exception $e) {
//            return new Response(json_encode(
//                array(
//                    'success' => false,
//                    'errorsMi' => $miDeepS3->errors,
//                    'errorsVeeva' => $veevaWide->errors,
//                    'others' => $e,
//                ))
//            );
//        }

    }

    /**
     * get Territories By Project Form.
     *
     * @Route("/my-clm-presentations/getTerritories", name="getTerritoriesByProject")
     *
     * @return Response
     */
    public function getTerritoriesByProjectForm()
    {
        $selectedProject = $this->get('request')->query->get('data');
        $choices = $this->getDoctrine()->getManager()->getRepository(
            'UserBundle:Territory'
        )->getListAvailableTerritoriesByProject($selectedProject);
        $html = '';
        foreach ($choices as $choice) {
            $html = $html.sprintf('<option value="%d">%s</option>', $choice->getId(), $choice->getName());
        }

        return new Response($html);
    }

    /**
     * delete Presentation.
     *
     * @param int $idPres
     * @Route("/my-clm-presentations/deletePresentation/{idPres}", name="delete_presentation")
     *
     * @return JsonResponse
     */
    public function deletePresentationAction($idPres)
    {
        $em = $this->getDoctrine()->getManager();
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        if ($pres) {
            $em->remove($pres);
            $em->flush();

            return new JsonResponse(array('success' => 'true'));
        } else {
            return new JsonResponse(array('success' => 'false'));
        }
    }

    /**
     * project Delete Presentation.
     *
     * @param object $project
     * @param int $id
     * @Route("/projects/delete/presentation/{project}/{id}" , name="project_delete_presentation")
     *
     * @return RedirectResponse
     */
    public function projectDeletePresentationAction($project, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $oPresentation = $em->getRepository('PresentationBundle:Presentation')->find(
            $id
        );
        if ($oPresentation == null) {
            throw $this->createNotFoundException('Presentation is not Found');
        } else {
            $em->remove($oPresentation);
            $em->flush();
            // TODO translation
            $this->get('session')->getFlashBag()->add(
                'notice',
                $this->get('translator')->trans('presentation.success.delete', array(), 'presentations')
            );
        }

        return new RedirectResponse($this->generateUrl('projects_view', array('id' => $project)), 301);
    }

    /**
     * @Method("GET")
     * @Route("/presentation/isUniquePresTitle", name="is_unique_PresTitle")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function IsUniquePresTitleAction(Request $request)
    {
        $name = $request->query->get('name');
        $type = $request->query->get('type');
        $p = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->findByName($name);

        if ($type == 'form_edit') {
            if (count($p) > 1) {
                return new JsonResponse(array('success' => false));
            } else {
                return new JsonResponse(array('success' => true));
            }
        } else {
            if ($p) {
                return new JsonResponse(array('success' => false));
            } else {
                return new JsonResponse(array('success' => true));
            }
        }
    }

    /**
     * @Method("GET")
     * @Route("/presentation/getUserByCompany", name="get_user_by_company")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getUserByCompanyAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $company = $em->getRepository('UserBundle:Company')->find($request->query->get('idCompany'));
        $owners = $em->getRepository('UserBundle:User')->findByCompany($company);
        $viewers = $em->getRepository('UserBundle:User')->getListUserByCompany($company, 'ROLE_REVIEWER');
        $editors = $em->getRepository('UserBundle:User')->getListUserByCompany($company, 'ROLE_EDITOR');

        return new JsonResponse(array('owners' => $owners, 'viewers' => $viewers, 'editors' => $editors));
    }

    /**
     * export.
     *
     * @param bool $isActive
     * @Route("/presentations/export/list/{isActive}" , name="presentations_export_list")
     *
     * @return Response
     */
    public function exportAction($isActive)
    {
        $user = $this->getUser();
        $company = $this->getUser()->getCompany();
        $em = $this->getDoctrine()->getManager();
        $data['idUser'] = $user->getId();
        $data['idCompany'] = $company->getId();
        $data['isActive'] = '20'; // 20 is Active, 10 is not
        $data['userRole'] = $user->getRoles();
        $aPresList = $em->getRepository('PresentationBundle:Presentation')->findAllByUserCompany($data, 0, false);
        $handle = fopen('php://memory', 'r+');

        fputcsv(
            $handle,
            array('Name', 'Project Name', 'Products', 'Type', 'Territory', 'Status', 'Version', 'Owner')
        );

        foreach ($aPresList as $item) {
            $listProduct = '';
            $oPres = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find($item['id']);
            if ($oPres->getProducts()) {
                foreach ($oPres->getProducts() as $product) {
                    $listProduct .= $product->getName().' ';
                }
            }
            $tab = array(
                $item['name'],
                $item['projectName'],
                $listProduct,
                $item['type'],
                $item['territoryName'],
                $item['status'],
                $item['version'],
                $item['firstname'].' '.$item['lastname'],
            );

            fputcsv($handle, $tab);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);
        $name = 'export_presentations_'.date('Y-m-d-H:i:s').'.csv';

        return new Response(
            $content,
            200,
            array(
                'Content-Type' => 'application/force-download',
                'Content-Disposition' => 'attachment; filename="'.$name.'"',
            )
        );
    }

    /**
     * @param int $idProject
     * @param int $idMaster
     * @Route("/projects/approve", name="presentations_approve_master")
     *
     * @return JsonResponse
     */
    public function approveAction(Request $request)
    {
        $idLocalisation = $request->request->get('idLoc');
        $idMaster = $request->request->get('idMaster');
        $rep = $this->getDoctrine()->getRepository('PresentationBundle:Presentation');
        $master = $rep->find($idMaster); // array of masters
        //      $child = null === $idProject ? null : $master->getChildren()[$idProject];
        $child = $rep->find($idLocalisation);
        if ($master->getCompany() == null) {
            $this->get('session')->getFlashBag()->add('notice', 'this presentation cannot be approved');
        } else {
            $cloner = $this->get('mcm.approve_master_presentation');
            $cloner->copyMaster($master, $child);
        }
        $localisationName = null;
        if ($child != null) {
            $presName = $child->getName();
        } else {
            $presName = $master->getName();
        }

        return new JsonResponse(
            array(
                'presentation' => $presName,
            )
        );
        // return new RedirectResponse($this->generateUrl('projects_view', array('id' => $idProject)));
    }

    /**
     * @param int $idProject
     * @param int $idPres
     * @Route("/projects/approvedLocAndStandard/{idProject}/{idPres}", name="presentations_approve_localAndStandard")
     *
     * @return RedirectResponse
     */
    public function approveLocAndStandardAction($idProject, $idPres)
    {
        $em = $this->getDoctrine()->getManager();
        $rep = $em->getRepository('PresentationBundle:Presentation');
        $presentation = $rep->find($idPres); // array of masters
        $presentation->setStatus('Approved');
        $presentation->setLock(20);
        $em->flush();

        return new RedirectResponse($this->generateUrl('projects_view', array('id' => $idProject)));
    }

    /**
     * @Method("GET")
     * @Route("/presentation/getCompanyByProject", name="get_company_by_project")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getCompanyByProjectAction(Request $request)
    {
        $projectId = $request->query->get('idProject');
        $project = $this->getDoctrine()->getRepository('ProjectBundle:Project')->find($projectId);
        $listCompany = $this->getDoctrine()->getRepository('UserBundle:Company')->findCompanyByProject(
            $project->getCompany()->getId()
        );

        return new JsonResponse(array('listCompany' => $listCompany));
    }

    /**
     * @Method("GET")
     * @Route("/presentation/testProjectStatus", name="test_project_status")
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function testProjectStatusAction(Request $request)
    {
        $presId = $request->query->get('idPres');
        $pres = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find($presId);
        if ($pres->getProject()->getStatus() == '20') {
            return new JsonResponse(array('success' => true));
        } else {
            return new JsonResponse(array('success' => false, 'projectName' => $pres->getProject()->getName()));
        }
    }

    /**
     * Test Model Edit Pres.
     *
     * @param Request $request
     * @Method("GET")
     * @Route("/presentation/testModeEdit", name="test_mode_edit_pres")
     *
     * @return JsonResponse
     */
    public function TestModelEditPresAction(Request $request)
    {
        $user = $this->getUser();
        $idPres = $request->query->get('idPres');
        $currentDate = new \DateTime();
        $currentDate = $currentDate->getTimestamp();
        $presentation = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find($idPres);
        if ($presentation->getLastUsed()) {
            $lastUsed = $presentation->getLastUsed()->getTimestamp();
        } else {
            $lastUsed = 0;
        }
        $diff = $currentDate - $lastUsed;
        $usedBy = null;
        if ($presentation->getUsedBy()) {
            $usedBy = $presentation->getUsedBy()->getId();
        }
        if ($presentation->getModeEdit() == 20 && $diff <= 70 && $usedBy != $user->getId()) {
            return new JsonResponse(array('modeEdit' => true));
        } else {
            return new JsonResponse(array('modeEdit' => false));
        }
    }

    /**
     * @Method("GET")
     * @Route("/presentation/getCompanyByMaster", name="get_company_by_master")
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getCompanyByMasterAction(Request $request)
    {
        $companyId = $request->query->get('idCompany');
        $listCompany = $this->getDoctrine()->getRepository('UserBundle:Company')->findCompanyByProject($companyId);

        return new JsonResponse(array('listCompany' => $listCompany));
    }

    /**
     * disconnect Presentation.
     *
     * @param int $idMaster
     * @param int $idLocal
     * @Route("/presentation/disconnect/presentation/{idMaster}/{idLocal}" , name="project_disconnect_presentation")
     *
     * @return RedirectResponse
     */
    public function disconnectPresentationAction($idMaster, $idLocal)
    {
        $em = $this->getDoctrine()->getManager();
        $masterPres = $em->getRepository('PresentationBundle:Presentation')->find($idMaster);
        $localPres = $em->getRepository('PresentationBundle:Presentation')->find($idLocal);
        $project = $masterPres->getProject();
        if ($masterPres == null || $localPres == null) {
            throw $this->createNotFoundException('Presentation is not Found');
        } else {
            if ($masterPres->getCompany() == null) {
                $this->get('session')->getFlashBag()->add('notice', 'this presentation cannot be disconnected');
            } else {
                $presToDisconnect = $this->container->get('mcm.disconnect_localisation');
                $presToDisconnect->disconnectLocalisation($masterPres, $localPres);
                $this->get('session')->getFlashBag()->add(
                    'success',
                    $this->get('translator')->trans('presentation.success.disconnect', array(), 'presentations')
                );
            }
        }

        return new RedirectResponse($this->generateUrl('projects_view', array('id' => $project->getId())));
    }

    /**
     * add Localisation.
     *
     * @param Request $request
     * @param int $id
     * @param int $idProject
     * @Route("/presentations/add/localisation/{id}/{idProject}" , name="project_add_localisation")
     *
     * @return RedirectResponse
     */
    public function addLocalisationAction(Request $request, $id, $idProject)
    {
        if ('POST' == $request->getMethod()) {
            $territories = $request->get('territories');
            $company = $request->get('company');
        }
        $presToClone = $this->container->get('mcm.add_localisation');
        $presToClone->addLocalisation($id, $territories, $company);

        return new RedirectResponse($this->generateUrl('projects_view', array('id' => $idProject)));
    }

    /**
     * @param $length
     *
     * @return string
     */
    private function randomString($length)
    {
        $key = '';
        $keys = array_merge(range(0, 9), range('a', 'z'));
        for ($i = 0; $i < $length; ++$i) {
            $key .= $keys[array_rand($keys)];
        }

        return $key;
    }

    /**
     * @Route("/change-user-flag/{idUser}", name="change-flag")
     * @param int $idUser
     *
     * @return Response
     */
    public function changeFlag($idUser)
    {
        $em = $this->container->get('doctrine')->getEntityManager();
        $repository = $em->getRepository('UserBundle:User');
        $user = $repository->findOneById($idUser);
        $user->setFlagPres(20);
        $em->flush();

        return new Response('success');
    }

    /**
     * @Method("GET")
     * @Route("/presentation/getLocalisations", name="get_list_ocalisations")
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getLocalisationsAction(Request $request)
    {
        $masterId = $request->query->get('idMaster');
        $master = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find($masterId);
        $list = array();
        foreach ($master->getChildren() as $child) {
            if ($child->getStatus() == "Wait for master approval") {
                $tab['id'] = $child->getId();
                $tab['name'] = $child->getName();
                $tab['status'] = $child->getStatus();
                array_push($list, $tab);
            }
        }

        return new JsonResponse(array('list' => $list));
    }

    /**
     * @Method("GET")
     * @Route("/presentation/downloadPdf", name="download_pdf")
     * @param Request $request
     *
     * @return Response
     */
    public function downloadPdfAction(Request $request)
    {
        $url      = "/pdf/mi-touch-naming-convention-guide.pdf";
        $filename = "mi-touch-naming-convention-guide.pdf";
        $path     = $this->get('kernel')->getRootDir()."/../web/$url";
        $content  = file_get_contents($path);
        $response = new Response();
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', 'attachment;filename="'.$filename);
        $response->setContent($content);

        return $response;
    }
}
