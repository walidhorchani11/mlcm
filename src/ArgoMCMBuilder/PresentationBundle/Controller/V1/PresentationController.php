<?php

namespace ArgoMCMBuilder\PresentationBundle\Controller\V1;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\MediaBundle\Entity\Media;
use ArgoMCMBuilder\MediaBundle\Entity\Image;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\MediaBundle\Entity\Video;
use Symfony\Component\HttpFoundation\JsonResponse;

class PresentationController extends FOSRestController
{
    /**
     * @return array
     * @Rest\Get("/revisions/{idPres}/{id}")
     * @Rest\View
     */
    public function getRevisionAction($idPres, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($id);

        return $revision->getData();
    }

    /**
     * @return array
     * @Rest\Put("/revisions/{idPres}/{id}")
     * @Rest\View
     */
    public function updateRevisionAction(Request $request, $idPres, $id)
    {
        /* $urlPres = $this->generateUrl('presentations_preview', array( 'idRev' => $id ), true);
        $service = $this->get('service.argomcmbuilder_presentation.presentation');
        $service->addThumbnail($idPres, $id, $urlPres);*/

        $em = $this->getDoctrine()->getManager();
        $revision = $em->getRepository('PresentationBundle:Revision')->find($id);
        $form = $request->request->get('dt');
        $html = str_replace('"', "'", $form);
        // $revision->setOldData($html);
        $revision->setData($html);
        $em->flush();

        return $revision->getData();
    }

    /**
     * GET Route annotation.
     *
     * @return array
     * @Rest\Get("/revisions/get.{_format}")
     * @Rest\View
     */
    public function getRevisionsAction()
    {
        $em = $this->getDoctrine()->getManager();
        $revisions = $em->getRepository('PresentationBundle:Revision')->findAll();

        return array('revision' => $revisions);
    }

    /**
     * @return array
     *               POST Route annotation
     * @Rest\Post("/revisions/new.{_format}", name="revisions_new", options={"expose"=true})
     * @Rest\View
     */
    public function newRevisionAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $revision = new Revision();
        $form = $request->request->get('deck');
        $html = str_replace('"', "'", $form['data']);
        $revision->setData($html);
        $em->persist($revision);
        $em->flush();

        return $revision;
    }


    /**
     * GET Route annotation.
     *
     * @return JsonResponse
     * @Rest\Post("/medias/s3upload.{_format}", name="medias_news3", options={"expose"=true})
     * @Rest\View
     */
    public function news3MediaAction(Request $request)
    {
        $content = $this->get('request')->getContent();

        if (!empty($content)) {
            $params         = json_decode($content, true);
            $fileName       = $params['filename'];
            $s3fileName     = $params['s3filename'];
            $filePath       = $params['files3path'];
            $thumbUrl       = $params['thumbUrl'];
            $originalImage  = $params['orginalPath'];
            $size           = $params['filesize'];
            $fileType       = $params['filetype'];
            $bucketName     = $params['bucketName'];
            $mediaKey       = $params['mediaKey'];
        }
        $height = null;
        $width  = null;

        if (preg_match('/image.*/', $fileType, $match) === 1) {
            $type       = 'image';
            $height     = $params['fileHeight'];
            $width      = $params['fileWidth'];
            $media      = new Image();
            $media->setWidth($width);
            $media->setHeight($height);

        } elseif (preg_match('/video.*/', $fileType, $match) === 1) {
            $type       = 'video';
            $media      = new Video();
            $thumbUrl   = '/img/video.png';
        } elseif (preg_match('/application\/pdf/', $fileType, $match) === 1) {
            $type       = 'pdf';
            $media      = new Pdf();
            $thumbUrl   = '/img/pdf.png';
        } else {
            $type = null;
        }

        $mediaUploader = $this->get('clm_media_uploader');
        if ($type == null or $mediaUploader->getMaxfile($type) < $size) {
            return new JsonResponse(
                array(
                    'success' => false,
                )
            );
        }

        $em             = $this->getDoctrine()->getManager();
        $owner          = $this->getUser();
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($owner->getCompany()->getId());
        $companyName    = $company->getName();

        $media->setLabelMedia($s3fileName);
        $media->setTitle($fileName);
        $media->setSize($size);
        $media->setOwner($owner);
        $media->setCompany($company);
        $media->setContentType($fileType);
        $media->setUrl($filePath);
        $media->setThumbUrl($thumbUrl);
        $media->setBucketName($bucketName);
        $media->setKey($mediaKey);
        $media->setCreated(new \DateTime('now'));
        $media->setUpdated(new \DateTime('now'));
        $media->setFlag(10);

        $em->persist($media);
        $em->flush();
        $idMedia = $media->getId();

        $data = array(
            'id'            => $idMedia,
            'url'           => $filePath,
            'label_media'   => $s3fileName,
            'height'        => $height,
            'width'         => $width,
            'size'          => $size,
            'thumb_url'     => $thumbUrl,
            'originalImage' => $originalImage,
            'content_type'  => $fileType
        );

        return new JsonResponse($data);
    }

    /**
     * GET Route annotation.
     *
     * @return JsonResponse
     * @Rest\Post("/medias/new.{_format}", name="medias_new", options={"expose"=true})
     * @Rest\View
     */
    public function newMediaAction(Request $request)
    {
        $extImage = array('image/png', 'image/jpg', 'image/jpeg', 'image/gif');
        $file = $request->files->get('file');
        $size = $file->getSize();
        $contentType = $file->getMimeType();
        if (in_array($contentType, $extImage)) {
            $type = 'image';
        } elseif ($contentType == 'application/pdf') {
            $type = 'pdf';
        } elseif ($contentType == 'video/mp4') {
            $type = 'video';
        } else {
            $type = null;
        }
        $mediaUploader = $this->get('clm_media_uploader');
        if ($type == null or $mediaUploader->getMaxfile($type) < $size) {
            return new JsonResponse(
                array(
                    'success' => false,
                )
            );
        }

        $em = $this->getDoctrine()->getManager();
        $owner = $this->getUser();
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($owner->getCompany()->getId());
        $height = $width = null;
        $companyName = $company->getName();
        $data = $mediaUploader->getDirectory($file, $companyName);
        $fileInfo = $mediaUploader->upload($file, $data['path']);
        //$tabInfo = explode('#', $fileInfo);
        $fileName = $fileInfo['originalFileName'];
        if (in_array($contentType, $extImage)) {
            $media = new Image();
            $width = $fileInfo['width'];
            $height = $fileInfo['height'];
            $media->setWidth($width);
            $media->setHeight($height);
        } elseif ($contentType == 'application/pdf') {
            $media = new Pdf();
        } else {
            $media = new Video();
        }

        $media->setLabelMedia($fileName);
        $media->setTitle($request->request->get('title'));
        $media->setSize($size);
        $media->setOwner($owner);
        $media->setCompany($company);
        $media->setContentType($contentType);
        $media->setUrl('/uploads/'.$data['url'].'/'.$fileInfo['fileName']);
        $media->setThumbUrl('/uploads/'.$data['url'].'/'.$fileInfo['fileName']);
        //$media->setThumbUrl('http://'.$this->container->get('router')->getContext()->getHost().'/uploads/'.$data['url'].'/thumbnail'.$tabInfo['3']);
        $media->setCreated(new \DateTime('now'));
        $media->setUpdated(new \DateTime('now'));
        $media->setFlag(10);
        $em->persist($media);
        $em->flush();
        $idMedia = $media->getId();

        if (in_array($contentType, $extImage)) {
            //$url = $this->generateUrl('token=img', array('id' => $idMedia));
            $thumbUrl = 'http://'.$this->container->get('router')->getContext()->getHost(
                ).'/uploads/'.$data['url'].'/'.$fileInfo['fileName'];
        } elseif ($contentType == 'application/pdf') {
            //$url = $this->generateUrl('token=pdf', array('id' => $idMedia));
            $thumbUrl = 'http://'.$this->container->get('router')->getContext()->getHost(
                ).'/uploads/'.$data['url'].'/'.$fileInfo['fileName'];
        } elseif ($contentType == 'video/mp4') {
            //$url = $this->generateUrl('token=vd', array('id' => $idMedia));
            $thumbUrl = '/img/video.png';
        } else {
            $type = null;
        }

        $data = array(
            'id' => $idMedia,
            'url' => '/uploads/'.$data['url'].'/'.$fileInfo['fileName'],
            //  'url' => $url,
            'label_media' => $fileName,
            'height' => $height,
            'width' => $width,
            'size' => $size,
            'thumb_url' => $thumbUrl,
            'content_type' => $contentType,
        );

        return new JsonResponse($data);
    }

    /**
     * GET Route annotation.
     *
     * @return array
     * @Rest\Get("/medias/{idPres}/.{_format}", name="medias",  options={"expose"=true})
     * @Rest\View
     */
    public function getMediaAction($idPres)
    {
        $em = $this->getDoctrine()->getManager();
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($this->getUser()->getCompany()->getId());
        $pres = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find($idPres);
        $pdfs = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->getMediaEditor(
            $this->getUser(),
            $company->getId(),
            $pres->getId()
        );
        $images = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->getMediaEditor(
            $this->getUser(),
            $company->getId(),
            $pres->getId()
        );

        $videos = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->getMediaEditor(
            $this->getUser(),
            $company->getId(),
            $pres->getId()
        );
        $res = array();

        foreach ($pdfs as $media) {
            $mm = $this->createMedia($media);
            $mm->setThumbUrl('/img/pdf.png');

            array_push($res, $mm);
        }

        foreach ($images as $media) {
            $mm = $this->createMedia($media);
            $mm->setThumbUrl($media['thumbUrl']);
            $dateC = $media['created']->format('Y-m-d');
            $mm->setCreated($dateC);
            array_push($res, $mm);
        }

        foreach ($videos as $media) {
            $mm = $this->createMedia($media);
            $mm->setThumbUrl('/img/video.png');
            array_push($res, $mm);
        }

        $data = array('total' => count($res), 'type' => 'medias', 'results' => $res);

        return $data;
    }

    /**
     * GET Route annotation.
     *
     * @return array
     * @Rest\Get("/tags/{idPres}/.{_format}", name="tags", options={"expose"=true})
     * @Rest\View
     */
    public function getTagsAction(Request $request, $idPres)
    {
        $em = $this->getDoctrine()->getManager();
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($this->getUser()->getCompany()->getId());
        $pdfs = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->getMediaEditor(
            $this->getUser(),
            $company->getId(),
            $idPres
        );
        $images = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->getMediaEditor(
            $this->getUser(),
            $company->getId(),
            $idPres
        );
        $videos = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->getMediaEditor(
            $this->getUser(),
            $company->getId(),
            $idPres
        );
        //$extimage = array('image/png', 'image/jpg', 'image/jpeg', 'image/gif');
        $idimages = array();
        $idpdf = array();
        $idvideos = array();

        foreach ($pdfs as $key => $media) {
            $idpdf[] = $media['id'];
        }

        foreach ($images as $key => $media) {
            $idimages[] = $media['id'];
        }

        foreach ($videos as $key => $media) {
            $idvideos[] = $media['id'];
        }

        $pdf = array('id' => 1, 'name' => 'PDF', 'medias' => $idpdf);
        $images = array('id' => 2, 'name' => 'Images', 'medias' => $idimages);
        $videos = array('id' => 3, 'name' => 'Videos', 'medias' => $idvideos);

        $tags = array();
        $tags[] = $images;
        $tags[] = $pdf;
        $tags[] = $videos;

        $data = array('total' => count($tags), 'type' => 'tags', 'results' => $tags);

        return $data;
    }

    /**
     * GET Route annotation.
     *
     * @return array
     * @Rest\Get("/tags.{_format}")
     * @Rest\View
     */
    public function listTagsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $medias = $em->getRepository('ArgoMCMBuilderMediaBundle:Media')->findAll();
        $extimage = array('image/png', 'image/jpg', 'image/jpeg', 'image/gif');
        $idimages = array();
        $idpdf = array();
        $idvideos = array();
        foreach ($medias as $key => $media) {
            if (in_array($media->getContentType(), $extimage)) {
                $idimages[] = $media->getId();
            }
            if ($media->getContentType() == 'application/pdf') {
                $idpdf[] = $media->getId();
            }
            if ($media->getContentType() == 'video/mp4') {
                $idvideos[] = $media->getId();
            }
        }

        $pdf = array('id' => 1, 'name' => 'PDF', 'medias' => $idpdf);
        $images = array('id' => 2, 'name' => 'Images', 'medias' => $idimages);
        $video = array('id' => 3, 'name' => 'Videos', 'medias' => $idvideos);
        $tags = array();
        $tags[] = $images;
        $tags[] = $pdf;
        $tags[] = $video;

        $data = array('total' => count($tags), 'type' => 'tags', 'results' => $tags);

        return $data;
    }

    /**
     * POST Route annotation.
     *
     * @param Request $request
     *
     * @return array
     * @Rest\Post("/tags/search.{_format}")
     * @Rest\View
     */
    public function SearchAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        $compUser = $user->getCompany();

        $label = $request->request->get('searchlabel');
        $medias = array();
        $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->findMediaBylabel($label, $user, $compUser->getId());
        $image = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->findMediaBylabel(
            $label,
            $user,
            $compUser->getId()
        );
        $video = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->findMediaBylabel(
            $label,
            $user,
            $compUser->getId()
        );

        foreach ($pdf as $media) {
            $mm = new Media();

            $mm->id = $media['id'];
            $mm->setLabelMedia($media['labelMedia']);
            $mm->setUrl($media['url']);
            //$mm->setUrl($this->generateUrl('token=pdf',array('id' => $media['id']) ));
            $mm->setSize($media['size']);
            $mm->setInline($media['inline']);
            $mm->setThumbUrl($media['url']);
            //$mm->setThumbUrl($this->generateUrl('token=pdf',array('id' => $media['id']) ));
            $mm->setHeight($media['height']);
            $mm->setWidth($media['width']);
            $mm->setContentType($media['contentType']);
            $mm->setMaster($media['master']);
            $mm->setShared($media['shared']);
            $mm->setTitle($media['title']);
            $mm->setLegend($media['legend']);
            $mm->setFlag($media['flag']);

            array_push($res, $mm);
        }
        foreach ($image as $media) {
            $mm = new Media();

            $mm->id = $media['id'];
            $mm->setLabelMedia($media['labelMedia']);
            $mm->setUrl($media['url']);
            //$mm->setUrl($this->generateUrl('token=img',array('id' => $media['id']) ));
            $mm->setSize($media['size']);
            $mm->setInline($media['inline']);
            $mm->setThumbUrl($media['url']);
            //$mm->setThumbUrl($this->generateUrl('token=img',array('id' => $media['id']) ));
            $mm->setHeight($media['height']);
            $mm->setWidth($media['width']);
            $mm->setContentType($media['contentType']);
            $mm->setMaster($media['master']);
            $mm->setShared($media['shared']);
            $mm->setTitle($media['title']);
            $mm->setLegend($media['legend']);
            $mm->setFlag($media['flag']);

            array_push($res, $mm);
        }
        foreach ($video as $media) {
            $mm = new Media();

            $mm->id = $media['id'];
            $mm->setLabelMedia($media['labelMedia']);
            $mm->setUrl($media['url']);
            // $mm->setUrl($this->generateUrl('token=vd',array('id' => $media['id']) ));
            $mm->setSize($media['size']);
            $mm->setInline($media['inline']);
            $mm->setThumbUrl($media['url']);
            //$mm->setThumbUrl($this->generateUrl('token=vd',array('id' => $media['id']) ));
            $mm->setHeight($media['height']);
            $mm->setWidth($media['width']);
            $mm->setContentType($media['contentType']);
            $mm->setMaster($media['master']);
            $mm->setShared($media['shared']);
            $mm->setTitle($media['title']);
            $mm->setLegend($media['legend']);
            $mm->setFlag($media['flag']);

            array_push($res, $mm);
        }
        $res = array();

        $data = array('total' => count($res), 'type' => 'medias', 'results' => $res);

        return $data;
    }

    /**
     * DELETE Route annotation.
     *
     * @return array
     * @Rest\Delete("/media/delete/{idPres}/{t}.{_format}", name="media_delete", options={"expose"=true})
     * @Rest\View
     */
    public function deleteMediaAction(Request $request, $idPres, $t)
    {
        $em = $this->getDoctrine()->getManager();
        $image = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($t);
        $pres = $image->getPresentationImage();
        if ($pres) {
            foreach ($pres as $p) {
                $p->removeImage($image);
                $em->persist($p);
            }
        }
        $path = strstr($image->getUrl(), 'uploads');
        $pathThumb = strstr($image->getThumbUrl(), 'uploads');
        if (file_exists($this->container->getParameter('main_directory').'/web/'.$path)) :
            unlink($this->container->getParameter('main_directory').'/web/'.$path);
        unlink($this->container->getParameter('main_directory').'/web/'.$pathThumb);
        endif;
        $em->remove($image);
        $em->flush();

        return $t;
    }

    public function createMedia($media)
    {
        $mm = new Media();
        $mm->id = $media['id'];
        $mm->setLabelMedia($media['labelMedia']);
        $mm->setUrl($media['url']);
        $mm->setSize($media['size']);
        $mm->setInline($media['inline']);
        $mm->setHeight($media['height']);
        $mm->setContentType($media['contentType']);
        $mm->setMaster($media['master']);
        $mm->setShared($media['shared']);
        $mm->setFlag($media['flag']);
        $mm->setCreated($media['created']);
        $mm->setWidth($media['width']);
        $mm->setTitle($media['title']);
        $mm->setLegend($media['legend']);

        return $mm;
    }
}
