<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Objects\Flows;
use ArgoMCMBuilder\PresentationBundle\Objects\Screen;
use Symfony\Component\DomCrawler\Crawler;
use ArgoMCMBuilder\PresentationBundle\Parser\simple_html_dom;

class VeevaDeepZipService
{
    private $entityManager;
    private $fileSystem;
    private $rendDirectory;
    private $framework;
    private $serializer;
    private $webDirectory;
    private $thumbDirectory;

    const STANDARD_CSS = '#boxReference li span.i,[data-ref] .title{font-style:italic}#menu .maxMenu a,#menu .subMenu a{text-align:center;vertical-align:middle}#menu{position:absolute;width:1024px;height:55px;bottom:0;z-index:4;padding-left:12px}#menu .maxMenu,#menu .minMenu{bottom:0;z-index:1;position:absolute}#menu .maxMenu{width:630px;height:54px;left:50px;overflow:hidden}#menu .minMenu{width:240px;height:60px;right:0}#menu .maxMenu a{height:54px;display:inline-block;padding:0 12px;line-height:55px}#menu a.home{width:28px;height:55px;background-repeat:no-repeat;background-position:center center;background-image:url(theme/theme1/images/picto-home.png);line-height:55px;display:block;background-size:contain}#menu .subMenu.none{display:none!important}#menu .subMenu a{display:table-cell;cursor:pointer;height:25px;width:151px;font-family:insignia}#boxPopup,#boxPopup #scroller #textPopup{font-family:avantGardeBook}#menu .subMenu{background-color:#4a5667;position:absolute;left:0;top:-25px;width:auto;height:25px;z-index:0;line-height:25px;padding:0 25px 0 0;font-size:14px;display:none;-webkit-transition:top .3s}#menu .subMenu.current{display:block}#menu .subMenu.current.off{top:27px;-webkit-transition:top .3s}#menu .subMenu.show{display:block;opacity:1;-webkit-transition:opacity .3s}#menu .minMenu a,#menu .minMenu div{position:absolute;cursor:pointer;top:25px}#menu .minMenu div.ref{height:19.5px;width:16.5px;background:url(theme/theme1/images/ic-doc.png) center center/16.5px 19.5px no-repeat;left:120px}#menu .minMenu div.doc{height:22px;width:22px;background:url(theme/theme1/images/ic-ref.png) center center no-repeat;left:77px;top:25px;background-size:contain}[data-ref] .title{text-decoration:underline;font-weight:700}#menu .logo{position:absolute;width:90px;height:50px;top:3px;right:0;padding-top:3px;padding-right:10px;text-align:right}#menu .logo img{max-width:100%;vertical-align:middle;max-height:100%;height:auto}#boxReference{background:#f5f5f5;width:566.5px;height:262px;position:absolute;right:10px;bottom:95px;box-sizing:border-box;z-index:1000;border-radius:10px}#boxReference .arrow-after{display:block;width:0;height:0;position:absolute;border-top:30px solid #f5f5f5;border-bottom:0 solid transparent;border-left:15px solid transparent;border-right:15px solid transparent;background-color:transparent;bottom:-29px;right:90px}#boxReference #scrollerRef{width:517px;height:145px;position:absolute;top:80px;left:219px;margin-left:-190px;overflow:hidden;text-align:left;color:#6a6a6a;font-size:14.7px}#scroller div:nth-child(2)>div{background:#69A138!important}#boxReference li{padding-bottom:2px;letter-spacing:1}#boxReference li span.b{font-weight:700}#boxReference #boxReferenceClose{position:absolute;z-index:10000;background:url(theme/theme1/images/close_ref.png) center center no-repeat;top:10px;width:30px;text-align:center;right:10px;line-height:25px;height:30px;border-radius:50%;color:#fff;font-size:24px;cursor:pointer;background-size:60%}#boxReference h3{border-bottom:1px solid;padding-bottom:13px;margin:10px 20px}#layer{width:100%;height:100%;background:rgba(0,0,0,.5);position:absolute;top:0;left:0;display:none;opacity:0}#layer[data-pop]{z-index:2}#layer[data-ref]{z-index:3}#boxPopup{position:absolute;width:853px;height:601px;left:50%;top:51px;margin-left:-426.5px;box-sizing:border-box;z-index:999;cursor:pointer}#boxPopup .close{position:absolute;width:50px;height:50px;top:10px;right:10px;background:url(theme/theme1/images/close_ref.png) center center no-repeat}#boxPopup #scroller{position:absolute;width:824px;height:530px;padding:20px;box-sizing:border-box;top:54px;left:16px;margin-bottom:50px}#boxPopup #scroller #textPopup{padding-bottom:50px;color:#000;font-size:20.15px}#menu a.current{background-repeat:no-repeat;background-position:center bottom;background-size:100% auto}#menu a.home.current{background-image:url(theme/theme1/images/picto-home-active.png)!important;background-position:center center}#menu a{color:#fff!important}#scrollmenu{width:630px}#scrollmenu #scroller{width:1670px}.scrollmenu1{width:500px}.scroller1{width:1300px}#menu{background-color:#4a5667!important;display:block!important;font-family:Montserrat!important;font-size:15px!important;overflow:hidden!important}#menu a.current{color:#3e8787!important}';

    public function __construct(
        $entityManager,
        $fileSystem,
        $rendDirectory,
        $framework,
        $serializer,
        $webDirectory,
        $thumbDirectory
    ) {
        $this->entityManager = $entityManager;
        $this->fileSystem = $fileSystem;
        $this->rendDirectory = $rendDirectory;
        $this->framework = $framework;
        $this->serializer = $serializer;
        $this->webDirectory = $webDirectory;
        $this->thumbDirectory = $thumbDirectory;

        return $this;
    }

    public function generateIndexVeeva($idRev)
    {
        $fs = $this->fileSystem;
        $fs->copy("$this->rendDirectory/$idRev/index.html", "$this->rendDirectory/$idRev/$idRev.html");

        $fs->remove(array("$this->rendDirectory/$idRev/index.html"));
    }

    public function generateVeevaThumbnails($idPres, $idRev, $veevaThumbnailUrl, $veevaFullThumbnail)
    {
        $fs = $this->fileSystem;

        if ($fs->exists("$this->webDirectory/$veevaFullThumbnail")) {
            $image = "$this->webDirectory/$veevaFullThumbnail";

            $cmd = "cd $this->webDirectory &&";
            $cmd .= "convert $image -crop  0x0+50-50 $image &&";
            $cmd .= "convert $image -crop  0x0-50 $image && ";
            $cmd .= "convert $image -rotate 180 $image && ";
            $cmd .= "convert $image -crop  0x0+0-50 $image && ";
            $cmd .= "convert $image -rotate 180 $image && ";
            $cmd .= "convert $image -resize 1024x768! $image";

            exec($cmd, $output, $returnVar);

            if (0 == $returnVar) {
                $fs->copy($image, "$this->rendDirectory/$idRev/$idRev-full.png", true);

                $cmd2 = "cd $this->webDirectory && ";
                $cmd2 .= "convert $image -resize 200x150! $this->thumbDirectory/$idPres-$idRev/thumb.png; ";

                exec($cmd2, $output2, $returnVar2);

                if (0 == $returnVar2) {
                    $fs->copy(
                        "$this->thumbDirectory/$idPres-$idRev/thumb.png",
                        "$this->rendDirectory/$idRev/$idRev-thumb.png",
                        true
                    );

                    $cmd3 = "rm -f $this->thumbDirectory/$idPres-$idRev/thumb.png";
                    exec($cmd3);
                }
            }
        }
    }

    public function str_get_html(
        $str,
        $lowercase = true,
        $forceTagsClosed = true,
        $target_charset = 'UTF-8',
        $stripRN = true,
        $defaultBRText = "\r\n",
        $defaultSpanText = ' '
    ) {
        $dom = new simple_html_dom(
            null,
            $lowercase,
            $forceTagsClosed,
            $target_charset,
            $stripRN,
            $defaultBRText,
            $defaultSpanText
        );
        if (empty($str) || strlen($str) > 600000) {
            $dom->clear();

            return false;
        }
        $dom->load($str, $lowercase, $stripRN);

        return $dom;
    }

    public function getLinkedPopin($document, $html, $popinId)
    {
        $document->loadHTML($html);
        $contents = $this->str_get_html($html);
        foreach ($contents->find('#list-pop') as $elt) {
            $popupName = $elt->getAttribute('data-popup');
            $class = $elt->class;
            $start = explode(' ', $class);
            if (isset($start[0])) {
                if ($start[0] == $popinId) {
                    return $popupName;
                }
            }
        }

        return null;
    }

    public function backgroundImg($document, $html, $idRev, $screenId)
    {
        $fs = $this->fileSystem;
        $document->loadHTML($html);

        $section = $document->getElementsByTagName('section')->item(0);
        $style = $section->getAttribute('style');

        $items = explode(';', $style);

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
                $extension = substr($url, -4);
                $fs->copy($url, "$this->rendDirectory/$idRev/screen/$screenId/images/screen-bg-img$extension");
                $style = $style.' background-image: url("screen/'.$screenId.'/images/screen-bg-img'.$extension.'");';
                $section->setAttribute('style', $style);
                break;
            }
        }

        return $document->saveHTML();
    }

    public function localImgSrc($nodes, $idRev, $screensIds)
    {
        $fs = $this->fileSystem;

        $i = 0;
        foreach ($nodes as $node) {
            $r = rand(1, 20);
            $url = $node->getAttribute('src');
            $extension = substr($url, -3);
            $fs->copy($url, "$this->rendDirectory/$idRev/screen/$screensIds[$i]/images/img-$r.$extension");
            $node->setAttribute('src', "screen/$screensIds[$i]/images/img-$r.$extension");
            ++$i;
        }
    }

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

    public function downloadImgBalise($document, $html, $idRev, $screenId)
    {
        $output = array();
        $output['logo'] = false;

        $fs = $this->fileSystem;
        $document->loadHTML($html);

        $images = $document->getElementsByTagName('img');

        $i = 0;
        foreach ($images as $node) {
            $classParent = $node->parentNode->getAttribute('class');

            $url = $node->getAttribute('src');
            $extension = substr($url, -3);

            if (filter_var($url, FILTER_VALIDATE_URL)) {
                if ('logoEADV' == $classParent) {
                    $fs->copy($url, "$this->rendDirectory/$idRev/theme/theme1/images/logo.$extension");
                    $node->setAttribute('src', "theme/theme1/images/logo.$extension");
                    $output['logo'] = "theme/theme1/images/logo.$extension";
                } else {
                    $url = $node->getAttribute('src');
                    $extension = substr($url, -3);
                    $fs->copy($url, "$this->rendDirectory/$idRev/screen/$screenId/images/img-$i.$extension");
                    $node->setAttribute('src', "screen/$screenId/images/img-$i.$extension");
                    ++$i;
                }
            }
        }
        $output['html'] = $document->saveHTML();

        return $output;
    }

    public function generateFramework($idRev, $html, $parameters)
    {
        $popupWidth = '';
        $popupHeight = '';
        $popupBgColor = '';
        $popupBgImg = '';
        $popupBgClose = '';
        $popupBgOverlay = '';
        $popupOverlayOpacity = '';
        $refBgImg = '';
        $refBgColor = '';
        $refWidth = '';
        $refHeight = '';
        $refColor = '';

        $fs = $this->fileSystem;

        if (!$fs->exists("$this->rendDirectory/$idRev")) {
            $fs->mkdir("$this->rendDirectory/$idRev");
        } else {
            $fs->remove(array("$this->rendDirectory/$idRev"));
        }

        $fs->mirror("$this->framework", "$this->rendDirectory/$idRev");
        $contentsParameters = $this->str_get_html($parameters);
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
        if (null != $styleParameters->getAttribute('data-bg-popup-img')) {
            $popupBgImg = 'background-image: url("'.$styleParameters->getAttribute(
                    'data-bg-popup-img'
                ).'") !important;';
        }
        if (null != $styleParameters->getAttribute('data-bg-btn-close')) {
            $popupBgClose = 'background-image: url("'.$styleParameters->getAttribute(
                    'data-bg-btn-close'
                ).'") !important;';
        }
        if (null != $styleParameters->getAttribute('data-bg-ref-overlaycolor')) {
            $popupBgOverlay = 'background-color: '.$styleParameters->getAttribute('data-bg-ref-overlaycolor');
        }
        if (null != $styleParameters->getAttribute('data-overlay-ref-opacity')) {
            $popupOverlayOpacity = 'opacity: '.$styleParameters->getAttribute('data-overlay-ref-opacity');
        }
        if (null != $styleParameters->getAttribute('data-bg-ref-img')) {
            $refBgImg = 'background-image: url("'.$styleParameters->getAttribute('data-bg-ref-img').'") !important;';
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

        $styleRef = "style='".$refWidth.$refHeight.$refBgColor.$refBgImg."'";
        $stylePopins = "style='".$popupWidth.$popupHeight.$popupBgColor.$popupBgImg."'";
        $styleClose = "style='".$popupBgClose."'";
        $styleRefText = "style='".$refColor."'";

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

        $structureRef = '<div id="layer" data-ref  '.$styleLayer.'>
                                <div id="boxReference" '.$styleRef.'>
                                    <h3>Reference</h3>
                                   <div id="scrollerRef">
                                     <div><ul id="textReference" '.$styleRefText.'></ul></div>
                                   </div>
                                  <div id="boxReferenceClose" '.$styleClose.'></div>
                                    <span class="arrow-after"></span>
                                </div>
                            </div>';

        $structurePopin = '<div id="layer" data-pop data-prevent-tap="true" '.$styleLayer.'>
                            <div id="boxPopup" '.$stylePopins.'>
                               <div class="close" '.$styleClose.'></div>
                               <div id="scroller">
                                 <div>
                                     <div id="textPopup"></div>
                                  </div>
                               </div>
                            </div>
                        </div>';

        $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/reference/reference.html", $structureRef);
        $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/popup/popup.html", $structurePopin);
        $fs->dumpFile("$this->rendDirectory/$idRev/index.html", $html);
    }

    public function createFiles($fs, $idRev, $screenId)
    {
        $fs->mkdir("$this->rendDirectory/$idRev/screen/$screenId");
        $fs->mkdir("$this->rendDirectory/$idRev/screen/$screenId/images");
        $fs->mkdir("$this->rendDirectory/$idRev/screen/$screenId/popup");
        $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/index.html");
        $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/main.css");
        $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/main.js");
        $contentJS = '$(".slides section").removeClass();$(".slides section").addClass("present");';
        $fs->dumpFile("$this->rendDirectory/$idRev/screen/$screenId/main.js", $contentJS);
    }

    public function getPopins($popins)
    {
        libxml_use_internal_errors(true);  // Pour l'HTML 5
        $document = new \DOMDocument();
        libxml_clear_errors();  // Pour l'HTML 5
        $fs = $this->fileSystem;
        $document->loadHTML($popins);
        $listPopins = $document->getElementsByTagName('section');

        return $listPopins;
    }

    public function DOMinnerHTML($element)
    {
        $innerHTML = '';
        $children = $element->childNodes;
        foreach ($children as $child) {
            $tmp_dom = new \DOMDocument();
            $tmp_dom->appendChild($tmp_dom->importNode($child, true));
            $innerHTML .= trim($tmp_dom->saveHTML());
        }

        return $innerHTML;
    }

    public function generateScreens($idRev, $slides, $popins)
    {
        $fs = $this->fileSystem;

        libxml_use_internal_errors(true);  // Pour l'HTML 5
        $document = new \DOMDocument();
        libxml_clear_errors();  // Pour l'HTML 5
        if ($popins != '') {
            $sectionPopins = $this->getPopins($popins);
        }

        for ($i = 0; $i < count($slides); ++$i) {
            $slide = $slides[$i];
            $screenId = $slide->getAssetId();

            if ('' == $screenId) {
                $screenId = 'S1_'.(($i + 1) * 10);
            }
            $this->createFiles($fs, $idRev, $screenId);
            $surveyForm = '';
            if (count($slide->getSurvey()) > 0) {
                $surveyForm = '<form id="surveyForm"><div id="surveyContainer"></div><a href="javascript:void(0);" class="surveyButton" id="submitButton">Submit</a></form>';
            }

            $output = $this->downloadImgBalise($document, $slides[$i]->getContent(), $idRev, $screenId);
            $html = $this->backgroundImg($document, $output['html'], $idRev, $screenId);
//            $html =  $output['html'];

            if ($popins != '') {
                foreach ($sectionPopins as $node) {
                    $popinId = $node->getAttribute('data-id');
                    $contentPopins = $this->DOMinnerHTML($node);
                    $popinName = $this->getLinkedPopin($document, $html, $popinId);
                    if ($popinName != null) {
                        $fs->touch("$this->rendDirectory/$idRev/screen/$screenId/popup/$popinName.html");
                        $fs->dumpFile(
                            "$this->rendDirectory/$idRev/screen/$screenId/popup/$popinName.html",
                            $contentPopins
                        );
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
            $html = $surveyForm.'<div class="reveal"><div class="slides">'.$section->html().'</div></div>';
            $html = $divOpen.$html.$divClose;
            $fs->dumpFile("$this->rendDirectory/$idRev/screen/$screenId/index.html", $html);
        }

        return $output['logo'];
    }

    public function generateFlowJs($idRev, $slides)
    {
        $fs = $this->fileSystem;

        $flows = new Flows();
        $animation = array(
            'theme' => 'theme1',
            'events' => 'touchstart',
            'easingSlideIn' => 'transition.fadeIn',
            'easingSlideOut' => 'transition.fadeOut',
            'easingRef' => 'transition.fadeIn',
            'easingPop' => 'transition.fadeIn',
        );

        $flows->push($animation);

        for ($i = 0; $i < count($slides); ++$i) {
            $slide = $slides[$i];
            $assetId = $slide->getAssetId();
            $assetDesc = $slide->getAssetDescription();

            if ('' == $assetId) {
                $assetId = 'S1_'.($i + 1) * 10;
            }
            if ('' == $assetDesc) {
                $assetDesc = 'S1_'.($i + 1) * 10;
            }
            $listRef = '';

            foreach ($slide->getLinkedReferences() as $ref) {
                $listRef .= '<li>'.$ref->getCode().$ref->getDescription().'</li>';
            }

            $screen = new Screen($assetId, $assetDesc, ($i + 1), $listRef);

            $flows->push($screen);
        }

        $flowsJs = $this->serializer->serialize($flows, 'json');

        $fs->dumpFile("$this->rendDirectory/$idRev/js/framework/flows.js", "var flows = $flowsJs;");
    }

    public function generateIndexTheme($idRev, $slides, $logo)
    {
        $fs = $this->fileSystem;

        $document = new \DOMDocument();

        $subPicto = $document->createElement('div');
        $subPicto->setAttribute('class', 'subPicto');
        $subPicto->setAttribute('data-prevent-tap', 'true');

        $aHome = $document->createElement('a');
        $aHome->setAttribute('class', 'home');
        $aHome->setAttribute('data-link', '0');
        $aHome->setAttribute('data-chapter', '1');

        $maxMenu = $document->createElement('div');
        $maxMenu->setAttribute('data-prevent-tap', 'true');
        $maxMenu->setAttribute('class', 'maxMenu');

        $scrollMenu = $document->createElement('div');
        $scrollMenu->setAttribute('id', 'scrollmenu');
        $maxMenu->appendChild($scrollMenu);

        $scroller = $document->createElement('div');
        $scroller->setAttribute('id', 'scroller');
        $scrollMenu->appendChild($scroller);

//        $j = 1;
        for ($i = 1; $i < count($slides); ++$i) {
            $slide = $slides[$i];
            $screenName = $slide->getScreenName();

            if ('' == $screenName) {
                $screenName = 'Slide'.($i + 1);
            }

            $a = $document->createElement('a');
            $a->nodeValue = $screenName;
            $a->setAttribute('data-chapter', ''.($i + 1)); // toujours en ordre

            $a->setAttribute('data-link', ''.$i); // réorganiser l'ordre dans le sous-menu

            $subMenu = $document->createElement('div');
            $subMenu->setAttribute('data-prevent-tap', 'true');
            $subMenu->setAttribute('class', 'subMenu');
            $subMenu->setAttribute('data-chapter', ''.($i + 1));

            /* for ($l = 0; $l < 2; $l++) {
                 $j++;
                 $a2 = $document->createElement('a');
                 $a2->nodeValue = $screenName;
                 $a2->setAttribute('data-link', ''.$j);
 //                $a2->setAttribute('data-sub', ''.$i);
                 $a2->nodeValue = "subMenu".$j;

                 $subMenu->appendChild($a2);
                 $document->appendChild($subMenu);
             }*/

            $scroller->appendChild($a);
//            $j++;
        }

        $logoDiv = $document->createElement('div');
        $logoDiv->setAttribute('id', 'logo');
        $logoDiv->setAttribute('class', 'logo');
        $logoDiv->setAttribute('data-prevent-tap', 'true');

        if (false != $logo) {
            $img = $document->createElement('img');
            $img->setAttribute('src', $logo);
            $logoDiv->appendChild($img);
        }

        $minMenu = $document->createElement('div');
        $minMenu->setAttribute('class', 'minMenu');
        $minMenu->setAttribute('data-prevent-tap', 'true');

        $subMinMenu1 = $document->createElement('div');
        $subMinMenu1->setAttribute('class', 'ref show');
        $subMinMenu1->setAttribute('data-prevent-tap', 'true');
        $minMenu->appendChild($subMinMenu1);

        $subMinMenu2 = $document->createElement('div');
        $subMinMenu2->setAttribute('class', 'doc');
        $subMinMenu2->setAttribute('data-prevent-tap', 'true');
        $minMenu->appendChild($subMinMenu2);

        $document->appendChild($subPicto);
        $document->appendChild($aHome);
        $document->appendChild($maxMenu);
        $document->appendChild($logoDiv);
        $document->appendChild($minMenu);

        $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/index.html", $document->saveHTML());
    }

    public function generateCssTheme($idRev, $menu)
    {
        $fs = $this->fileSystem;
        if (null != $menu) {
            $css = '';

            $cssMenu = $menu->getMenuColor();
            if (null != $cssMenu) {
                $cssMenu = '#menu {'.$cssMenu.'} ';
                $css = $cssMenu;
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
                $fonts = '#menu {'.$fonts.'}';
                $css .= $fonts;
            }

            $highlight = $menu->getHighlight();
            if ('highlight' == $highlight) {
                $highlight = '#menu a.current {background-image: url(theme/theme1/images/selected.png);}';
                $css .= $highlight;
            }

            if ('' != $css) {
                $css = str_replace(';', ' !important;', $css);
                $css = self::STANDARD_CSS.''.$css;
            } else {
                $css = self::STANDARD_CSS;
            }

            $fs->dumpFile("$this->rendDirectory/$idRev/theme/theme1/main.css", $css);
        }
    }

    public function zip(
        $idPres,
        $idRev,
        $html,
        $slides,
        $menu,
        $popins,
        $parameters,
        $veevaThumbnailUrl,
        $veevaFullThumbnail
    ) {
        $this->generateFramework($idRev, $html, $parameters);
//        $this->generateVeevaThumbnails($idPres, $idRev, $veevaThumbnailUrl, $veevaFullThumbnail);
        $this->generateIndexVeeva($idRev);
        $logo = $this->generateScreens($idRev, $slides, $popins);
        $this->generateFlowJs($idRev, $slides);
        $this->generateIndexTheme($idRev, $slides, $logo);
        $this->generateCssTheme($idRev, $menu);

        //zip -r squash.zip dir1
        $cmd1 = "cd $this->rendDirectory;";
        $cmd2 = "test -f DSA-$idRev.zip && rm -rf DSA-$idRev.zip;";
        $cmd3 = "zip -r DSA-$idRev.zip $idRev;";
        $cmd4 = "test -d $idRev && rm -rf $idRev;";

        exec($cmd1.$cmd2.$cmd3.$cmd4, $output, $returnVar);

        if (0 == $returnVar) {
            return "$this->rendDirectory/DSA-$idRev.zip";
        }

        return false;
    }
}
