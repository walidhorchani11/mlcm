<?php

namespace ArgoMCMBuilder\MediaBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use ArgoMCMBuilder\MediaBundle\Entity\Media;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\MediaBundle\Entity\Video;
use ArgoMCMBuilder\MediaBundle\Entity\Image;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Aws\S3\S3Client;

/**
 * Media controller.
 *
 * @Route("/media")
 */
class MediaController extends Controller
{
    /**
     * Lists all Media entities.
     *
     * @Route("/", name="media_index", defaults={"type" = null,"prod" = null})
     * @Route("/filter/{type}/{prod}", name="media_index_type", defaults={"type" = null,"prod" = null})
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     * @param string  $type
     * @param string  $prod
     *
     * @return Response
     */
    public function indexAction(Request $request, $type = null, $prod = null)
    {
        $media = '';
        $pdf = '';
        $video = '';
        $image = '';
        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        $compUser = $user->getCompany();
        $products = array();
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($compUser->getId());

        if ($request->getMethod() == 'POST') {
            $label = $request->request->get('searchlabel');
            $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->findMediaBylabel(
                $label,
                $user,
                $company->getId()
            );
            $image = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->findMediaBylabel(
                $label,
                $user,
                $company->getId()
            );
            $video = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->findMediaBylabel(
                $label,
                $user,
                $company->getId()
            );
        } else {
            if ($type == 'pdf') {
                $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    'application/pdf',
                    $prod
                );
            } elseif ($type == 'image') {
                $image = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    'image/%',
                    $prod
                );
            } elseif ($type == 'video') {
                $video = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    'video/%',
                    $prod
                );
            } elseif ($type == 'me') {
                $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    'mymedia',
                    $prod
                );
                $image = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    'mymedia',
                    $prod
                );
                $video = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    'mymedia',
                    $prod
                );
            } else {
                $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    null,
                    $prod
                );
                $image = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    null,
                    $prod
                );
                $video = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->getMediaByCompany(
                    $user,
                    $company->getId(),
                    null,
                    $prod
                );
            }
        }

        return $this->render(
            'ArgoMCMBuilderMediaBundle:media:list.html.twig',
            array(
                'type' => $type,
                'prod' => $prod,
                'pdf' => $pdf,
                'image' => $image,
                'video' => $video,
                'media' => $media,
                'products' => $products,
                'userCompany' => $compUser->getName(),
                'companyParentName' => $company->getName(),
            )
        );
    }

    /**
     * Lists all Media entities.
     *
     * @Route("/ajax/getPresentation", name="get_presentationByProject")
     * @Method("GET")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getPresentationByProjectAction(Request $request)
    {
        $liste = array();
        $idProject = $request->query->get('idProject');
        $em = $this->getDoctrine()->getManager();
        $project = $em->getRepository('ProjectBundle:Project')->find($idProject);
        if ($project->getType() == 'Master to Loc') {
            $presentations = $em->getRepository('PresentationBundle:Presentation')->findBy(
                array('project' => $project, 'type' => array('Master', 'Standard'))
            );
        } else {
            $presentations = $em->getRepository('PresentationBundle:Presentation')->findBy(
                array('project' => $project, 'type' => 'Standard')
            );
        }
        foreach ($presentations as $p) {
            $liste[] = array('id' => $p->getId(), 'nom' => $p->getName());
        }
        $response = new JsonResponse();
        $response->setData(array('data' => $liste));

        return $response;
    }

    /**
     * Lists all Media entities.
     *
     * @Route("/ajax/removeMedia/{type}", name="remove_media_ajax")
     * @Method("GET")
     *
     * @param string  $type
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function removeMediaAjaxAction($type, Request $request)
    {
        $response = new JsonResponse();
        $mediaService  = $this->container->get('mcm.aws_media');
        $mediaService->removeMedia($type, $request);
//        $id = $request->query->get('id');
//        $em = $this->getDoctrine()->getManager();
//        $awsConfig = $this->container->getParameter('aws');
//        $s3Client = new \Aws\S3\S3Client([
//            'version' => $awsConfig['apiVersion'],
//            'region' => $awsConfig['region'],
//            'credentials' => [
//            'key' => $awsConfig['aws_access_key_id'],
//            'secret' => $awsConfig['aws_secret_access_key'],
//            ],
//        ]);
//        if ($type == 'img') {
//            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($id);
//            $pres = $media->getPresentationImage();
//            if ($media->getWidth() > 1024) {
//                $s3Client->deleteObject(
//                    array(
//                        'Bucket' => $awsConfig['resize_bucket'],
//                        'Key' => 'thumb_media/'.$media->getTitle(),
//                    )
//                );
//                $s3Client->deleteObject(
//                    array(
//                        'Bucket' => $awsConfig['resize_bucket'],
//                        'Key' => '1024xnull/'.$media->getTitle(),
//                    )
//                );
//            }
//            if ($pres) {
//                foreach ($pres as $p) {
//                    //$rev = $p->getRevision();
//                    $p->removeImage($media);
//                    $em->persist($p);
//                }
//            }
//        } elseif ($type == 'pdf') {
//            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($id);
//            $pres = $media->getPresentationPdf();
//            if ($pres) {
//                foreach ($pres as $p) {
//                    $p->removePdf($media);
//                    $em->persist($p);
//                }
//            }
//        } else {
//            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($id);
//            $pres = $media->getPresentationVideo();
//            if ($pres) {
//                foreach ($pres as $p) {
//                    $p->removeVideo($media);
//                    $em->persist($p);
//                }
//            }
//        }
//        /*    $path = strstr($media->getUrl(), 'uploads');
//            $pathThumb = strstr($media->getThumbUrl(), 'uploads');
//            if (file_exists($this->container->getParameter('main_directory').'/web/'.$path)) :
//                unlink($this->container->getParameter('main_directory').'/web/'.$path);
//            endif;
//            if (file_exists($this->container->getParameter('main_directory').'/web/'.$pathThumb)) :
//                unlink($this->container->getParameter('main_directory').'/web/'.$pathThumb);
//            endif;
//        */
//         $s3Client->deleteObject(array(
//             'Bucket' => $media->getBucketName(),
//             'Key' => $media->getKey(),
//         ));
//         $em->remove($media);
//         $em->flush();
         $response->setData(
             array(
                'data' => 'success',
             )
         );

         return $response;
    }

    /**
     * update media.
     *
     * @Route("/updateMedia/{id}/{type}", name="update_media")
     * @Method({"GET", "POST"})
     *
     * @param int     $id
     * @param string  $type
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function updateMediaAction($id, $type, Request $request)
    {
        if ($this->getUser()->hasRole('ROLE_ADMIN') || $this->getUser()->hasRole('ROLE_MANAGER') || $this->getUser()
                ->hasRole('ROLE_SUPER_ADMIN')
        ) {
            $em = $this->getDoctrine()->getManager();
            if ($type == 'img') {
                $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($id);
            } elseif ($type == 'pdf') {
                $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($id);
            } else {
                $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($id);
            }
            $newtitle = $request->request->get('title');

            //$thumbUrl = str_replace($media->getLabelMedia(),$newtitle.$ext,$media->getThumbUrl());
            //$url  = str_replace($media->getLabelMedia(),$newtitle.$ext,$media->getUrl());
            //$fileSystem = new Filesystem();
            //$fileSystem->rename($this->container->getParameter('media_directory_image').'/'.$media->getLabelMedia(),$this->container->getParameter('media_directory_image').'/'.$newtitle.$ext);
            //$media->setThumbUrl($thumbUrl);
            //$media->setUrl($url);
            $media->setTitle($newtitle);
            $em->persist($media);
            $em->flush();

            return $this->redirect($this->generateUrl('media_index'));
        } else {
            // throw new NotFoundHttpException("Page not found");
            return $this->denyAccessUnlessGranted('ROLE_EDIT', 'update media', 'You don\'t have permission to access.');
        }
    }

    /**
     * show a img.
     *
     * @Route("/token=img{id}", name="token=img")
     * @Method({"GET", "POST"})
     */
    public function afficheAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $img = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->findOneBy(array('id' => $id));
        $url = $img->getUrl();
        $response = new Response();
        $response->headers->set('Content-Disposition', 'inline');
        $response->headers->set('Content-Type', 'image/png');
        $response->setContent(file_get_contents($url));



        return $response;
    }

    /**
     * show a video.
     *
     * @Route("/token=video{id}", name="token=video")
     * @Method({"GET", "POST"})
     */
    public function afficheVDAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $img = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->findOneBy(array('id' => $id));
        $url = $img->getUrl();
        $response = new Response();
        $response->headers->set('Content-Disposition', 'inline');
        $response->headers->set('Content-Type', 'video/mp4');
        $response->setContent(file_get_contents($url));

        return $response;
    }

    /**
     * show a video.
     *
     * @Route("/path-img/{id}", name="path_img")
     * @Method({"GET", "POST"})
     */
    public function showImgPathAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $img = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->findOneBy(array('id' => $id));

        return 'http://'.$this->container->get('router')->getContext()->getHost().$img->getUrl();
    }

    /**
     * Show a pdf.
     *
     * @Route("/token=pdf{id}", name="token=pdf")
     * @Method({"GET", "POST"})
     */
    public function affichepdfAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->findOneBy(array('id' => $id));
        $url = $pdf->getUrl();
        $response = new Response();
        $response->headers->set('Content-Disposition', 'inline');
        $response->headers->set('Content-Type', 'application/pdf');
        $response->setContent(file_get_contents($url));

        return $response;
    }

    /**
     * Creates a new Media entity.
     *
     * @Route("/new", name="media_new")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     */
    public function newAction(Request $request)
    {
        /*$medium = new Media();

        return $this->render('ArgoMCMBuilderMediaBundle:media:new.html.twig', array(
            'medium' => $medium,
        ));*/
    }

    /**
     * @Method({"GET", "POST"})
     * @Route("/ajax/media/new", name="ajax_media_new")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function newAjaxMediaAction(Request $request)
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
        $company = $owner->getCompany();
        $companyName = $company->getName();
        $data = $mediaUploader->getDirectory($file, $companyName);
        $fileInfo = $mediaUploader->upload($file, $data['path']);
        $tabInfo = explode('#', $fileInfo);
        $fileName = $tabInfo[0];
        if (in_array($contentType, $extImage)) {
            $media = new Image();
            $width = $tabInfo[1];
            $height = $tabInfo[2];
            $media->setWidth($width);
            $media->setHeight($height);
        } elseif ($contentType == 'application/pdf') {
            $media = new Pdf();
        } else {
            $media = new Video();
        }

        $media->setLabelMedia($fileName);
        if (empty($request->request->get('title')) || $request->request->get('title') == '' ||
            $request->request->get('title') == null) {
            $fileName = $file->getClientOriginalName();
            $info = pathinfo($fileName);
            $defaultTitle = basename($fileName, '.'.$info['extension']);
            $media->setTitle($defaultTitle);
        } else {
            $media->setTitle($request->request->get('title'));
        }
        $media->setSize($size);
        $media->setOwner($owner);
        $media->setCompany($company);
        $media->setContentType($contentType);
        $media->setUrl(
            'http://'.$this->container->get('router')->getContext()->getHost(
            ).'/uploads/'.$data['url'].'/'.$tabInfo['3']
        );
        $media->setThumbUrl(
            'http://'.$this->container->get('router')->getContext()->getHost(
            ).'/uploads/'.$data['url'].'/'.$tabInfo['3']
        );
        $media->setCreated(new \DateTime('now'));
        $media->setUpdated(new \DateTime('now'));
        $media->setFlag(10);
        $em->persist($media);
        $em->flush();

        return new JsonResponse(
            array(
                'success' => true,
                'data' => $data,
            )
        );
    }

    /**
     * replace media.
     *
     * @Route("/ajax/replaceMedia/{id}/{type}", name="replace_media_ajax")
     * @Method({"GET", "POST"})
     *
     * @param int     $id
     * @param string  $type
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function replaceMediaAjaxAction($id, $type, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $file = $request->files->get('file');
        $size = $file->getSize();
        $contentType = $file->getMimeType();

        if ($type == 'img') {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($id);
            $pathThumbForDelete = strstr($media->getThumbUrl(), 'uploads');
            $pathForDelete = strstr($media->getUrl(), 'uploads');
            $path = strtr($pathForDelete, array('/'.$media->getLabelMedia() => ''));

            if (file_exists($this->container->getParameter('main_directory').'/web/'.$pathForDelete)) :
                unlink($this->container->getParameter('main_directory').'/web/'.$pathForDelete);
            endif;
            if (file_exists($this->container->getParameter('main_directory').'/web/'.$pathThumbForDelete)) :
                unlink($this->container->getParameter('main_directory').'/web/'.$pathThumbForDelete);
            endif;

            $file->move($path, $media->getLabelMedia());
        } elseif ($type == 'pdf') {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($id);
            $pathForDelete = strstr($media->getUrl(), 'uploads');
            $path = strtr($pathForDelete, array('/'.$media->getLabelMedia() => ''));
            if (file_exists($this->container->getParameter('main_directory').'/web/'.$pathForDelete)) :
                unlink($this->container->getParameter('main_directory').'/web/'.$pathForDelete);
            endif;
            $file->move($path, $media->getLabelMedia());
        } else {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($id);
            $pathForDelete = strstr($media->getUrl(), 'uploads');
            $path = strtr($pathForDelete, array('/'.$media->getLabelMedia() => ''));
            if (file_exists($this->container->getParameter('main_directory').'/web/'.$pathForDelete)) :
                unlink($this->container->getParameter('main_directory').'/web/'.$pathForDelete);
            endif;
            $file->move($path, $media->getLabelMedia());
        }
        $media->setSize($size);
        $media->setUpdated(new \DateTime('now'));
        $media->setWidth('');
        $media->setHeight('');
        $em->persist($media);
        $em->flush();

        return new JsonResponse(
            array(
                'success' => true,
                'data' => array('path' => $pathForDelete),
            )
        );
    }

    /**
     * @Method({"GET", "POST"})
     * @Route("/ajax/getPresByMediaAction/", name="getPresByMediaAction")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getPresByMediaAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $type = $request->query->get('type');
        if ($type == 'img') {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($request->query->get('id'));
            $rev   = $media->getRevisionImage();
        } elseif ($type == 'pdf') {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($request->query->get('id'));
            $rev   = $media->getRevisionPdf();
        } else {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($request->query->get('id'));
            $rev   = $media->getRevisionVideo();
        }

        $resp = array();
        foreach ($rev as $p) {
            $resp[] = $p->getPresentation()->getName().' - version: '.$p->getVersion();
        }
        $response = new JsonResponse();
        $response->setData($resp);

        return $response;
    }

    /**
     * Finds and displays a Media entity.
     *
     * @Route("/{id}", name="media_show")
     * @Method("GET")
     *
     * @param Media $medium
     *
     * @return Response
     */
    public function showAction(Media $medium)
    {
        $deleteForm = $this->createDeleteForm($medium);

        return $this->render(
            'media/show.html.twig',
            array(
                'medium' => $medium,
                'delete_form' => $deleteForm->createView(),
            )
        );
    }

    /**
     * Displays a form to edit an existing Media entity.
     *
     * @Route("/{id}/edit", name="media_edit")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     * @param Media   $medium
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     */
    public function editAction(Request $request, Media $medium)
    {
        $deleteForm = $this->createDeleteForm($medium);
        $editForm = $this->createForm('ArgoMCMBuilder\MediaBundle\Form\MediaType', $medium);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($medium);
            $em->flush();

            return $this->redirectToRoute('media_edit', array('id' => $medium->getId()));
        }

        return $this->render(
            'media/edit.html.twig',
            array(
                'medium' => $medium,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
            )
        );
    }

    /**
     * Deletes a Media entity.
     *
     * @Route("/{id}", name="media_delete")
     * @Method("DELETE")
     *
     * @param Request $request
     * @param Media   $medium
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deleteAction(Request $request, Media $medium)
    {
        $form = $this->createDeleteForm($medium);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($medium);
            $em->flush();
        }

        return $this->redirectToRoute('media_index');
    }

    /**
     * update media details (editor).
     *
     * @Method({"GET", "POST"})
     * @Route("/editor/UpdateMedia", name="editor_update_media")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateMediaEditorAction(Request $request)
    {
        $type = $request->query->get('type');
        $id = $request->query->get('id');

        $em = $this->getDoctrine()->getManager();
        if (strpos($type, 'image') !== false) {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($id);
        } elseif ($type == 'application/pdf') {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($id);
        } elseif (strpos($type, 'video') !== false) {
            $media = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($id);
        }
        $newTitle = $request->request->get('inputTitle');
        $newLegend = $request->request->get('LegendTextarea');

        $media->setTitle($newTitle);
        $media->setLegend($newLegend);
        $em->persist($media);
        $em->flush();

        return $this->redirect($this->generateUrl('media_index'));
    }

    /**
     * Add New pdf File with presentation.
     *
     * @Method({"GET", "POST"})
     * @Route("/ajax/uploadPdf/{idPres}", name="ajax_upload_pdf")
     *
     * @param Request $request
     * @param int     $idPres
     *
     * @return JsonResponse
     */
    public function newAjaxMediaPdfAction(Request $request, $idPres)
    {
        if ($request->request->get('value') == 1) {
            $em = $this->getDoctrine()->getManager();
            $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($request->request->get('idPdf'));
            $pdf->setTitle($request->request->get('title'));
            $em->persist($pdf);
            $em->flush();

            return new JsonResponse(
                array(
                    'success' => true,
                    'id' => $pdf->getId(),
                    'url' => $pdf->getUrl(),
                    'title' => $pdf->getTitle(),
                    'labelMedia' => $pdf->getLabelMedia(),
                )
            );
        } else {
            $file = $request->files->get('myfile');

            $em = $this->getDoctrine()->getManager();
            $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);

            $owner = $this->getUser();
            $company = $owner->getCompany();
            $contentType = $file->getMimeType();
            $size = $file->getSize();
            $mediaUploader = $this->get('clm_media_uploader');
            $data = $mediaUploader->getDirectory($file, $company->getName(), $idPres);
            $fileName = $file->getClientOriginalName();
            $fileInfo = $mediaUploader->upload($file, $data['path']);
            $fileName = $fileInfo['originalFileName'];
            $media = new Pdf();
            $media->setLabelMedia($fileName);
            $media->setTitle($request->request->get('title'));
            $media->setSize($size);
            $media->setOwner($owner);
            $media->setCompany($company);
            $media->setContentType($contentType);
            $media->setUrl(
                'http://'.$this->container->get('router')->getContext()->getHost(
                ).'/uploads/'.$data['url'].'/'.$fileInfo['fileName']
            );
            $media->setThumbUrl(
                'http://'.$this->container->get('router')->getContext()->getHost(
                ).'/uploads/'.$data['url'].'/thumbnail'.$fileInfo['fileName']
            );
            $media->setCreated(new \DateTime('now'));
            $media->setUpdated(new \DateTime('now'));
            $media->setFlag(20);

            $em->persist($media);
            $em->flush();

            $pres->addPdf($media);
            $em->persist($pres);
            $em->flush();

            return new JsonResponse(
                array(
                    'success' => true,
                    'id' => $media->getId(),
                    'url' => $media->getUrl(),
                    'title' => $media->getTitle(),
                    'labelMedia' => $media->getLabelMedia(),
                )
            );
        }
    }

    /**
     * Delete pdf File with presentation.
     *
     * @Method({"GET", "POST"})
     * @Route("/ajax/deletePdf", name="ajax_delete_pdf")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function deletePdfAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $pdf = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($request->request->get('idPdf'));
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($request->request->get('idPres'));
        $pres->removePdf($pdf);
        $em->persist($pres);
        $em->flush();
        $em->remove($pdf);
        $em->flush();

        return new JsonResponse(
            array(
                'id' => $request->request->get('idPdf'),
            )
        );
    }
    /**
     * GET Route annotation.
     *
     * @Method({"GET", "POST"})
     * @Route("/medias/showPdf", name="show_pdf")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function showPdfAction(Request $request)
    {
        if ($this->getUser()) {
            $key = $request->query->get('key');
            $s3Client = new S3Client([
                'version' => '2006-03-01',
                'region' => 'eu-west-1',
                'credentials' => [
                    'key' => 'AKIAIQD2ECGCACM6ETUA',
                    'secret' => '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',
                ],
            ]);
            $url = $s3Client->getObjectUrl('argolife-mcm-export', 'pdf/'.$key);
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
     * @param string $str
     * @Method({"GET", "POST", "DELETE"})
     * @Route("/signRequest/s3/{str}", name="s3_signature")
     *
     * @return Response
     */
    public function s3Action($str = null)
    {
        $mediaService = $this->container->get('mcm.aws_media');
        $method = $mediaService->getRequestMethod();
        if ($method == 'OPTIONS') {
            $mediaService->handlePreflight();
        } else {
            if ($method == 'DELETE') {
                $mediaService->handleCorsRequest();
                $mediaService->deleteObject();
            } else {
                if ($method == 'POST') {
                    $mediaService->handleCorsRequest();
                    if (isset($_REQUEST['success'])) {
                        $mediaService->verifyFileInS3();
                    } else {
                        $mediaService->signRequest();
                    }
                }
            }
        }

        return new Response();
    }

    /**
     * GET Route annotation.
     *
     * @Method({"GET", "POST"})
     * @Route("/medias/awsUpload", name="medias_new_aws")
     * @param Request $request
     * @return JsonResponse
     */
    public function news3MediaAction(Request $request)
    {
        $fileSize  = $request->request->get('size');
        $fileUrl   = $request->request->get('url');
        $fileName  = $request->request->get('name');
        $fileType  = $request->request->get('type');
        $bucket    = $request->request->get('bucket');
        $key       = $request->request->get('key');
        $className = '';

        if (preg_match('/image.*/', $fileType, $match) === 1) {
            $type     = 'image';
            $width    = $request->request->get('width');
            $height   = $request->request->get('height');
            $thumbUrl = $request->request->get('thumbUrl');
            $url1024  = $request->request->get('url1024');
            $resize   = $request->request->get('resize');
            if ($resize === 'false' || $resize === false) {
                $thumbUrl    = $fileUrl;
                $url1024     = $fileUrl;
            }
            $media    = new Image();
            $media->setWidth($width);
            $media->setHeight($height);
            $media->setOriginalImage($fileUrl);
            $t                       = 'img';
            $presentationModal       = 'PresentationModalImage';
            $updatePresentationModal = 'UpdatePresentationModalimg';
            $replaceModal            = 'ReplaceModalimg';
        } elseif (preg_match('/video.*/', $fileType, $match) === 1) {
            $type                    = 'video';
            $media                   = new Video();
            $thumbUrl                = '/img/video.png';
            $url1024                 = $fileUrl;
            $t                       = 'video';
            $presentationModal       = 'PresentationModalVideo';
            $updatePresentationModal = 'UpdatePresentationModalvideo';
            $replaceModal            = 'ReplaceModalvideo';
            $className               = 'addVideo';
        } elseif (preg_match('/application\/pdf/', $fileType, $match) === 1) {
            $type                    = 'pdf';
            $media = new Pdf();
            $thumbUrl                = '/img/pdf.png';
            $url1024                 = $fileUrl;
            $t                       = 'pdf';
            $presentationModal       = 'PresentationModalPdf';
            $updatePresentationModal = 'UpdatePresentationModalpdf';
            $replaceModal            = 'ReplaceModalpdf';
            $className               = 'addModal';
        } else {
            $type = null;
        }

        $mediaUploader = $this->get('clm_media_uploader');
        if ($type == null or $mediaUploader->getMaxfile($type) < $fileSize) {
            return new JsonResponse(
                array(
                    'success' => false,
                )
            );
        }

        $em      = $this->getDoctrine()->getManager();
        $owner   = $this->getUser();
        $presService    = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company        = $presService->recursiveFindParent($owner->getCompany()->getId());

        $media->setLabelMedia($fileName);
        $media->setTitle($fileName);
        $media->setSize($fileSize);
        $media->setOwner($owner);
        $media->setCompany($company);
        $media->setContentType($fileType);
        $media->setUrl($url1024);
        $media->setThumbUrl($thumbUrl);
        $media->setCreated(new \DateTime('now'));
        $media->setUpdated(new \DateTime('now'));
        $media->setFlag(10);
        $media->setBucketName($bucket);
        $media->setKey($key);
        $em->persist($media);
        $em->flush();
        $idMedia    = $media->getId();
        $urlDisplay = $this->generateUrl('token='.$t, array('id' => $idMedia));
        $urlUpdate  = $this->generateUrl('update_media', array('id' => $idMedia, 'type' => $t));
        $urlReplace = $this->generateUrl('replace_media_ajax', array('id' => $idMedia, 'type' => $t));
        $urlRemove  = $this->generateUrl('remove_media_ajax', array('type' => $t));
        $data       = array(
            'id'                => $idMedia,
            'url'               => $fileUrl,
            'title'             => $media->getTitle(),
            'flag'              => $media->getFlag(),
            'created'           => $media->getCreated()->format('m/d/Y'),
            'updated'           => $media->getUpdated()->format('m/d/Y'),
            'labelmedia'        => $fileName,
            'height'            => $media->getHeight(),
            'width'             => $media->getWidth(),
            'size'              => $fileSize,
            'thumb_url'         => $media->getThumbUrl(),
            'type'              => $fileType,
            'urlDisplay'        => $media->getUrl(),
            'urlUpdate'         => $urlUpdate,
            'urlReplace'        => $urlReplace,
            'urlRemove'         => $urlRemove,
            'presentationModal' => $presentationModal,
            'upPresModal'       => $updatePresentationModal,
            'replaceModal'      => $replaceModal,
            'className'         => $className,
            't'                 => $t,
            'key'               => $key,
        );

        return new JsonResponse($data);
    }

    /**
     * GET Route annotation.
     *
     * @Method({"GET", "POST"})
     * @Route("/medias/awsReplace", name="replace_Media_s3")
     * @param Request $request
     * @return JsonResponse
     */
    public function replaceS3MediaAction(Request $request)
    {
        $idMedia   = $request->request->get('idMedia');
        $fileSize  = $request->request->get('size');
        $fileUrl   = $request->request->get('url');
        $fileName  = $request->request->get('name');
        $fileType  = $request->request->get('type');
        $bucket    = $request->request->get('bucket');
        $key       = $request->request->get('key');
        $className = '';
        $em        = $this->getDoctrine()->getManager();
        if (preg_match('/image.*/', $fileType, $match) === 1) {
            $type     = 'image';
            $width    = $request->request->get('width');
            $height   = $request->request->get('height');
            $thumbUrl = $request->request->get('thumbUrl');
            $url1024  = $request->request->get('url1024');
            $resize   = $request->request->get('resize');
            $media    = $em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($idMedia);
            $media->setWidth($width);
            $media->setHeight($height);
            if ($resize === 'true' || $resize === true) {
                $thumbUrl    = $fileUrl;
            } else {
                $thumbUrl    = $fileUrl;
            }
            $t = 'img';
            $presentationModal       = 'PresentationModalImage';
            $updatePresentationModal = 'UpdatePresentationModalimg';
            $replaceModal            = 'ReplaceModalimg';
        } elseif (preg_match('/video.*/', $fileType, $match) === 1) {
            $type                    = 'video';
            $media                   = $em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($idMedia);
            $thumbUrl                = '/img/video.png';
            $t                       = 'video';
            $presentationModal       = 'PresentationModalVideo';
            $updatePresentationModal = 'UpdatePresentationModalvideo';
            $replaceModal            = 'ReplaceModalvideo';
            $className               = 'addVideo';
        } elseif (preg_match('/application\/pdf/', $fileType, $match) === 1) {
            $type                    = 'pdf';
            $media                   = $em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($idMedia);
            $thumbUrl                = '/img/pdf.png';
            $t                       = 'pdf';
            $presentationModal       = 'PresentationModalPdf';
            $updatePresentationModal = 'UpdatePresentationModalpdf';
            $replaceModal            = 'ReplaceModalpdf';
            $className               = 'addModal';
        } else {
            $type = null;
        }

        $mediaUploader = $this->get('clm_media_uploader');
        if ($type == null or $mediaUploader->getMaxfile($type) < $fileSize) {
            return new JsonResponse(
                array(
                    'success' => false,
                )
            );
        }

        $media->setSize($fileSize);
        $media->setUpdated(new \DateTime('now'));
        $em->persist($media);
        $em->flush();
        $idMedia    = $media->getId();
        $urlDisplay = $this->generateUrl('token='.$t, array('id' => $idMedia));
        $urlUpdate  = $this->generateUrl('update_media', array('id' => $idMedia, 'type' => $t));
        $urlReplace = $this->generateUrl('replace_media_ajax', array('id' => $idMedia, 'type' => $t));
        $urlRemove  = $this->generateUrl('remove_media_ajax', array('type' => $t));
        $data       = array(
            'id'                => $idMedia,
            'url'               => $fileUrl,
            'title'             => $media->getTitle(),
            'flag'              => $media->getFlag(),
            'created'           => $media->getCreated()->format('m/d/Y'),
            'updated'           => $media->getUpdated()->format('m/d/Y'),
            'labelmedia'        => $fileName,
            'height'            => $media->getHeight(),
            'width'             => $media->getWidth(),
            'size'              => $fileSize,
            'thumb_url'         => $media->getThumbUrl(),
            'type'              => $fileType,
            'urlDisplay'        => $media->getUrl(),
            'urlUpdate'         => $urlUpdate,
            'urlReplace'        => $urlReplace,
            'urlRemove'         => $urlRemove,
            'presentationModal' => $presentationModal,
            'upPresModal'       => $updatePresentationModal,
            'replaceModal'      => $replaceModal,
            'className'         => $className,
            't'                 => $t,
            'key'               => $key,
        );

        return new JsonResponse($data);
    }

     /**
      * Creates a form to delete a Media entity.
      *
      * @param Media $medium The Media entity
      *
      * @return \Symfony\Component\Form\Form The form
      */

    private function createDeleteForm(Media $medium)
    {
        return $this->createFormBuilder()
                    ->setAction($this->generateUrl('media_delete', array('id' => $medium->getId())))
                    ->setMethod('DELETE')
                    ->getForm();
    }
}
