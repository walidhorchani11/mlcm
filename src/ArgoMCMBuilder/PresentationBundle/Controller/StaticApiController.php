<?php

namespace ArgoMCMBuilder\PresentationBundle\Controller;

//Fixme : @ Mehrez ce controleur est t-il encor utulisé ???
header('Access-Control-Allow-Origin: *');
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

class StaticApiController extends Controller
{
    /**
     * @Route("/createdecks", name="createdecks")
     */
    public function createDecksAction()
    {
        $data = '{"total":2,"type":"decks","results":[{"id":785971,"slug":"deck-1","title":"deck","description":"",
        "visibility":"all","published_at":"2016-08-30T13:39:49.078Z","sanitize_messages":null,
        "thumbnail_url":"https://s3.amazonaws.com/media-p.slid.es/thumbnails/1a27abb17c5bf080ccd31198381c36cf/thumb.jpg"
        ,"view_count":0,"user":{"id":562920,"username":"mohammedmejri","name":"Mohammed MEJRI","description":null,
        "thumbnail_url":"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?
        sz=50","pro":false,"team_id":null,"settings":{"id":407375,"present_controls":true,"present_upsizing":true,
        "present_notes":true}},"background_transition":"slide","transition":"slide","theme_id":null,"theme_font":
        "montserrat","theme_color":"white-blue","auto_slide_interval":0,"comments_enabled":true,"forking_enabled":true,
        "rolling_links":false,"center":false,"should_loop":false,"share_notes":null,"slide_number":2,"rtl":false,
        "version":2,"collaborative":null,"deck_user_editor_limit":1,"data_updated_at":1472564399406},{"id":785958,
        "slug":"deck","title":"deck","description":"","visibility":"all","published_at":"2016-08-30T13:28:22.295Z",
        "sanitize_messages":null,"thumbnail_url":"https://s3.amazonaws.com/media-p.slid.es/thumbnails/
        6a5e189f74e2e15c26a745c76b21b8f5/thumb.jpg","view_count":0,"user":{"id":562920,"username":"mohammedmejri","name"
        :"Mohammed MEJRI","description":null,"thumbnail_url":"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI
        /AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50","pro":false,"team_id":null,"settings":{"id":407375,"present_controls":
        true,"present_upsizing":true,"present_notes":true}},"background_transition":"slide","transition":"slide",
        "theme_id":null,"theme_font":"montserrat","theme_color":"white-blue","auto_slide_interval":0,"comments_enabled":
        true,"forking_enabled":true,"rolling_links":false,"center":false,"should_loop":false,"share_notes":null,
        "slide_number":null,"rtl":false,"version":2,"collaborative":null,"deck_user_editor_limit":1,"data_updated_at":
        1472563702296}]}';
        $response = new Response($data);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/templates", name="templates")
     */
    public function templatesAction()
    {
        $data = '{"id":785971,"slug":"deck-1","title":"deck","description":"","visibility":"all","published_at":
        "2016-08-30T13:39:49.078Z","sanitize_messages":null,"thumbnail_url":"https://s3.amazonaws.com/media-p.slid.es/
        thumbnails/1a27abb17c5bf080ccd31198381c36cf/thumb.jpg","view_count":0,"user":{"id":562920,"username":
        "mohammedmejri","name":"Mohammed MEJRI","description":null,"thumbnail_url":"https://lh3.googleusercontent.com/
        -XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50","pro":false,"team_id":null,"settings":
        {"id":407375,"present_controls":true,"present_upsizing":true,"present_notes":true}},"background_transition":
        "slide","transition":"slide","theme_id":null,"theme_font":"montserrat","theme_color":"blue-yellow",
        "auto_slide_interval":0,"comments_enabled":true,"forking_enabled":true,"rolling_links":false,"center":false,
        "should_loop":false,"share_notes":null,"slide_number":null,"rtl":false,"version":2,"collaborative":null,
        "deck_user_editor_limit":1,"data_updated_at":1472572204192}';
        $response = new Response($data);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/decks", name="decks")
     */
    public function decksAction()
    {
        $data = '{"id":789940,"slug":"hjjhgj","title":"hjjhgj","description":"","visibility":"all",
        "published_at":"2016-09-05T10:51:51.381Z","sanitize_messages":null,"thumbnail_url":
        "https://s3.amazonaws.com/media-p.slid.es/thumbnails/e42a7c50180330a693b67b151cdacf7d/thumb.jpg",
        "view_count":0,"user":{"id":562920,"username":"mohammedmejri","name":"Mohammed MEJRI","description":null,
        "thumbnail_url":"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?
        sz=50","pro":false,"team_id":null,"settings":{"id":407375,"present_controls":true,"present_upsizing":true,
        "present_notes":true}},"background_transition":"slide","transition":"slide","theme_id":null,"theme_font":
        "montserrat","theme_color":"white-blue","auto_slide_interval":0,"comments_enabled":true,"forking_enabled":
        true,"rolling_links":false,"center":false,"should_loop":false,"share_notes":null,"slide_number":null,"rtl":
        false,"version":2,"collaborative":null,"deck_user_editor_limit":1,"data_updated_at":1473094242186}';
        $response = new Response($data);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/presentation_thumbnails/{idPres}/{idRev}/allthumbs", name="presentation_thumbnails")
     */
    public function AllThumbnailsGenerateAction($idPres, $idRev)
    {
        $content = $this->get('request')->getContent();
        $params = json_decode($content, true);
        $urls = $params['urls'];
        $model = $params['model'];
        $modelResize = $params['modelResize'];
        $modelPath = $params['modelPath'];
        $modelPathResize = $params['modelPathResize'];
        $response = new Response();
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        if (!empty($content) && !empty($urls) && !empty($model) && !empty($modelResize)) {
            $pathFile = $this->container->getParameter('web_directory').'/'.$this->container
                    ->getParameter('presentations_thumbnails')."/$idPres-$idRev/slides/";
            $msg = '{"success": "Presentation : All slides thumbs created!"}';

            try {
                $fs = new Filesystem();
                if (!$fs->exists($pathFile)) {
                    $fs->mkdir($pathFile, 0755);
                }
                if (!$fs->exists($pathFile.$model)) {
                    $fs->copy($modelPath, $pathFile.$model, true);
                }
                $cmd = "cd $pathFile;";
                $cmd .= " phantomjs $model $urls";
                exec($cmd, $output, $returnVar);

                if ($returnVar !== 0) {
                    $msg = 'error' + $returnVar;
                }
                // resize 200px width
                if (!$fs->exists($pathFile.$modelResize)) {
                    $fs->copy($modelPathResize, $pathFile.$modelResize, true);
                }
                $cmd = '';
                $cmd = "cd $pathFile;";
                $cmd .= " phantomjs $modelResize $urls";
                exec($cmd, $output, $returnVar);

                if ($returnVar !== 0) {
                    $msg = 'error' + $returnVar;
                }
            } catch (IOExceptionInterface $e) {
                $msg = $e;
                echo 'An error occurred while creating your file (at thumbnailGenerateAction()) ';
            }

            $response->setContent($msg);

            return $response;
        } else {
            $response->setContent("{'error' : 'empty thumb url'}");

            return $response;
        }
    }

    /**
     * @Route("/popins_list_thumbnails/{idPres}/{idRev}/allPopinsThumbs", name="popins_list_thumbnails")
     */
    public function AllPopinsThumbnailsGenerateAction($idPres, $idRev)
    {
        $content = $this->get('request')->getContent();
        $params = json_decode($content, true);
        $urls = $params['urls'];
        $model = $params['model'];
        $modelPath = $params['modelPath'];
        $response = new Response();
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        if (!empty($content) && !empty($urls) && !empty($model)) {
            $pathFile = $this->container->getParameter('web_directory').'/'.$this->container
                    ->getParameter('presentations_thumbnails')."/$idPres-$idRev/";
            $msg = '{"success": "Presentation : All slides thumbs created!"}';

            try {
                $fs = new Filesystem();
                if (!$fs->exists($pathFile)) {
                    $fs->mkdir($pathFile, 0755);
                }
                if (!$fs->exists($pathFile.$model)) {
                    $fs->copy($modelPath, $pathFile.$model, true);
                }
                $cmd = "cd $pathFile;";
                $cmd .= " phantomjs $model $urls";
                exec($cmd, $output, $returnVar);

                if ($returnVar !== 0) {
                    $msg = 'error' + $returnVar;
                }
            } catch (IOExceptionInterface $e) {
                $msg = $e;
                echo 'An error occurred while creating your file (at thumbnailGenerateAction()) ';
            }

            $response->setContent($msg);

            return $response;
        } else {
            $response->setContent("{'error' : 'empty thumb url'}");

            return $response;
        }
    }

    /**
     * @Route("/thumbnail_generate/{idPres}/{idRev}/{action}", name="thumbnails_generate")
     */
    public function thumbnailGenerateAction($idPres, $idRev)
    {
        $content = $this->get('request')->getContent();
        $params = json_decode($content, true);
        $url = $params['previewurl'];
        $size = $params['size'];
        $fileName = $params['fileName'];
        $jsFile = $params['jsfile'];
        $dbSave = $params['dbSave'];
        $response = new Response();
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        if (!empty($content) && !empty($url) && !empty($size) && !empty($fileName) && !empty($jsFile)) {
            $pathFile = $this->container->getParameter('web_directory').'/'.$this->container
                    ->getParameter('presentations_thumbnails')."/$idPres-$idRev/";
            $msg = '{"success": "thumb created!"}';

            try {
                $fs = new Filesystem();
                $file = $pathFile.$jsFile;
                if (!$fs->exists($pathFile)) {
                    $fs->mkdir($pathFile, 0755);
                }
                if (!$fs->exists($file)) {
                    $fs->touch($file);
                    $filecontent = "var page = require('webpage').create();\npage.viewportSize = {".$size."};\npage.open
                    ('".$url."', function(status) {\nconsole.log(status);\nif (status == 'success')
                    {\nconsole.log('ok');\npage.render('".$fileName."');\nphantom.exit(0);\n} else
                    {\nconsole.log('error');\nphantom.exit(1);\n}\n});";
                    $fs->dumpFile($file, $filecontent);
                }
                $cmd = "cd $pathFile;";
                $cmd .= ' phantomjs '.$jsFile;
                exec($cmd, $output, $returnVar);

                if ($returnVar !== 0) {
                    $msg = 'error' + $returnVar;
                }
                if ($dbSave) {
                    $em = $this->getDoctrine()->getManager();
                    $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
                    $pres->setThumbnailPath(
                        $this->container->getParameter('presentations_thumbnails')."/$idPres-$idRev/thumb-$idPres.png"
                    );
                    $em->flush($pres);
                }
            } catch (IOExceptionInterface $e) {
                $msg = $e;
                echo 'An error occurred while creating your file (at thumbnailGenerateAction()) ';
            }

            $response->setContent($msg);

            return $response;
        } else {
            $response->setContent("{'error' : 'empty thumb url'}");

            return $response;
        }
    }

    /**
     * @Route("/thumbnail_s3_generate/{idPres}/{idRev}/{idCompany}/{companyName}/{thumbFolderName}/{bucket}", name="pres_thumbnail_s3_generate")
     */
    public function presthumbnails3GenerateAction($idPres, $idRev, $idCompany, $companyName, $thumbFolderName, $bucket)
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $em = $this->getDoctrine()->getManager();
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $pres->setThumbnailPath(
            "https://s3-eu-west-1.amazonaws.com/$bucket/$companyName/$thumbFolderName/$idPres-$idRev/thumb-$idPres.png"
        );
        $em->flush($pres);

        $rev = $em->getRepository('PresentationBundle:Revision')->find($idRev);
        $rev->setThumbnailUrl("$bucket/$companyName/$thumbFolderName/$idPres-$idRev/thumb-$idPres.png");
        $em->flush($rev);

        $response->setContent('{"success": "thumb created!"}');

        return $response;
    }

    /**
     * @Route("/videoposterffmpeg", name="videoposterffmpeg")
     */
    public function videoPosterActionffmpeg()
    {
        $content = $this->get('request')->getContent();
        $params = json_decode($content, true);
        $url = $params['url'];
        $idRev = $params['idRev'];
        $idPres = $params['idPres'];
        $idvideo = $params['videoId'];
        $response = new Response();
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $fs = new Filesystem();

        $dir = $this->container->getParameter('thumbnails');
        $video = escapeshellcmd($url);
        $cmd = "ffmpeg -i $video 2>&1";
        $second = 1;
        if (preg_match('/Duration: ((\d+):(\d+):(\d+))/s', `$cmd`, $time)) {
            $total = ($time[2] * 3600) + ($time[3] * 60) + $time[4];
            $second = rand(1, ($total - 1));
        }

        $image = $dir.'/videothumb-'.$idvideo.'.jpg';
        $cmd = "ffmpeg -i $video -deinterlace -an -ss $second -t 00:00:01 -r 1 -y -vcodec mjpeg -f mjpeg $image 2>&1";
        $msg = '{"success": "Video thumb created!"}';
        try {
            exec($cmd, $output, $returnVar);

            if ($returnVar !== 0) {
                $msg = 'error' + $returnVar;
            }
        } catch (IOExceptionInterface $e) {
            $msg = $e;
        }

        $response = new Response($msg);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/thumbnails-popin/{idPres}/{idRev}/{idPop}/popinthumb", name="thumbnail_popin_action")
     */
    public function thumbnailsPopinAction($idPres, $idRev, $idPop)
    {
        $content = $this->get('request')->getContent();
        $params = json_decode($content, true);
        $url = $params['thumburl'];
        $jsFile = $params['jsfile'];
        $fileName = $params['fileName'];
        $height = $params['height'];
        $width = $params['width'];
        $response = new Response();
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        if (!empty($content) && !empty($url) && !empty($fileName) && !empty($height) && !empty($width)) {
            $pathFile = $this->container->getParameter('web_directory').'/'.$this->container
                    ->getParameter('presentations_thumbnails')."/$idPres-$idRev/";
            $msg = '{"success": "thumb created!"}';

            $headers = @get_headers($url);
            if (strpos($headers[0], '500') !== false) {
            } else {
                try {
                    $fs = new Filesystem();
                    $file = $pathFile.$jsFile;
                    if (!$fs->exists($pathFile)) {
                        $fs->mkdir($pathFile, 0755);
                    }

                    $fs->touch($file);
                    $filecontent = "var page = require('webpage').create();\npage.viewportSize = {width: ".$width.',
                    height: '.$height."};\npage.open('".$url."', function(status) {\nconsole.log(status);\nif
                    (status == 'success') {\nconsole.log('ok');\npage.render('".$fileName."');\nphantom.exit(0);\n}
                    else {\nconsole.log('error');\nphantom.exit(1);\n}\n});";
                    $fs->dumpFile($file, $filecontent);

                    $cmd = "cd $pathFile;";
                    $cmd .= ' phantomjs '.$jsFile;
                    exec($cmd, $output, $returnVar);

                    if ($returnVar !== 0) {
                        $msg = 'error' + $returnVar;
                    }
                } catch (IOExceptionInterface $e) {
                    $msg = $e;
                    echo 'An error occurred while creating your file (at thumbnailGenerateAction()) ';
                }
            }

            $response->setContent($msg);

            return $response;
        } else {
            $response->setContent("{'error' : 'empty thumb url'}");

            return $response;
        }
    }

    /**
     * @Route("/delete-thumbnails-popin/{idPres}/{idRev}/{imageName}", name="delete_thumbnails_popin")
     */
    public function deleteThumbnailsPopin($idPres, $idRev, $imageName)
    {
        $fs = new Filesystem();
        $request = $this->get('request');
        $dir = $this->container->getParameter('thumbnails');
        try {
            // this directory exists, return true
            $exists = $fs->exists($dir.'/'.$idPres.'-'.$idRev.'/'.$imageName);
            if ($exists) {
                $fs->remove($dir.'/'.$idPres.'-'.$idRev.'/'.$imageName);
                $msg = '{"success": "File deleted !"}';
            }
        } catch (IOExceptionInterface $e) {
            $msg = '{"error": "The specified resource could not be deleted"}';
        }
        $response = new Response($msg);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/thumbnails/{idPres}/{idRev}", name="thumbnails2")
     */
    public function thumbnails2Action($idPres, $idRev)
    {
        $urlPres = $this->generateUrl('presentations_preview', array('idRev' => $idRev), true);

        $service = $this->get('service.argomcmbuilder_presentation.presentation');

        $responseThumb1 = $service->addThumbnail($idPres, $idRev, $urlPres);
        $responseThumb2 = $service->addVeevaThumbnail($idPres, $idRev, $urlPres);

        if (-1 == $responseThumb1) {
            $data = '{"error": "The specified resource could not be found. (MI)"}';
        } elseif (-1 == $responseThumb2) {
            $data = '{"error": "The specified resource could not be found. (Veeva)"}';
        } else {
            $data = '{'.$responseThumb1.', '.$responseThumb2.'}';
        }

        $response = new Response($data);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/status/{idPres}", name="status")
     */
    public function statusAction($idPres)
    {
        $user = $this->getUser();
        if ($user == null) {
            $data = '{"user_signed_in":false}';
            $em = $this->getDoctrine()->getManager();
            $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
            $pres->setModeEdit(10);
            $pres->setUsedBy(null);
            $em->flush();
        } else {
            $data = '{"user_signed_in":true,"user":{"username":"'.$user.'"}}';
            $em = $this->getDoctrine()->getManager();
            $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
            $pres->setLastUsed(new \DateTime());
            $em->flush();
        }
        $response = new Response($data);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }

    /**
     * @Route("/slidetemplate", name="slidetemplate")
     */
    public function slidetemplateAction()
    {
        $user = $this->getUser();
        if ($user == null) {
            $data = '{"user_signed_in":false}';
        } else {
            $data = '{"user_signed_in":true,"user":{"username":"'.$user.'"}}';
        }
        $response = new Response($data);
        $response->headers->set('Content-Type', 'json');
        $response->headers->set('Another-Header', 'header-value');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }
}
