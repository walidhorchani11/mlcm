<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\PresentationBundle\Entity\LinkedRef;
use ArgoMCMBuilder\PresentationBundle\Entity\Menu;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Entity\Survey;
use ArgoMCMBuilder\PresentationBundle\Objects\Flows;
use ArgoMCMBuilder\PresentationBundle\Objects\Screen;
use ArgoMCMBuilder\PresentationBundle\Repository\SliderRepository;
use Doctrine\ORM\EntityManager;
use JMS\Serializer\Serializer;
use Symfony\Component\DomCrawler\Crawler;
use ArgoMCMBuilder\PresentationBundle\Parser\simple_html_dom;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class MiDeepZipService.
 */
class MiDeepZipOldService
{
    private $entityManager;
    private $fileSystem;
    private $rendDirectory;
    private $framework;
    private $serializer;
    private $webDirectory;
    private $mediaDirectory;
    private $cssMerck;
    private $aPopin;
    private $thumbnails;
    private $idPres;
    private $idRev;
    /** @var Presentation $pres */
    private $pres;
    private $slides;
    private $glob;
    private $thumbDirectory;
    public $errors;

    //Fixme @Houssem : doit sortir dans un fichier css à inclure
    //Fixme @Houssem une ligne ne doit pas dépasser 12 caractère
    const STANDARD_CSS = '#boxReference li span.i,[data-ref] .title{font-style:italic}#menu .maxMenu a,#menu .subMenu 
    a{text-align:center;vertical-align:middle}#menu{position:absolute;width:1024px;height:65px;bottom:0;z-index:4;
    padding-left:12px}#menu .maxMenu,#menu .minMenu{bottom:0;z-index:1;position:absolute}#menu .maxMenu{width:800px;
    height:65px;left:50px;overflow:hidden}#layer,#menu .subMenu{left:0;position:absolute}#layer{border-radius: 0 5px 5px
     0;}#menu .minMenu{width:240px;height:70px;right:0}#menu .maxMenu a{height:65px;display:inline-block;padding:0 15px 
     0 10px;line-height:70px}#menu .subMenu.none{display:none!important}#menu .subMenu a{display:table-cell;
     cursor:pointer;height:25px;padding-left:10px;padding-right:0}#boxPopup,#boxPopup #scrollerPop 
     #textPopup{font-family:avantGardeBook}#menu .subMenu{top:-27px;width:auto;height:25px;z-index:0;
     line-height:25px;padding:0;font-size:14px;display:none;-webkit-transition:top .3s}#menu .subMenu.current
     {display:block !important;}#menu .subMenu.current.off{top:27px;-webkit-transition:top .3s}#menu .subMenu.show
     {display:block;opacity:1;-webkit-transition:opacity .3s}#menu .minMenu a,#menu .minMenu div{position:absolute;
     cursor:pointer;top:25px}[data-ref] .title{text-decoration:underline;font-weight:700}#menu .logo{position:absolute;
     width:90px;height:100%;top:3px;right:0;padding-top:3px;padding-right:10px;text-align:right; z-index:2;}#menu .logo 
     img{max-width:84%;vertical-align: middle;max-height: 100%;height: auto;position: absolute;margin: auto;left: 0;
     right: 0;top: 0;bottom: 0;}#boxRcp,#boxReference{background:center no-repeat #f5f5f5;width:566.5px;height:262px;
     position:absolute;right:10px;bottom:95px;box-sizing:border-box;z-index:1000;border-radius:10px}#boxRcp 
     .arrow-after,#boxReference .arrow-after{display:block;width:0;height:0;position:absolute;border-top:30px solid 
     #f5f5f5;border-bottom:0 solid transparent;border-left:15px solid transparent;border-right:15px solid transparent;
     background-color:transparent;bottom:-29px;right:90px}#boxRcp .arrow-after{right:127px}#boxReference #scrollerRef,
     #textRcp{padding:10px;position:absolute;left:200px;margin-left:-190px;overflow:hidden;text-align:left;color:
     #6a6a6a;word-wrap:break-word;width:100%;font-size:14.7px}#scroller div:nth-child(2)>div{background:#69A138
     !important}#boxReference li{padding-bottom:2px;letter-spacing:1}#boxReference li span.b{font-weight:700}#boxRcp 
     #boxRcpClose,#boxReference #boxReferenceClose{position:absolute;z-index:10000;
     background:url(theme/theme1/images/close_ref.png) center center no-repeat;top:10px;width:30px;text-align:center;
     right:10px;line-height:25px;height:30px;color:#fff;font-size:24px;cursor:pointer;background-size:60%}#boxReference 
     h3{border-bottom:1px solid;padding-bottom:13px;margin:10px 20px}#boxReference #textReference{padding-bottom:20px}
     #layer{width:100%;height:100%;background:rgba(0,0,0,.5);top:0;display:none;opacity:0}#layer[data-pop]{z-index:4}
     #layer[data-rcp],#layer[data-ref]{z-index:3}#boxPopup{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;
     cursor:pointer;background-repeat:no-repeat;background-position:center}#boxPopup .close{position:absolute;
     width:50px;height:50px;top:10px;right:10px;background:url(theme/theme1/images/close_ref.png) center center 
     no-repeat}#boxPopup #scrollerPop{position:relative;margin-top:50vh;transform:translateY(-50%);}#boxPopup 
     #scrollerPop #textPopup{}#menu,#menu .subMenu a{font-family:Montserrat!important;font-size:15px!important; 
     overflow:hidden!important}#menu a.current{background-repeat:no-repeat;background-position:center bottom; 
     background-size:100% auto}#scrollmenu{width:800px}#scrollmenu #scroller{width:1670px}.scrollmenu1{width:1024px}
     .scroller1{width:1300px}#menu a{color:#fff!important}#menu,#menu .subMenu{background-color:#4a5667!important}
     #menu a.current{color:#3e8787!important}#menu{display:block!important}.hide {display: none !important;}#menu 
     .subMenu.hide-menu, #menu.hide-menu,#menu .maxMenu.hide-menu{opacity:0;}#menu.hide-menu{z-index:-1;}#menu 
     .subMenu.hide-menu *, #menu.hide-menu *, #menu .maxMenu.hide-menu *{pointer-events:none;}#menu.hide-menu 
     .subMenu{pointer-events:all;} #boxPopup #textPopup section.popin {margin:auto;position:relative;
     display:block !important;}#menu:after{content:"";width:2px;display:block;background:rgba(0,0,0,0.2);
     position:absolute;top:5px;right:175px;border-radius:5px;-ms-border-radius:5px;-moz-border-radius:5px;
     -webkit-border-radius:5px;bottom:5px;box-shadow:0px 0px 5px 0px rgba(255,255,255,1);-ms-box-shadow:0px 0px 5px 0px 
     rgba(255,255,255,1);-moz-box-shadow:0px 0px 5px 0px rgba(255,255,255,1);-webkit-box-shadow:0px 0px 5px 0px 
     rgba(255,255,255,1)}em {font-style: italic !important;}strong {font-weight: bold !important;}#textReference 
     li p{display: block !important;margin: auto !important;}sup{vertical-align: super; position: relative; font-size: 
     75%;}';

    /**
     * MiDeepZipService constructor.
     *
     * @param EntityManager $entityManager
     * @param Filesystem    $fileSystem
     * @param string        $rendDirectory
     * @param string        $framework
     * @param Serializer    $serializer
     * @param string        $webDirectory
     * @param string        $mediaDirectory
     * @param string        $cssMerck
     * @param string        $thumbnails
     * @param string        $thumbDirectory
     */
    public function __construct(
        $entityManager,
        $fileSystem,
        $rendDirectory,
        $framework,
        $serializer,
        $webDirectory,
        $mediaDirectory,
        $cssMerck,
        $thumbnails,
        $thumbDirectory
    ) {
        $this->entityManager = $entityManager;
        $this->fileSystem = $fileSystem;
        $this->rendDirectory = $rendDirectory;
        $this->framework = $framework;
        $this->serializer = $serializer;
        $this->webDirectory = $webDirectory;
        $this->mediaDirectory = $mediaDirectory;
        $this->cssMerck = $cssMerck;
        $this->thumbnails = $thumbnails;
        $this->thumbDirectory = $thumbDirectory;

        return $this;
    }

    /**
     * @param string $thumbnailUrl
     *
     * @return bool
     */
    public function generateThumbnail($thumbnailUrl)
    {
        $fs = $this->fileSystem;
        $idRev = $this->idRev;
        try {
            if ($fs->exists("$thumbnailUrl")) {
                $fs->copy("$thumbnailUrl", "$this->rendDirectory/$idRev/media/images/thumbnails/200x150.jpg", true);
            }
        } catch (IOExceptionInterface $e) {
            //Fixme @Houssem cette exception se répète trop souvent tu peux la factorisé si tu aura changer le
            // wording ou traduire tu doit touché partout,
            //Fixme @Houssem fout géré avec les traductions
            $this->errors['generateThumbnail'] = "An error occurred while copying files or directories ... 
            (generateThumbnail())\n".$e->getPath();

            return $this->errors;
        }

        return true;
    }

    /**
     * @param int    $idRev
     * @param string $content
     *
     * @return array|string
     */
    public function generatePdfLink($idRev, $content)
    {
        $fs = $this->fileSystem;
        $dom = new \DomDocument();
        $dom->loadHTML('<?xml encoding="UTF-8">'.$content);
        $xpath = new \DOMXPath($dom);
        $pdfList = $xpath->query('//*[@data-pdf-link]');
        try {
            /** @var \DOMElement $pdf */
            foreach ($pdfList as $pdf) {
                $urlPdf = $pdf->getAttribute('data-pdf-link');
                $pdfTab = explode('/', $urlPdf);
                $urlHttp = explode('/uploads/', $urlPdf);
                $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                $nameOrigPdf = $pdfTab[count($pdfTab) - 1];
                $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/media/pdf/$nameOrigPdf");
                $pdf->removeAttribute('data-pdf-link');
                $pdf->setAttribute('data-pdf', $nameOrigPdf);
            }
        } catch (IOExceptionInterface $e) {
            $this->errors['generatePdfLink'] = "An error occurred while copy files $idRev/media/pdf/... 
            (generatePdfLink())\n".$e->getPath();

            return $this->errors;
        }

        return $dom->saveHTML();
    }

    /**
     * @param \DOMElement $video
     * @param Filesystem  $fs
     * @param int         $idRev
     */
    public function generatePoster($video, $fs, $idRev)
    {
        $urlvideoposter = $video->getAttribute('data-video-poster');
        $videoautoplay = $video->getAttribute('data-video-autoplay');
        $posterAbsolutePath = '';
        if ($urlvideoposter !== '') {
            $videoposterTab = explode('/', $urlvideoposter);
            if (in_array('uploads', $videoposterTab) == true) {
                $urlposterHttp = explode('/uploads/', $urlvideoposter);
                $posterAbsolutePath = $this->mediaDirectory.$urlposterHttp[1];
            } elseif (in_array('img', $videoposterTab) == true) {
                $posterAbsolutePath = $this->webDirectory.$urlvideoposter;
            } elseif (in_array($this->thumbDirectory, $videoposterTab) == true) {
                $urlposterHttp = explode($this->thumbDirectory, $urlvideoposter);
                $posterAbsolutePath = "$this->thumbnails$urlposterHttp[1]";
            }
            if ($posterAbsolutePath !== '') {
                $posterVideo = $videoposterTab[count($videoposterTab) - 1];
                $fs->copy($posterAbsolutePath, "$this->rendDirectory/$idRev/media/video/$posterVideo");
                $video->setAttribute('data-video-poster', "media/video/$posterVideo");
                $video->firstChild->firstChild->setAttribute('poster', "media/video/$posterVideo");
            }
        }
        if ($videoautoplay === 'true') {
            $video->firstChild->firstChild->setAttribute('autoplay', true);
        }
    }

    /**
     * @param int    $idRev
     * @param string $content
     *
     * @return array|string
     */
    public function generateVideoPopin($idRev, $content)
    {
        $fs = $this->fileSystem;
        $dom = new \DomDocument();
        $dom->loadHTML('<?xml encoding="UTF-8">'.$content);
        $xpath = new \DOMXPath($dom);
        $videoList = $xpath->query('//*[@data-video]');
        try {
            foreach ($videoList as $video) {
                /** @var \DOMElement $video */
                $urlvideo = $video->getAttribute('data-video');
                $videoTab = explode('/', $urlvideo);
                $urlHttp = explode('/uploads/', $urlvideo);
                $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                $nameOrigVideo = $videoTab[count($videoTab) - 1];
                $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/media/video/$nameOrigVideo");
                $video->setAttribute('data-video', "media/video/$nameOrigVideo");
                $video->firstChild->firstChild->setAttribute('controls', 'controls');
                $video->firstChild->firstChild->firstChild->setAttribute('src', "media/video/$nameOrigVideo");
                $this->generatePoster($video, $fs, $idRev);
            }
        } catch (IOExceptionInterface $e) {
            // for debug uncomment $e->getPath()
            $this->errors['generateVideoPopin'] = "An error occurred while copying files ... (generateVideoPopin())\n"
                .$e->getPath();

            return $this->errors;
        }

        return $dom->saveHTML();
    }

    /**
     * @param string $content
     *
     * @return array|string
     */
    public function generateAnimationPopin($content)
    {
        $dom = new \DomDocument();
        $dom->loadHTML('<?xml encoding="UTF-8">'.$content);
        $xpath = new \DOMXPath($dom);
        $animationList = $xpath->query("//*[contains(@data-block-anim, 'tap')]");
        try {
            foreach ($animationList as $elt) {
                $valueAnimation = $elt->firstChild->firstChild->getAttribute('data-animation-type');
                $valueAnimation .= '-tap';
                $elt->firstChild->firstChild->removeAttribute('data-animation-type');
                $elt->firstChild->firstChild->setAttribute('data-animation-type-tap', $valueAnimation);
            }
        } catch (IOExceptionInterface $e) {
            // for debug uncomment $e->getPath()
            $this->errors['generateAnimationPopin'] = "An error occurred while generate animation in popin ... 
            (generateAnimationPopin())\n".$e->getPath();

            return $this->errors;
        }

        return $dom->saveHTML();
    }

    /**
     * @param string $str
     * @param bool   $lowercase
     * @param bool   $forceTagsClosed
     * @param string $targetCharset
     * @param bool   $stripRN
     * @param string $defaultBRText
     * @param string $defaultSpanText
     *
     * @return simple_html_dom|bool
     */
    public function strGetHtml(
        $str,
        $lowercase = true,
        $forceTagsClosed = true,
        $targetCharset = 'UTF-8',
        $stripRN = true,
        $defaultBRText = "\r\n",
        $defaultSpanText = ' '
    ) {
        $dom = new simple_html_dom(
            null,
            $lowercase,
            $forceTagsClosed,
            $targetCharset,
            $stripRN,
            $defaultBRText,
            $defaultSpanText
        );
        if (empty($str)) {
            $dom->clear();

            return $this->errors;
        }
        $dom->load($str, $lowercase, $stripRN);

        return $dom;
    }

    /**
     * @param string $html
     * @param string $popins
     * @param int    $idRev
     *
     * @return array
     */
    public function getLinkedPopin($html, $popins, $idRev)
    {
        $contents = $this->strGetHtml($html);
        $objPopins = array();
        foreach ($contents->find('#linkedpopin') as $elt) {
            $class = $elt->class;
            $start = explode(' ', $class);
            $oPopin = array();
            if (isset($start[1])) {
                $contentPop = $this->strGetHtml($popins);
                if (is_object($contentPop)) {
                    if ($contentPop->find('.'.$start[1])) {
                        $oPopin['popin-name'] = $contentPop->find('.'.$start[1])[0]->attr['data-popin-name'];
                        $oPopin['name'] = $start[1];
                        $pdfInPopin = $contentPop->find('.'.$start[1])[0]->outertext;
                        $oPopin['content'] = $this->generatePdfLink($idRev, $pdfInPopin);

                        if (!in_array($oPopin, $objPopins)) {
                            array_push($objPopins, $oPopin);
                        }
                    }
                }
            }
        }

        return $objPopins;
    }

    /**
     * @param \DOMDocument $document
     * @param string       $html
     * @param int          $idRev
     * @param string       $screenId
     * @param null         $popin
     *
     * @return array|string
     */
    public function backgroundImg($document, $html, $idRev, $screenId, $popin = null)
    {
        if (null == $popin) {
            $popin = 'slide';
        }
        $fs = $this->fileSystem;
        $document->loadHTML($html);
        $section = $document->getElementsByTagName('section')->item(0);
        $style = $section->getAttribute('style');

        $items = explode(';', $style);

        try {
            foreach ($items as $item) {
                if (strpos($item, 'background-image:') && 'none' != substr($item, -4)) {
                    $start = strpos($style, 'background-image:');
                    $sub1 = substr($style, $start);
                    $pos3 = strpos($sub1, ';');
                    $bgImg = substr($sub1, 0, $pos3);
                    $style = str_replace($bgImg.';', '', $style);

                    $tempUrl = explode('(', $item);
                    $url = substr($tempUrl[1], 0, -1);
                    $url = str_replace('"', '', $url);
                    $urlHttp = explode('/uploads/', $url);
                    $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                    $extension = substr($url, -4);
                    $fs->copy(
                        $pathAbsolute,
                        "$this->rendDirectory/$idRev/screen/$screenId/images/$popin-screen-bg-img$extension"
                    );
                    $style = $style.' background-image: url("screen/'.$screenId.'/images/'.$popin.'-screen-bg-img'.
                        $extension.'");';
                    $section->setAttribute('style', $style);
                    break;
                }
            }
        } catch (IOExceptionInterface $e) {
            $this->errors['backgroundImg'] = "An error occurred while copying files ... (backgroundImg())\n"
                .$e->getPath();

            return $this->errors;
        }

        return $document->saveHTML();
    }

    /**
     * @param array $slides
     *
     * @return array
     */
    public function getScreensIds($slides)
    {
        $screensIds = array();
        for ($i = 0; $i < count($slides); ++$i) {
            $slide = $slides[$i];
            $screenId = $slide->getAssetId();

            if ('' == $screenId) {
                $screenId = 'S1_'.(($i + 1) * 10);
            }
            $screensIds[] = $screenId;
        }

        return $screensIds;
    }

    /**
     * @param \DOMDocument $document
     * @param string       $html
     * @param int          $idRev
     * @param string       $screenId
     * @param null         $popin
     *
     * @return array
     */
    public function downloadImgBalise($document, $html, $idRev, $screenId, $popin = null)
    {
        if (null == $popin) {
            $popin = 'slide';
        }
        $output = array();
        $fs = $this->fileSystem;
        $document->loadHTML('<?xml encoding="UTF-8">'.$html);
        $images = $document->getElementsByTagName('img');
        $i = 0;
        foreach ($images as $node) {
            /** @var \DOMElement $node */
            $url = $node->getAttribute('src');
            $urlHttp = explode('/uploads/', $url);
            $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
            try {
                $url = $node->getAttribute('src');
                $extension = substr($url, -3);
                $fs->copy(
                    $pathAbsolute,
                    "$this->rendDirectory/$idRev/screen/$screenId/images/$popin-img-$i.$extension"
                );
                $node->setAttribute('src', "screen/$screenId/images/$popin-img-$i.$extension");
                ++$i;
            } catch (IOExceptionInterface $e) {
                $this->errors['downloadImgBalise'] = "An error occurred while copying files or directories ... 
                (downloadImgBalise())\n".$e->getPath();

                return $this->errors;
            }
        }
        $output['html'] = $document->saveHTML();

        return $output;
    }

    /**
     * @param \DOMDocument $document
     * @param string       $html
     * @param int          $idRev
     * @param string       $screenId
     *
     * @return array
     */
    public function downloadImgMenu($document, $html, $idRev, $screenId)
    {
        $output = array();
        $fs = $this->fileSystem;
        $document->loadHTML('<?xml encoding="UTF-8">'.$html);
        $images = $document->getElementsByTagName('img');
        $i = 0;
        foreach ($images as $node) {
            /** @var \DOMElement $node */
            $url = $node->getAttribute('src');
            $urlHttp = explode('/uploads/', $url);
            $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
            try {
                $url = $node->getAttribute('src');
                $extension = substr($url, -3);
                $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/screen/$screenId/images/img-$i.$extension");
                $node->setAttribute('src', "screen/$screenId/images/img-$i.$extension");
                ++$i;
            } catch (IOExceptionInterface $e) {
                $this['downloadImgMenu'] = "An error occurred while copying files or directories ... 
                (downloadImgMenu())\n".$e->getPath();

                return $this->errors;
            }
        }
        $output['html'] = $document->saveHTML();

        return $output;
    }

    /**
     * @param string $html
     * @param string $parameters
     *
     * @return array
     */
    public function generateFramework($html, $parameters)
    {
        $idRev = $this->idRev;
        $popupBgClose = '';
        $popupBgOverlay = '';
        $popupOverlayOpacity = '';
        $refBgImg = '';
        $refBgColor = '';
        $refWidth = '';
        $refHeight = '';
        $refColor = '';
        $refFontStyle = '';
        $refSizeStyle = '';
        $refTitle = '';
        $refBodyStyle = '';
        $fontsExist = '';
        $params = array();

        $fs = $this->fileSystem;
        try {
            if (!$fs->exists("$this->rendDirectory/$idRev")) {
                $fs->mkdir("$this->rendDirectory/$idRev");
            } else {
                $fs->remove(array("$this->rendDirectory/$idRev"));
            }
            $fs->mirror("$this->framework", "$this->rendDirectory/$idRev");
        } catch (IOExceptionInterface $e) {
            $this->errors['generateFramework'] = "An error occurred while creating or removing $idRev directory 
            (generateFramework())\n".$e->getPath();

            return $this->errors;
        }

        $contentsParameters = $this->strGetHtml($parameters);
        /** @var \DOMElement $styleParameters */
        $styleParameters = $contentsParameters->find('#params_clm_edidtor')[0];

        if (null != $styleParameters->getAttribute('data-popup-width')) {
            $popupWidth = 'width: '.$styleParameters->getAttribute('data-popup-width').' !important;';
        }

        if (null != $styleParameters->getAttribute('data-popup-height')) {
            $popupHeight = 'height: '.$styleParameters->getAttribute('data-popup-height').' !important;';
        }

        if (null != $styleParameters->getAttribute('data-bg-popup-color')) {
            $popupBgColor = 'background-color: '.$styleParameters->getAttribute('data-bg-popup-color').' !important;';
        }

        if ($styleParameters->getAttribute('data-allow-submenu') != '') {
            if ($styleParameters->getAttribute('data-allow-submenu') == 'false') {
                $enableSubMenu = 'hide-menu';
                $params['enable'] = $enableSubMenu;
            }
        }
        if ($styleParameters->getAttribute('data-allow-submenuwidth') != '') {
            if ($styleParameters->getAttribute('data-allow-submenuwidth') == 'true') {
                $params['enableSubMenuWidth'] = 'fullWidthSubmenu';
            }
        }

        if (null != $styleParameters->getAttribute('data-menu-font-title-ref')) {
            $refFontStyle = 'font-family: '.$styleParameters->getAttribute('data-menu-font-title-ref').' !important;';
        }

        if (null != $styleParameters->getAttribute('data-font-size-title-ref')) {
            $refSizeStyle = 'font-size: '.$styleParameters->getAttribute('data-font-size-title-ref').'px !important;';
        }

        if (null != $styleParameters->getAttribute('data-font-size-ref-content')) {
            $refBodyStyle = 'font-size: '.$styleParameters->getAttribute('data-font-size-ref-content').'px !important;';
        }

        if (null != $styleParameters->getAttribute('data-title-ref-content')) {
            $refTitle = $styleParameters->getAttribute('data-title-ref-content');
        }

        if (null != $styleParameters->getAttribute('data-font-url-exist')) {
            $fontsExist = $styleParameters->getAttribute('data-font-url-exist');
        }

        if (null != $styleParameters->getAttribute('data-bg-popup-img')) {
            $popupBgImg = 'background-image: url("'.$styleParameters->getAttribute('data-bg-popup-img').'") 
            !important;background-size: contain !important;';
        }

        if (null != $styleParameters->getAttribute('data-bg-btn-close')) {
            $urlBgClose = $styleParameters->getAttribute('data-bg-btn-close');
            $closeTab = explode('/', $urlBgClose);
            $urlHttp = explode('/uploads/', $urlBgClose);
            $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
            $nameBgClose = $closeTab[count($closeTab) - 1];
            try {
                $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/theme/theme1/images/$nameBgClose");
            } catch (IOExceptionInterface $e) {
                $this->errors['generateFramework'] = "An error occurred while copying into theme1/images/$nameBgClose 
                ... (generateFramework())\n".$e->getPath();

                return $this->errors;
            }
            $popupBgClose = 'background-image: url(theme/theme1/images/'.$nameBgClose.') !important;background-size: 
            contain !important;';
        }
        if (null != $styleParameters->getAttribute('data-logo-pres-url')) {
            $urlLogo = $styleParameters->getAttribute('data-logo-pres-url');
            $logoTab = explode('/', $urlLogo);
            $urlHttp = explode('/uploads/', $urlLogo);
            $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
            $nameLogo = $logoTab[count($logoTab) - 1];
            try {
                $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/theme/theme1/images/$nameLogo");
                $params['logo'] = "theme/theme1/images/$nameLogo";
            } catch (IOExceptionInterface $e) {
                $this->errors['generateFramework'] = "An error occurred while copying into theme1/images/$nameLogo ... 
                (generateFramework())\n".$e->getPath();

                return $this->errors;
            }
        }

        if (null != $styleParameters->getAttribute('data-bg-ref-overlaycolor')) {
            $popupBgOverlay = 'background-color: '.$styleParameters->getAttribute('data-bg-ref-overlaycolor');
        }

        if (null != $styleParameters->getAttribute('data-overlay-ref-opacity')) {
            $popupOverlayOpacity = 'opacity: '.$styleParameters->getAttribute('data-overlay-ref-opacity');
        }

        if (null != $styleParameters->getAttribute('data-bg-ref-img')) {
            $urlBgRef = $styleParameters->getAttribute('data-bg-ref-img');
            $refTab = explode('/', $urlBgRef);
            $urlHttp = explode('/uploads/', $urlBgRef);
            $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
            $nameBgRef = $refTab[count($refTab) - 1];
            try {
                $refBgImg = 'background-image: url("'."media/images/$nameBgRef".'") !important;background-size: 
                contain !important;';
                $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/media/images/$nameBgRef");
            } catch (IOExceptionInterface $e) {
                $this->errors['generateFramework'] = "An error occurred while copying into media/images/$nameBgRef ... 
                (generateFramework())\n".$e->getPath();

                return $this->errors;
            }
        }

        if (null != $styleParameters->getAttribute('data-bg-ref-color')) {
            $refBgColor = 'background-color: '.$styleParameters->getAttribute('data-bg-ref-color').' !important;';
        }

        if (null != $styleParameters->getAttribute('data-ref-width')) {
            $refWidth = 'width: '.$styleParameters->getAttribute('data-ref-width').' !important;';
        }

        if (null != $styleParameters->getAttribute('data-ref-height')) {
            $refHeight = 'height: '.$styleParameters->getAttribute('data-ref-height').' !important;';
        }

        if (null != $styleParameters->getAttribute('data-text-ref-color')) {
            $refColor = 'color: '.$styleParameters->getAttribute('data-text-ref-color').' !important;';
        }

        $refTitleStyle = "style='".$refColor.$refFontStyle.$refSizeStyle."'";
        $styleRef = "style='".$refWidth.$refHeight.$refBgColor.$refBgImg."'";
        $stylePopins = "style=''";
        $styleClose = "style='z-index: 999999999;$popupBgClose'";
        $styleRefText = "style='".$refColor.$refFontStyle.$refBodyStyle."'";

        $start = strpos($popupBgOverlay, '(');

        if ($start) {
            $rgb = substr($popupBgOverlay, $start + 1, -1); // après le "(" et avant le ")"
            $a = trim(
                explode(':', $popupOverlayOpacity)[1]
            ); // array:2 [0 => "opacity", 1 => " 0.5"] et trim pour supprimer l'espace avant 0.5
            $rgba = "rgba($rgb, $a);";
            $styleLayer = "style='".$rgba."'";
        } else {
            $styleLayer = "style='".$popupBgOverlay.$popupBgOverlay."'";
        }
        $styleClose = str_replace("..'", '', $styleClose); // il y a deux points à la fin de $styleClose
        $styleClose = str_replace("'", '"', $styleClose); // il faut rempalcer les ' par des "
        $structureRef = '<div id="layer" data-ref  '.$styleLayer.'>
                                <div id="boxReference" '.$styleRef.'>
                                    <h3 '.$refTitleStyle.'>'.$refTitle.'</h3>
                                   <div id="scrollerRef">
                                     <div><ul id="textReference" '.$styleRefText.'></ul></div>
                                   </div>
                                  <div id="boxReferenceClose" '.$styleClose.'></div>
                                    <span class="arrow-after"></span>
                                </div>
                            </div>';

        $structurePopin = '<div id="layer" data-pop data-prevent-tap="true" '.$styleLayer.' class ="reveal">
                            <div id="boxPopup" '.$stylePopins.'>

                               <div class="close hide" '.$styleClose.'></div>
                               <div id="scrollerPop">
                                 <div>
                                     <div id="textPopup"></div>
                                  </div>
                               </div>
                            </div>
                        </div>';
        $defaultFonts = array(
            '/fonts/opensans-regular-webfont/opensans-regular-webfont.svg',
            '/fonts/Montserrat-Regular/Montserrat-Regular.svg',
        );
        if ('' != $fontsExist) {
            $existFonts = explode(',', $fontsExist);
            try {
                foreach ($existFonts as $fonts) {
                    $fonts = explode('/fonts/', $fonts);
                    $fonts = explode('/', $fonts[1]);

                    if (!in_array($fonts, $defaultFonts)) {
                        $fs->mirror("$this->webDirectory/fonts/$fonts[0]", "$this->rendDirectory/$idRev/fonts");
                    }
                }
            } catch (IOExceptionInterface $e) {
                $this->errors['generateFramework'] = "An error occurred while copying files ... (generateFramework())\n"
                    .$e->getPath();

                return $this->errors;
            }
        }

        try {
            $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/reference/reference.html", $structureRef);
            $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/popup/popup.html", $structurePopin);
            $fs->dumpFile("$this->rendDirectory/$idRev/index.html", $html);
        } catch (IOExceptionInterface $e) {
            $this->errors['generateFramework'] = "An error occurred while copying ... (generateFramework())\n"
                .$e->getPath();

            return $this->errors;
        }

        return $params;
    }

    /**
     * @param int    $idRev
     * @param string $screenId
     *
     * @return array|bool
     */
    public function createFiles($idRev, $screenId)
    {
        $fs = $this->fileSystem;
        try {
            $fs->mkdir("$this->rendDirectory/$idRev/screen/$screenId");
            $fs->mkdir("$this->rendDirectory/$idRev/screen/$screenId/images");
            $fs->mkdir("$this->rendDirectory/$idRev/screen/$screenId/popup");
            $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/index.html");
            $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/main.css");
            $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/main.js");
            $contentJS = '$(".slides section").removeClass();$(".slides section").addClass("present");';
            $fs->dumpFile("$this->rendDirectory/$idRev/screen/$screenId/main.js", $contentJS);
        } catch (IOExceptionInterface $e) {
            $this->errors['createFiles'] = "An error occurred while creating files or directories ... (createFiles())\n"
                .$e->getPath();

            return $this->errors;
        }

        return true;
    }

    /**
     * @param string $popins
     *
     * @return \DOMNodeList
     */
    public function getPopins($popins)
    {
        libxml_use_internal_errors(true);  // Pour l'HTML 5
        $document = new \DOMDocument();
        libxml_clear_errors();  // Pour l'HTML 5
        $popins = utf8_decode($popins);
        $document->loadHTML($popins);
        $listPopins = $document->getElementsByTagName('section');

        return $listPopins;
    }

    /**
     * @param \DOMNode $element
     *
     * @return string
     */
    public function DOMouterHTML($element)
    {
        $innerHTML = '';

        $tmpDom = new \DOMDocument();
        $tmpDom->appendChild($tmpDom->importNode($element, true));
        $innerHTML .= trim($tmpDom->saveHTML());

        return $innerHTML;
    }

    /**
     * @param \DOMNode $element
     *
     * @return string
     */
    public function DOMinnerHTML($element)
    {
        $innerHTML = '';
        $children = $element->childNodes;
        foreach ($children as $child) {
            $tmpDom = new \DOMDocument();
            $tmpDom->appendChild($tmpDom->importNode($child, true));
            $innerHTML .= trim($tmpDom->saveHTML());
        }

        return $innerHTML;
    }

    /**
     * @param array            $slides
     * @param SliderRepository $sliderRep
     *
     * @return array
     */
    public function getScreensLabel($slides, $sliderRep)
    {
        $tabTitle = array();
        $tabSliders = array();
        for ($i = 0; $i < count($slides); ++$i) {
            $slide = $slides[$i];
            if (null == $slide->getParent()) {
                $tabSliders[] = $slide;
            }
        }
        for ($i = 0; $i < count($tabSliders); ++$i) {
            $slide = $tabSliders[$i];

            $nbScreen = $sliderRep->getNumberOfChildren($slide->getId());
            if ($nbScreen[1] > 0) {
                $tabTitle[] = 'S1_'.($i + 1) * 10;
                for ($l = 0; $l < $nbScreen[1]; ++$l) {
                    $tabTitle[] = 'S1_'.(($i + 1) * 10).'_'.($l + 1) * 10;
                }
            } else {
                $tabTitle[] = 'S1_'.($i + 1) * 10;
            }
        }

        return $tabTitle;
    }

    /**
     * @param string $popins
     *
     * @return array|bool
     */
    public function generateScreens($popins)
    {
        $idRev = $this->idRev;
        $slides = $this->slides;
        $fs = $this->fileSystem;
        $sliderRep = $this->entityManager->getRepository('PresentationBundle:Slider');
        $labels = $this->getScreensLabel($slides, $sliderRep);

        libxml_use_internal_errors(true);  // Pour l'HTML 5
        $document = new \DOMDocument();
        libxml_clear_errors();  // Pour l'HTML

        for ($i = 0; $i < count($slides); ++$i) {
            /** @var Slider $slide */
            $slide = $slides[$i];

            $screenId = $labels[$i];
            $this->createFiles($idRev, $screenId);

            $dom = new \DomDocument();
            $dom->loadHTML('<?xml encoding="UTF-8">'.$slide->getContent());

            $xpath = new \DOMXPath($dom);
            $section = $xpath->query("//*[contains(@data-block-anim, 'tap')]");
            $pdfList = $xpath->query('//*[@data-pdf-link]');
            $videoList = $xpath->query('//*[@data-video]');

            try {
                /** @var \DOMElement $pdf */
                foreach ($pdfList as $pdf) {
                    $urlPdf = $pdf->getAttribute('data-pdf-link');
                    $pdfTab = explode('/', $urlPdf);
                    $urlHttp = explode('/uploads/', $urlPdf);
                    $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                    $nameOrigPdf = $pdfTab[count($pdfTab) - 1];
                    $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/media/pdf/$nameOrigPdf");
                    $pdf->removeAttribute('data-pdf-link');
                    $pdf->setAttribute('data-pdf', $nameOrigPdf);
                }
            } catch (IOExceptionInterface $e) {
                $this->errors['generateScreens'] = "An error occurred while copying files ... (generateScreens())\n"
                    .$e->getPath();

                return $this->errors;
            }

            try {
                /** @var \DOMElement $video */
                foreach ($videoList as $video) {
                    $urlvideo = $video->getAttribute('data-video');
                    $videoTab = explode('/', $urlvideo);
                    $urlHttp = explode('/uploads/', $urlvideo);
                    $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                    $nameOrigVideo = $videoTab[count($videoTab) - 1];
                    $this->generatePoster($video, $fs, $idRev);
                    $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/media/video/$nameOrigVideo");
                    $video->setAttribute('data-video', "media/video/$nameOrigVideo");
                    $video->firstChild->firstChild->setAttribute('controls', 'controls');
                    $video->firstChild->firstChild->firstChild->setAttribute('src', "media/video/$nameOrigVideo");
                }
            } catch (IOExceptionInterface $e) {
                $this->errors['generateScreens'] = "An error occurred while copying files ... (generateScreens())\n"
                    .$e->getPath();

                return $this->errors;
            }

            foreach ($section as $elt) {
                $valueAnimation = $elt->firstChild->firstChild->getAttribute('data-animation-type');
                $valueAnimation .= '-tap';
                $elt->firstChild->firstChild->removeAttribute('data-animation-type');
                $elt->firstChild->firstChild->setAttribute('data-animation-type-tap', $valueAnimation);
            }
            $contentSlider = $dom->saveHTML();

            $output = $this->downloadImgBalise($document, $contentSlider, $idRev, $screenId);
            $html = $this->backgroundImg($document, $output['html'], $idRev, $screenId);
            if ($popins != '') {
                $aPopin = $this->getLinkedPopin($html, $popins, $idRev);

                if (count($aPopin) > 0) {
                    try {
                        $k = 0;
                        foreach ($aPopin as $item) {
                            libxml_use_internal_errors(true);  // Pour l'HTML 5
                            $doc = new \DOMDocument();
                            libxml_clear_errors();  // Pour l'HTML
                            $contentPop = $item['content'];
                            $copyImgPop = $this->downloadImgBalise($doc, $contentPop, $idRev, $screenId, "popin-$k");
                            $copyBgPop = $this->backgroundImg($doc, $copyImgPop['html'], $idRev, $screenId, "popin-$k");
                            $videoPop = $this->generateVideoPopin($idRev, $copyBgPop);
                            $animationPop = $this->generateAnimationPopin($videoPop);
                            $popName = $item['name'];
                            $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/popup/$popName.html");
                            $fs->dumpFile(
                                "$this->rendDirectory/$idRev/screen/$screenId/popup/$popName.html",
                                $videoPop
                            );
                            $this->aPopin[] = $item['popin-name'];
                            ++$k;
                        }
                    } catch (IOExceptionInterface $e) {
                        $this->errors['generateScreens'] = "An error occurred while copying files ... (generateScreens()
                        )\n".$e->getPath();

                        return $this->errors;
                    }
                }
            }
            $document->loadHTML($html);

            $crawler = new Crawler($document->saveHTML());
            $section = $crawler->filter('body');

            if (0 == $i) {
                $divOpen = '<div class="content main active" id="'.$screenId.'">';
            } else {
                $divOpen = '<div class="content main" id="'.$screenId.'">';
            }

            $divClose = '</div>';
            $html = '<div class="reveal"><div class="slides">'.$section->html().'</div></div>';
            $html = $divOpen.$html.$divClose;

            try {
                $fs->dumpFile("$this->rendDirectory/$idRev/screen/$screenId/index.html", $html);
            } catch (IOExceptionInterface $e) {
                $this->errors['generateScreens'] = "An error occurred while copying files ... (generateScreens())\n"
                    .$e->getPath();

                return $this->errors;
            }
        }

        return true;
    }

    /**
     * @param Presentation $pres
     * @param array        $slides
     *
     * @return array
     */
    public function generateFlowJs($pres, $slides)
    {
        $idRev = $this->idRev;
        $pdfParams = array();
        $pdfParams['pdfNbr'] = 0;
        $pdfParams['pdfName'] = '';

        $fs = $this->fileSystem;
        $sliderRep = $this->entityManager->getRepository('PresentationBundle:Slider');
        $labels = $this->getScreensLabel($slides, $sliderRep);
        $flows = new Flows();
        $animation = array(
            'theme' => 'theme1',
            'events' => 'touchstart',
            'easingSlideIn' => 'transition.fadeIn',
            'easingSlideOut' => 'transition.fadeOut',
            'easingRef' => 'transition.fadeIn',
            'easingPop' => 'transition.fadeIn',
        );

        $animation['rcp'] = '';
        $pdfList = $pres->getPdf()->toArray();

        $pdfName = '';
        /** @var Pdf $pdf */
        foreach ($pdfList as $pdf) {
            $url = parse_url($pdf->getUrl());
            $path = explode('/', $url['path']);
            $pdfName = $path[count($path) - 1];
            try {
                $fs->copy($pdf->getUrl(), "$this->rendDirectory/$idRev/media/pdf/$pdfName");
            } catch (IOExceptionInterface $e) {
                $this->errors['generateFlowJs'] = "An error occurred while copying files ... (generateFlowJs())\n"
                    .$e->getPath();

                return $this->errors;
            }
            $animation['rcp'] .= '<li data-pdf="'.$pdfName.'">'.$pdf->getTitle().'</li>';
        }

        if (1 === count($pdfList)) {
            $animation['rcp'] = '';
            $pdfParams['pdfNbr'] = 1;
            $pdfParams['pdfName'] = $pdfName;
        }

        $additionalText = $pres->getAdditionalText();

        $order = array("\r\n", "\n\n", "\n", "\r");
        $replace = '<br>';
        $additionalText = str_replace($order, $replace, $additionalText);

        $flows->push($animation);
        $e = 0;
        for ($i = 0; $i < count($slides); ++$i) {
            $slide = $slides[$i];
            $assetDesc = $slide->getAssetDescription();

            if ('' == $assetDesc) {
                $assetDesc = $labels[$i];
            }
            $assetId = $labels[$i];
            if (null == $slide->getParent()) {
                ++$e;
            }
            $listRef = '';

            /** @var LinkedRef $ref */
            foreach ($slide->getLinkedReferences() as $ref) {
                $listRef .= '<li>'.$ref->getCode().$ref->getDescription().'</li>';
            }
            if ('' != $additionalText) {
                $listRef .= '<li>'.$additionalText.'</li>';
            }
            $screen = new Screen($assetId, $assetDesc, $e, $listRef);

            $flows->push($screen);
        }

        $response = new Response($this->serializer->serialize($flows, 'json'));
        $response->headers->set('Content-Type', 'application/json');

        $flowsJs = $response->getContent();

        try {
            $fs->dumpFile("$this->rendDirectory/$idRev/js/framework/flows.js", "var flows = $flowsJs;");
        } catch (IOExceptionInterface $e) {
            $this->errors['generateFlowJs'] = "An error occurred while copying files ... (generateFlowJs())\n"
                .$e->getPath();

            return $this->errors;
        }

        return $pdfParams;
    }

    /**
     * @return bool|array
     */
    public function generateParametersXML()
    {
        $idRev = $this->idRev;
        $slides = $this->slides;
        $fs = $this->fileSystem;
        $sliderRep = $this->entityManager->getRepository('PresentationBundle:Slider');
        $labels = $this->getScreensLabel($slides, $sliderRep);
        $document = new \DOMDocument();
        $sequence = $document->createElement('Sequence');
        $names = $this->entityManager->getRepository('PresentationBundle:Revision')->getPresentation($idRev);
        $date = new \DateTime();
        $tamp = $date->getTimestamp();
        $name = $names['name'].'_'.$tamp.'_'.$names['version'];

        $sequence->setAttribute('Id', $name);
        $sequence->setAttribute('xmlns', 'urn:param-schema');

        $pages = $document->createElement('Pages');
        $e = 0;
        $checkQuestion = false;
        $questions = $document->createElement('Questions');
        for ($i = 0; $i < count($slides); ++$i) {
            /** @var Slider $slide */
            $slide = $slides[$i];

            $surveys = $slide->getSurvey();
            /** @var Survey $survey */
            foreach ($surveys as $survey) {
                $checkQuestion = true;
                $question = $document->createElement('Question');
                $question->setAttribute('id', $survey->getCode());
                $question->setAttribute('text', utf8_decode($survey->getQuestion()));
                $question->setAttribute('type', html_entity_decode($survey->getType()));
                $questions->appendChild($question);
            }

            $pageId = $labels[$i];
            if (false == empty($slide->getAssetDescription())) {
                $pageId = $slide->getAssetDescription();
            }
            if (null == $slide->getParent()) {
                ++$e;
            }
            $page = $document->createElement('Page');
            $page->setAttribute('pageid', $pageId);
            $pages->appendChild($page);
        } // end for

        if (!empty($this->aPopin)) {
            foreach (array_unique($this->aPopin) as $popin) {
                $page = $document->createElement('Page');
                $page->setAttribute('pageid', $popin);
                $pages->appendChild($page);
            }
        }

        if ($checkQuestion) {
            $callDialog = $document->createElement('CallDialog');
            $callDialog->appendChild($questions);
            $sequence->appendChild($callDialog);
        }
        $sequence->appendChild($pages);
        $document->appendChild($sequence);

        try {
            $fs->dumpFile(
                "$this->rendDirectory/$idRev/parameters/parameters.xml",
                $document->saveXML($document->documentElement)
            );
        } catch (IOExceptionInterface $e) {
            $this->errors['generateParametersXML'] = "An error occurred while copying files ... (generateParametersXML()
            )\n".$e->getPath();

            return $this->errors;
        }

        return true;
    }

    /**
     * @param \DOMDocument $document
     * @param string       $tagName
     * @param array        $attributes
     *
     * @return \DOMElement|bool
     */
    public function createElement(\DOMDocument $document, $tagName, array $attributes = null)
    {
        if (!is_string($tagName)) {
            $this->errors['createElement'] = "you mast a valid node name! not $tagName!! createElement()";

            return $this->errors;
        }

        $tag = $document->createElement($tagName);

        if (!empty($attributes)) {
            foreach ($attributes as $attr => $val) {
                $tag->setAttribute($attr, $val);
            }
        }

        return $tag;
    }

    /**
     * @param Slider $slide
     * @param string $type
     * @param string $dataChapter
     *
     * @return string
     */
    public function setScreenName($slide, $type, $dataChapter)
    {
        $result = array();
        $screenName = $slide->getScreenName();
        $chapterName = $slide->getChapterName();
        if ('' == $screenName) {
            $screenName = $type.$dataChapter;
        }
        $result['screenName'] = $screenName;
        $result['isChapterName'] = false;
        if ('Slide' == $type) {
            if ('' != $chapterName) {
                $result['screenName'] = $chapterName;
                $result['chapterName'] = $screenName;
                $result['isChapterName'] = true;
            }
        }

        return $result;
    }

    /**
     * Generate an array of arrays that contains the presentation's tree
     * for example [[s1], [s2, s2.1, s2.2], [s3], [s4]].
     *
     * @param array $slides
     *
     * @return array $tree
     */
    public function generateSlidesTree(array $slides)
    {
        $tree = array();
        $parentIdx = -1; // init the parent index
        for ($i = 0; $i < count($slides); ++$i) {
            /** @var Slider $slide */
            $slide = $slides[$i];
            if (null == $slide->getParent()) {
                $tree["$i"][] = $slide; // $tree associative array
                $parentIdx = $i;
            } else {
                $tree["$parentIdx"][] = $slide;
            }
        }

        return $tree;
    }

    /**
     * @param array $params
     * @param array $pdfParams
     *
     * @return array|bool
     */
    public function generateIndexTheme(array $params, array $pdfParams)
    {
        $slides = $this->slides;
        $idRev = $this->idRev;
        $fs = $this->fileSystem;
        $document = new \DOMDocument();
        $subPicto = $this->createElement($document, 'div', ['class' => 'subPicto', 'data-prevent-tap' => 'true']);
        $document->appendChild($subPicto);

        $maxMenu = $this->createElement($document, 'div', ['class' => 'maxMenu', 'data-prevent-tap' => 'true']);
        $scrollMenu = $this->createElement($document, 'div', ['id' => 'scrollmenu']);
        $scroller = $this->createElement($document, 'div', ['id' => 'scroller']);
        $maxMenu->appendChild($scrollMenu);
        $scrollMenu->appendChild($scroller);

        $document->appendChild($maxMenu);

        $tree = $this->generateSlidesTree($slides);

        $aHome = $this->createElement($document, 'a', ['class' => 'home', 'data-link' => '0', 'data-chapter' => '1']);
        $document->appendChild($aHome);

        $sliderRep = $this->entityManager->getRepository('PresentationBundle:Slider');
        $labels = $this->getScreensLabel($slides, $sliderRep);

        $dataLink = 0;    // data-link begin with 0
        $dataChapter = 1; // data-chapter begin with 1 see the <a class="home" ...></a>

        foreach (array_slice($tree, 1) as $idx => $slidesTab) {
            ++$dataLink;
            ++$dataChapter;
            $chapterName = '';

            $aMaxMenu = $this->createElement(
                $document,
                'a',
                ['data-link' => $dataLink.'', 'data-chapter' => $dataChapter.'']
            );
            $result = $this->setScreenName($slidesTab[0], 'Slide', $dataChapter);
            $screenName = $result['screenName'];
            if ($result['isChapterName'] == true) {
                $chapterName = $result['chapterName'];
            }
            $aMaxMenu->nodeValue = $screenName;
            $scroller->appendChild($aMaxMenu);

            if (empty($params['enable'])) {
                $params['enable'] = '';
            }
            if (empty($params['enableSubMenuWidth'])) {
                $params['enableSubMenuWidth'] = '';
            }

            $subMenu = $this->createElement(
                $document,
                'div',
                [
                    'class' => 'subMenu '.$params['enable'],
                    'data-chapter' => $dataChapter.'',
                    'data-prevent-tap' => 'true',
                ]
            );
            $scrollMenu1 = $this->createElement(
                $document,
                'div',
                ['class' => 'scrollmenu1'.' '.$params['enableSubMenuWidth']]
            );
            $scroller1 = $this->createElement($document, 'div', ['class' => 'scroller1']);
            $subMenu->appendChild($scrollMenu1);
            $scrollMenu1->appendChild($scroller1);

            if ($result['isChapterName'] == true) {
                $aSubMenu = $this->createElement(
                    $document,
                    'a',
                    ['data-link' => $dataLink.'', 'data-sub' => $labels[$dataLink]]
                );
                $aSubMenu->nodeValue = $chapterName;
                $scroller1->appendChild($aSubMenu);
                $document->appendChild($subMenu);
            }

            // if has sub slides
            if (count($slidesTab) > 1) {
                foreach (array_slice($slidesTab, 1) as $i => $slide) {
                    ++$dataLink;
                    $subScreenName = $this->setScreenName($slide, 'subSlide', $i + 1)['screenName'];
                    $aSubMenu = $this->createElement(
                        $document,
                        'a',
                        ['data-link' => $dataLink.'', 'data-sub' => $labels[$dataLink]]
                    );
                    $aSubMenu->nodeValue = $subScreenName;
                    $scroller1->appendChild($aSubMenu);
                    $document->appendChild($subMenu);
                }
            }
        }

        // set div#logo
        $logoDiv = $this->createElement(
            $document,
            'div',
            ['id' => 'logo', 'class' => 'logo', 'data-prevent-tap' => 'false']
        );
        if (!empty($params['logo'])) {
            $img = $this->createElement($document, 'img', ['src' => $params['logo']]);
            $logoDiv->appendChild($img);
        }
        $document->appendChild($logoDiv);

        // set div.minMenu
        $minMenu = $this->createElement($document, 'div', ['class' => 'minMenu', 'data-prevent-tap' => 'true']);
        $subMinMenu1 = $this->createElement($document, 'div', ['class' => 'ref show', 'data-prevent-tap' => 'true']);
        $minMenu->appendChild($subMinMenu1);
        // set div.showRcp
        $subMinMenu2 = $this->createElement(
            $document,
            'div',
            ['class' => 'doc menu-ml showRcp', 'data-prevent-tap' => 'true']
        );

        if (1 == $pdfParams['pdfNbr']) {
            $subMinMenu2->setAttribute('data-pdf', $pdfParams['pdfName']);
        }
        $minMenu->appendChild($subMinMenu2);
        $document->appendChild($minMenu);

        try {
            $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/index.html", $document->saveHTML());
        } catch (IOExceptionInterface $e) {
            // for debug uncomment $e->getPath()
            $this->errors['generateIndexTheme'] = "An error occurred while copying files ... (generateIndexTheme())\n"
                .$e->getPath();

            return $this->errors;
        }

        return true;
    }

    /**
     * @param Menu   $menu
     * @param string $currentUrl
     * @param string $parameters
     *
     * @return bool|array
     */
    public function generateCssTheme($menu, $currentUrl, $parameters)
    {
        $idRev = $this->idRev;
        $fs = $this->fileSystem;
        if (null != $menu) {
            $css = '';

            $cssMenu = $menu->getMenuColor();
            if (null != $cssMenu) {
                $cssSubMenu = '#menu .subMenu {'.$cssMenu.'} ';
                $cssMenu = '#menu {'.$cssMenu.'} ';
                $css = $cssMenu.$cssSubMenu;
            }

            $cssLink = $menu->getFontColor();
            if (null != $cssLink) {
                $cssLink = '#menu a {'.$cssLink.'} ';
                $css .= $cssLink;
            }

            $itemColor = $menu->getItemColor();
            if (null != $itemColor) {
                $itemColor = '#menu a.current {'.$itemColor.'} ';
                $css .= $itemColor;
            }

            $fonts = $menu->getFonts();
            if (null != $fonts) {
                $subFonts = '#menu .subMenu a {'.$fonts.'} ';
                $subFonts = str_replace('display: block;', '', $subFonts);
                $subFonts = str_replace('white-space: normal;', '', $subFonts);
                $fonts = '#menu {'.$fonts.'} ';
                $css .= $fonts.$subFonts;
            }

            $highlight = $menu->getHighlight();
            if ('highlight' == $highlight) {
                $highlight = '#menu a.current {background-image: url(theme/theme1/images/selected.png);}';
                $css .= $highlight;
            }

            if ('' != $css) {
                $css = str_replace([';', 'width: 782px !important;'], [' !important;', ''], $css);

                $matches = [];
                $int = preg_match('/#menu .subMenu {background-color: rgb((\w|\W)*) !important; display: block !important;}/', $css, $matches);
                if (1 == $int && !empty($matches)) {
                    $subMenu = str_replace('display: block !important;', 'display: block;', $matches[0]);
                    $css = str_replace($matches[0], $subMenu, $css); // 1 number of replacement
                }
                $css = self::STANDARD_CSS.''.$css;
            } else {
                $css = self::STANDARD_CSS;
            }

            $contentsParameters = $this->strGetHtml($parameters);
            /** @var \DOMElement $styleParameters */
            $styleParameters = $contentsParameters->find('#params_clm_edidtor')[0];
            if (null != $styleParameters->getAttribute('data-logo-home-url')) {
                $urlHome = $styleParameters->getAttribute('data-logo-home-url');
                $urlHttp = explode('/uploads/', $urlHome);
                $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                $extension = substr($urlHome, -3);
                try {
                    $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/theme/theme1/images/pictoHome.$extension");
                } catch (IOExceptionInterface $e) {
                    // for debug uncomment $e->getPath()
                    echo "An error occurred while copying files ... (generateCssTheme())\n".$e->getPath();

                    return $this->errors;
                }
                $stylePictoHomeCurrent = '#menu a.home.current{background-position:center center;
                background-image:url(theme/theme1/images/pictoHome.'.$extension.')!important;}';
                $stylePictoHome = '#menu a.home{width:50px;height:65px;background-repeat:no-repeat;background-position:
                center center;line-height:65px;display:block;background-size:30px 30px;position:absolute;left:0;
                background-image:url(theme/theme1/images/pictoHome.'.$extension.');}';
            } else {
                $stylePictoHome = '#menu a.home{width:50px;height:65px;background-repeat:no-repeat;background-position:
                center center;background-image:url(theme/theme1/images/picto-home.png);line-height:65px;display:block;
                background-size:28px auto;position:absolute;left:0;}';
                $stylePictoHomeCurrent = '#menu a.home.current{background-image:url(theme/theme1/images/picto-home-
                active.png)!important;background-position:center center}';
            }
            if (null != $styleParameters->getAttribute('data-logo-refrs-url')) {
                $urlRef = $styleParameters->getAttribute('data-logo-refrs-url');
                $urlHttp = explode('/uploads/', $urlRef);
                $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                $extension = substr($urlRef, -3);
                try {
                    $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/theme/theme1/images/pictoRef.$extension");
                } catch (IOExceptionInterface $e) {
                    $this->errors['generateCssTheme'] = "An error occurred while copying files ... (generateCssTheme())
                    \n".$e->getPath();

                    return $this->errors;
                }
                $stylePictoRef = '#menu .minMenu div.ref{height:30px;width:30px;left:115px;top:20px;
                background:url(theme/theme1/images/pictoRef.'.$extension.') center center no-repeat; 
                background-size: contain !important;}';
            } else {
                $stylePictoRef = '#menu .minMenu div.ref{height:19.5px;width:22px;background:url(theme/theme1/images/
                ic-doc.png) center center no-repeat;left:108px; background-size: contain !important;top:29px}';
            }

            if (null != $styleParameters->getAttribute('data-logo-rcp-url')) {
                $urlRcp = $styleParameters->getAttribute('data-logo-rcp-url');
                $urlHttp = explode('/uploads/', $urlRcp);
                $pathAbsolute = $this->mediaDirectory.$urlHttp[1];
                $extension = substr($urlRcp, -3);
                try {
                    $fs->copy($pathAbsolute, "$this->rendDirectory/$idRev/theme/theme1/images/pictoRcp.$extension");
                } catch (IOExceptionInterface $e) {
                    $this->errors['generateCssTheme'] = "An error occurred while copying files ... (generateCssTheme())
                    \n".$e->getPath();

                    return $this->errors;
                }
                $stylePictoRcp = '#menu .minMenu div.doc{height:30px;width:30px;left:77px;top:20px;background-size:
                contain !important;background:url(theme/theme1/images/pictoRcp.'.$extension.') center center no-repeat;}
                ';
            } else {
                $stylePictoRcp = '#menu .minMenu div.doc{height:22px;width:22px;background:url(theme/theme1/images/
                ic-ref.png) center center no-repeat;left:77px;top:29px;background-size:contain}';
            }
            $css .= $stylePictoHome.$stylePictoHomeCurrent.$stylePictoRef.$stylePictoRcp;
            $styleRefInMerck = '.sl-block .ref-container {opacity: 0;}';

            try {
                if (strpos($currentUrl, 'merck')) {
                    $fs->remove("$this->rendDirectory/$idRev/css/editor.css");
                    $fs->copy("$this->cssMerck/editor.css", "$this->rendDirectory/$idRev/css/editor.css");
                    $css .= $styleRefInMerck;
                }
            } catch (IOExceptionInterface $e) {
                $this->errors['generateCssTheme'] = "An error occurred while copying files  or removing... 
                (generateCssTheme())\n".$e->getPath();

                return $this->errors;
            }

            try {
                $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/main.css", $css);
            } catch (IOExceptionInterface $e) {
                $this->errors['generateCssTheme'] = "An error occurred while copying files ... (generateCssTheme())\n"
                    .$e->getPath();

                return $this->errors;
            }
        }

        return true;
    }

    /**
     * @return string
     */
    public function getZipName()
    {
        $em = $this->entityManager;
        $zipName = $em->getRepository('PresentationBundle:Presentation')->getZipName($this->idRev);
        if (empty($zipName)) {
            $this->glob = null;

            return $zipName = $this->idRev;
        }

        // to use when removing old zips, see the generateSharedResources() method
        $this->glob = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_*.zip';

        $currentDate = new \DateTime();
        $d = $currentDate->format('mdY');
        $zip = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_'.$d.'_'.$zipName['version'];

        return $zip;
    }

    /**
     * @param int          $idRev
     * @param string       $html
     * @param array        $slides
     * @param Menu         $menu
     * @param string       $popins
     * @param string       $parameters
     * @param string       $thumbnailUrl
     * @param Presentation $pres
     * @param string       $currentUrl
     *
     * @return bool|string
     */
    public function zip($idRev, $html, $slides, $menu, $popins, $parameters, $thumbnailUrl, $pres, $currentUrl)
    {
        $this->errors = array();
        $this->idPres = $pres->getId();
        $this->idRev = $idRev;
        $this->pres = $pres;
        $this->slides = $slides;

        $params = $this->generateFramework($html, $parameters);
        $this->generateThumbnail($thumbnailUrl);
        $this->generateScreens($popins);
        $pdfParams = $this->generateFlowJs($pres, $slides);
        $this->generateParametersXML();
        $this->generateIndexTheme($params, $pdfParams);
        $this->generateCssTheme($menu, $currentUrl, $parameters);

        $zipName = $this->getZipName();

        // delete old zips
        if (null != $this->glob) {
            $oldZips = glob($this->rendDirectory.'/'.$this->glob);
            if (!empty($oldZips)) {
                for ($i = 0; $i < count($oldZips); ++$i) {
                    if ($this->fileSystem->exists($oldZips[$i])) {
                        $this->fileSystem->remove($oldZips[$i]);
                    }
                }
            }
        }

        $cmd = "cd $this->rendDirectory/$idRev;";
        $cmd .= "test -f $zipName.zip && rm -rf $zipName.zip;";
        $cmd .= "cd $idRev;";
        $cmd .= "zip -r ../$zipName.zip ./*;";
        $cmd .= 'cd .. ;';
        $cmd .= "test -d $idRev && rm -rf $idRev;";

        exec($cmd, $output, $returnVar);
        $zip = array();
        $zip['name'] = "$zipName.zip";
        $zip['zipPath'] = "$this->rendDirectory/$zipName.zip";
        if (0 == $returnVar) {
            return $zip;
        }

        $this->errors['zip'] = [];
        $this->errors['zip']['return'] = "An error occurred while generating your zip ($returnVar)";
        $this->errors['zip']['output'] = "An error occurred while generating your zip ($output)";
        $this->errors['zip']['cmd'] = $cmd;

        return $this->errors;
    }
}
