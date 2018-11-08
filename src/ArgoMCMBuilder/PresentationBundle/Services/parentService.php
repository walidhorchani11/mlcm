<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Reference;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\ProjectBundle\Entity\Project;
use ArgoMCMBuilder\UserBundle\Entity\Company;
use ArgoMCMBuilder\UserBundle\Entity\Territory;

/**
 * Service to disconnect localisations Presentations.
 *
 * Class DisconnectLocalisationService
 */
class parentService
{
    /**
     * @var
     */
    protected $em;
    protected $fileSystem;
    protected $thumbnail;

    /**
     * @param Presentation  $presClone
     * @param Revision      $revision
     * @param Revision|null $revClone
     * @return int
     */
    public function duplicateRevisions($presClone, $revision, $revClone = null)
    {
        $em = $this->em;
        if ($revClone == null) {
            $revClone = new Revision();
            $revClone->setPresentation($presClone);
        }
        $revClone->setVisibility($revision->getVisibility());
        $revClone->setThumbnailUrl($revision->getThumbnailUrl());
        $revClone->setVersion($revision->getVersion());
        $revClone->setAccessToken($revision->getAccessToken());
        $revClone->setPreSettings(json_decode($revision->getPreSettings()));
        $revClone->setOldPreSettings(json_decode($revision->getOldPreSettings()));
        $revClone->setPopin(json_decode($revision->getPopin()));
        $revClone->setSlides(json_decode($revision->getSlides()));
        $revClone->setMenu($revision->getMenu());
        $revClone->setMenuJson(json_decode($revision->getMenuJson()));
        if ($revision->getSurvey() !== null) :
            $revClone->setSurvey(json_decode($revision->getSurvey()));
        endif;
        if ($revision->getLinkedRef() !== null) :
            $revClone->setLinkedRef(json_decode($revision->getLinkedRef()));
        endif;
        $revRep  = $em->getRepository('PresentationBundle:Revision');
        $imageId = $revRep->getImagesByRevision($revision->getId());
        $this->duplicatePresentationsImages($revClone, $imageId);
        $pdfId   = $revRep->getPdfsByRevision($revision->getId());
        $this->duplicatePresentationsPdf($revClone, $pdfId);
        $videoId = $revRep->getVideosByRevision($revision->getId());
        $this->duplicatePresentationsVideos($revClone, $videoId);

        $em->persist($revClone);
        $em->flush();

        return $revClone->getId();
    }

    /**
     * @param Presentation $presClone
     * @param array        $refList
     */
    public function duplicateReferences($presClone, $refList)
    {
        $em = $this->em;
        foreach ($refList as $ref) {
            $refClone = new Reference();
            $refClone->setCode($ref->getCode());
            $refClone->setDescription($ref->getDescription());
            $refClone->setTitle($ref->getTitle());
            $refClone->setPresentation($presClone);

            $em->persist($refClone);
            $em->flush($refClone);
        }
    }

    /**
     * @param Presentation $presClone
     * @param integer      $viewersId
     */
    public function duplicatePresentationsViewers($presClone, $viewersId)
    {
        $em        = $this->em;
        $viewerRep = $em->getRepository('UserBundle:User');

        if (count($viewersId) > 0) {
            foreach ($viewersId as $elm) {
                $viewer = $viewerRep->find($elm['id']);
                $presClone->addViewer($viewer);
            }
        }
    }

    /**
     * @param Presentation $presClone
     * @param array        $editorsList
     */
    public function duplicatePresentationsEditors($presClone, $editorsList)
    {
        foreach ($editorsList as $elm) {
            $presClone->addEditor($elm);
        }
    }

    /**
     * @param Presentation $presClone
     * @param integer      $productsId
     */
    public function duplicatePresentationsProducts($presClone, $productsId)
    {
        $em      = $this->em;
        $prodRep = $em->getRepository('BackOfficeBundle:Product');

        if (count($productsId) > 0) {
            foreach ($productsId as $elm) {
                $product = $prodRep->find($elm['id']);
                $product->addPresentation($presClone);
                $presClone->addProduct($product);
            }
        }
    }

    /**
     * @param Revision $revClone
     * @param array    $imagesId
     */
    public function duplicatePresentationsImages($revClone, $imagesId)
    {
        $em       = $this->em;
        $imageRep = $em->getRepository('ArgoMCMBuilderMediaBundle:Image');

        if (count($imagesId) > 0) {
            foreach ($imagesId as $elm) {
                $image = $imageRep->find($elm['id']);
                $image->addRevisionImage($revClone);
                $revClone->addImage($image);
            }
        }
    }

    /**
     * @param Revision $revClone
     * @param array    $pdfsId
     */
    public function duplicatePresentationsPdf($revClone, $pdfsId)
    {
        $em     = $this->em;
        $pdfRep = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf');

        if (count($pdfsId) > 0) {
            foreach ($pdfsId as $elm) {
                $pdf = $pdfRep->find($elm['id']);
                $pdf->addRevisionPdf($revClone);
                $revClone->addPdf($pdf);
            }
        }
    }

    /**
     * @param Revision $revClone
     * @param array    $vediosId
     */
    public function duplicatePresentationsVideos($revClone, $vediosId)
    {
        $em       = $this->em;
        $videoRep = $em->getRepository('ArgoMCMBuilderMediaBundle:Video');

        if (count($vediosId)) {
            foreach ($vediosId as $elm) {
                $video = $videoRep->find($elm['id']);
                $video->addRevisionVideo($revClone);
                $revClone->addVideo($video);
            }
        }
    }

    /**
     * @param integer $revId
     * @param integer $oldRev
     * @param integer $presId
     * @param integer $oldPres
     */
    public function duplicateThumbs($revId, $oldRev, $presId, $oldPres)
    {
        $presObject = $this->em->getRepository('PresentationBundle:Presentation')->find($presId);
        $fs         = $this->fileSystem;
        if ($fs->exists($this->thumbnail.'/'.$oldPres.'-'.$oldRev)) {
            $fs->mirror($this->thumbnail.'/'.$oldPres.'-'.$oldRev, $this->thumbnail.'/'.$presId.'-'.$revId);
        }
        /* rename popin thumb */
//        $files = glob($this->thumbnail.'/'.$presId.'-'.$revId.'/popin*.png');
//        if (count($files) > 0) {
//            for ($i = 0; $i < count($files); ++$i) {
//                $filename = basename($files[$i]);
//                $tab = explode('-', $filename);
//                $newName = $tab[0].'-'.$presId.'-'.$revId.'-'.$tab[3];
//                rename($files[$i], $this->thumbnail.'/'.$presId.'-'.$revId.'/'.$newName);
//            }
//        }
        /* rename pres thumb */
        if ($fs->exists($this->thumbnail.'/'.$presId.'-'.$revId.'/thumb-'.$oldPres.'.png')) {

            $presThumb = $this->thumbnail.'/'.$presId.'-'.$revId.'/thumb-'.$oldPres.'.png';
            $OldPresThumb = basename($this->thumbnail.'/'.$presId.'-'.$revId.'/thumb-'.$oldPres.'.png', '.png');
            $tabPresThumb = explode('-', $OldPresThumb);
            $newPresThumb = $tabPresThumb[0].'-'.$presId;
            rename($presThumb, $this->thumbnail.'/'.$presId.'-'.$revId.'/'.$newPresThumb.'.png');
            $newPresThumbUrl =  $this->container->getParameter('presentations_thumbnails')."/$presId-$revId/thumb-$presId.png";
            $presObject->setThumbnailPath($newPresThumbUrl);

        } elseif ($fs->exists($this->thumbnail.'/'.$presId.'-'.$revId.'/thumb-'.$oldPres.'.jpg')) {

            $presThumb = $this->thumbnail.'/'.$presId.'-'.$revId.'/thumb-'.$oldPres.'.jpg';
            $OldPresThumb = basename($this->thumbnail.'/'.$presId.'-'.$revId.'/thumb-'.$oldPres.'.jpg', '.jpg');
            $tabPresThumb = explode('-', $OldPresThumb);
            $newPresThumb = $tabPresThumb[0].'-'.$presId;
            rename($presThumb, $this->thumbnail.'/'.$presId.'-'.$revId.'/'.$newPresThumb.'.jpg');
            $newPresThumbUrl =  $this->container->getParameter('presentations_thumbnails')."/$presId-$revId/thumb-$presId.jpg";
            $presObject->setThumbnailPath($newPresThumbUrl);
        }
        /* remove all js files */
        $jsFile = glob($this->thumbnail.'/'.$presId.'-'.$revId.'/*.js');
        $jsFile = array_merge($jsFile, glob($this->thumbnail.'/'.$presId.'-'.$revId.'/slides/*.js'));
        if (count($jsFile) > 0) {
            for ($j = 0; $j < count($jsFile); ++$j) {
                $fs->remove($jsFile[$j]);
            }
        }
    }

    /**
     * @param Presentation $presentation
     * @param Territory    $ter
     * @param string       $presMasterName
     * @param Company      $comp
     */
    public function createPresentationByTerritories($presentation, $ter, $presMasterName, $comp, $user)
    {
        $company = $this->em->getRepository('UserBundle:Company')->find($comp);
        $ter = $this->em->getRepository('UserBundle:Territory')->find($ter);
        $presentationLoc = new Presentation();
        $presentationLoc->setParent($presentation);
        $presentationLoc->setType('Localisation');
        $presentationLoc->setLock(20);
        $presentationLoc->setStatus('Wait for master approval');
        $presentationLoc->setTerritory($ter);
        $presentationLoc->setName($presMasterName.'_'.$ter->getName());
        $presentationLoc->setCrm($presentation->getCrm());
        $presentationLoc->setIsActive(20);
        $presentationLoc->setProject($presentation->getProject());
        $presentationLoc->setCompany($company);
        $presentationLoc->setagency($presentation->getAgency());
        $presentationLoc->setOwner($presentation->getOwner());
        $presentationLoc->setDevice($presentation->getDevice());
        if ($presentation->getProducts()) {
            foreach ($presentation->getProducts() as $product) {
                $presentationLoc->addProduct($product);
            }
        }
        if ($presentation->getEditors()) {
            foreach ($presentation->getEditors() as $editor) {
                $presentationLoc->addEditor($editor);
            }
        }
        if ($presentation->getViewers()) {
            foreach ($presentation->getViewers() as $viewer) {
                $presentationLoc->addViewer($viewer);
            }
        }
        $this->em->persist($presentationLoc);
        $this->createSliderAndRevision($presentationLoc, $user);
    }

    /**
     * @param Presentation $presentation
     */
    public function createSliderAndRevision($presentation, $user)
    {
        $revision = new Revision();
        $revision->setPresentation($presentation);
        $revision->setVersion(0.1);
        $revision->setUser($user);
//        $html = '<section class="present" style="display: block;" data-id="a4c4360eeba35386f8da0b22e29ddc81"></section>';
//        $html = str_replace('"', "'", $html);
//        $revision->setSlides($html);
        $slide = '[{
            "class": "present",
            "blocks": [],
            "styles": {
                "background-size": "",
                "background-color": "rgb(255, 255, 255)",
                "background-image": "",
                "background-repeat": "no-repeat",
                "background-position": ""
            },
            "attributes": {
                "data-id": "",
                "data-background-color": "rgb(255, 255, 255)",
                "data-background-image": "",
                "data-background-repeat": "no-repeat",
                "data-background-position": "center center",
                "data-trigger-anim-byclick": "false",
                "new-slide" : "true"
            }
        }]';
        $presentationSetting = '{
    "id": "params_clm_edidtor",
    "dataAllowSubmenu": "",
    "dataAllowSubmenuwidth": "",
    "dataBgBtnClose": "",
    "dataBgMenuColor": "rgb(74, 86, 103)",
    "dataBgPopupColor": "rgb(255, 255, 255)",
    "dataBgPopupImg": "",
    "dataBgPresColor": "rgb(255, 255, 255)",
    "dataBgPresImg": "",
    "dataBgRefColor": "rgb(255, 255, 255)",
    "dataBgRefImg": "",
    "dataBgRefOverlaycolor": "rgb(0, 0, 0)",
    "dataCurrentItemColor": "rgb(62, 135, 135)",
    "dataFontMenuColor": "rgb(255, 255, 255)",
    "dataFontSizeRefContent": "",
    "dataFontSizeSelect": "",
    "dataFontSizeTitleRef": "",
    "dataFontUrlExist": "",
    "dataHighlightMenu": "",
    "dataLogoHomeUrl": "",
    "dataLogoPresUrl": "",
    "dataLogoRcpUrl": "",
    "dataLogoRefrsUrl": "",
    "dataMenuFont": "",
    "dataMenuFontNameTitleRef": "",
    "dataMenuFontTitleRef": "",
    "dataMenuFontname": "",
    "dataOverlayRefOpacity": "",
    "dataPopupHeight": "400px",
    "dataPopupWidth":"600px",
    "dataQuestionCounter": "",
    "dataRefHeight": "310px",
    "dataRefWidth": "600px",
    "dataRespCounter": "",
    "dataTextRefColor": "rgb(0, 0, 0)",
    "dataTitleRefContent": "Reference",
    "dataDisableScroll": "",
    "dataBgCloseSize":"",
    "dataBgPopupSize":"",
    "dataBgRefSize":"",
    "dataLogoHomeSize":"",
    "dataLogoPresSize":"",
    "dataLogoRcpSize":"",
    "dataLogoRefrsSize":"",
    "dataBgPresSize":""
}';
        $revision->setSlides(json_decode($slide));
        $revision->setPreSettings(json_decode($presentationSetting));
        $this->em->persist($revision);
    }

    /**
     * @param Presentation      $pres
     * @param Presentation|null $clonePres
     * @param Project|null      $cloneProject
     * @return mixed
     */
    public function duplicateElements($pres, $clonePres = null, $cloneProject = null)
    {
        $em = $this->em;
        $presRep = $em->getRepository('PresentationBundle:Presentation');
        $presClone = clone($pres);
        if (null != $clonePres) {
            $presClone->setParent($clonePres);
        }
        if ($cloneProject != null) {
            $presClone->setProject($cloneProject);
        }
        $presClone->clearId();
        $presClone->setName($pres->getName().'_duplicated');
        $countDuplicated = count($presRep->countDuplicatedPres($presClone->getName()));
        ++$countDuplicated;
        $presClone->setName($presClone->getName().$countDuplicated);
        $presClone->setCreationDate(new \DateTime());
        $presClone->setLastUpDate(new \DateTime());
        $presClone->setLastUsed(new \DateTime());
        $presClone->setUsedBy(null);
        $presClone->setModeEdit(10);

        $em->persist($presClone);
        $em->flush($presClone);

        $revision = $pres->getRevisions()->last();
        /************ duplicate thumbs popin and thumb presentation *************/
        $revId = $this->duplicateRevisions($presClone, $revision);
        $presId = $presClone->getId();
        $oldRev = $pres->getRevisions()->last()->getId();
        $oldPres = $pres->getId();

        $this->duplicateThumbs($revId, $oldRev, $presId, $oldPres);
        /******************** end **********************/

//        $productsId = $presRep->getProductsByPresentation($pres->getId());
//        $this->duplicatePresentationsProducts($presClone, $productsId);
//
//        $editorsList = $pres->getEditors();
//        $this->duplicatePresentationsEditors($presClone, $editorsList);
//
//        $viewersId = $presRep->getViewersByPresentation($pres->getId());
//        $this->duplicatePresentationsViewers($presClone, $viewersId);
        $refRep = $em->getRepository('PresentationBundle:Reference');
        $refList = $refRep->findByPresentation($pres);
        $this->duplicateReferences($presClone, $refList);

        return $presClone;
    }
}
