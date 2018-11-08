<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Objects\Flows;
use ArgoMCMBuilder\PresentationBundle\Objects\PresentationParameter;
use ArgoMCMBuilder\PresentationBundle\Objects\ReferenceMi;
use ArgoMCMBuilder\PresentationBundle\Objects\Screen;
use ArgoMCMBuilder\PresentationBundle\Objects\Util;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class MiDeepZipServiceS3.
 */
class MiDeepZipServiceS3
{
    private $fs;
    private $container;

    /** @var Presentation $pres */
    public $pres;
    /** @var Revision $rev */
    public $rev;

    /** @var array $slides */
    public $slides;

    /** @var ReferenceMi $reference */
    public $reference;
    /** @var PresentationParameter $param */
    public $param;

    /** @var Flows $flowsJs */
    public $flowsJs;

    /** @var string[] $labels */
    public $labels;

    /** @var string[] $backgroundsImages */
    public $backgroundsImages;

    public $util;
    public $crawler;

    public $errors;
    /** @var  AwsMedia awsMedia */
    public $awsMedia;
    public $zipName;
    public $S3;
    public $glob;
    public $css;
    public $mi;
    public $media;
    public $framework;
    public $aPopin;
    /**
     * MiDeep2ZipService constructor.
     *
     * @param Filesystem $fileSystem
     * @param Container $container
     */
    public function __construct($fileSystem, $container, $awsMedia)
    {
        $this->fs = $fileSystem;
        $this->container = $container;
        // todo
        $this->awsMedia = $awsMedia;
        $this->flowsJs = new Flows();

        $this->errors = [];
        $this->labels = [];
        $this->backgroundsImages = [];
        $this->crawler = new Crawler();
        $this->util = new Util($this->container);

        // zip input
        $this->framework = $this->container->getParameter('mi_deep_framework');
        // mediathéque
        $this->media = $this->container->getParameter('media_directory');

        $path = $this->container->get('kernel')->getBundle('PresentationBundle')->getPath();
        $file = "$path/Resources/views/mi-deep/standard-css.css";
        $contents = file_get_contents($file);
        if (false !== $contents) {
            $this->css = $contents;
        }

        return $this;
    }

    /**
     * @param string $selector
     * @param string $nameCss
     *
     * @return string|null
     */
    public function getExtension(string $selector, string $nameCss): ?string
    {
        $selector = ucwords($selector, '-');
        $selector = str_replace('-', '', $selector);

        $attr = call_user_func(array($this->param, "get{$selector}"));
        if (!empty($attr)) {
            $details = $this->getImageDetails($attr);
            $this->awsMedia->copyFileInS3(
                $this->S3,
                $this->zipName,
                "/image/".$details['pathAbsolute'],
                "theme/theme1/images/$nameCss.".$details['extension']
            );
//			if ($this->fs->exists($details['pathAbsolute'])) {
//				$this->fs->copy(
//					$details['pathAbsolute'],
//					"$this->mi/theme/theme1/images/$nameCss.".$details['extension']
//				);
//			}

            return $details['extension'];
        }

        return null;
    }

    /**
     * @param string $url
     * @param string $media
     *
     * @return array
     */
    public function getImageDetails($url)
    {
        $pattern = '/.*\/(.*?)\.(.*)/';
        $matches = array();
        $sourceName = '';
        $fileName = '';
        if (preg_match($pattern, $url, $matches)) {
            $sourceName = "$matches[1].$matches[2]";
            $extension = "$matches[2]";

            return array('pathAbsolute' => $sourceName, 'extension' => $extension);
        }

        return null;
    }

    /**
     * @param string $env
     *
     * @return void
     */
    public function generateCssTheme(string $env): void
    {
        $css = '';

        $cssMenu = $this->param->getDataBgMenuColor();

        if (!empty($cssMenu)) {
            $cssMenu = "background-color: $cssMenu;";
            $cssSubMenu = '#menu .subMenu {'.$cssMenu.'} ';
            $cssMenu = '#menu {'.$cssMenu.'} ';
            $css = $cssMenu.$cssSubMenu;
        }

        $cssLink = $this->param->getDataFontMenuColor();
        if (!empty($cssLink)) {
            $cssLink = '#menu a {color: '.$cssLink.'} ';
            $css .= $cssLink;
        }

        $itemColor = $this->param->getDataCurrentItemColor();
        if (!empty($itemColor)) {
            $itemColor = '#menu a.current {color: '.$itemColor.'} ';
            $css .= $itemColor;
        }

        $fonts = $this->param->getDataMenuFont();
        $fontSize = $this->param->getDataFontSizeSelect();
        if (!empty($fonts)) {
            $fonts = "font-family: $fonts; font-size: {$fontSize}px; width: 782px; overflow: hidden;";
            $subFonts = '#menu .subMenu a {'.$fonts.'} ';
            $fonts = '#menu {'.$fonts.'} ';
            $css .= $fonts.$subFonts;
        }

        $highlight = $this->param->getDataHighlightMenu();
        if ('highlight' == $highlight) {
            $highlight = '#menu a.current {background-image: url(theme/theme1/images/selected.png);}';
            $css .= $highlight;
        }

        if ('' !== $css) {
            $css = str_replace([';', 'width: 782px !important;'], [' !important;', ''], $css);

            $matches = array();
            $int = preg_match(
                '/#menu .subMenu {background-color: rgb((\w|\W)*) !important; display: block !important;}/',
                $css,
                $matches
            );

            if (1 === $int && !empty($matches)) {
                $subMenu = str_replace('display: block !important;', 'display: block;', $matches[0]);
                $css = str_replace($matches[0], $subMenu, $css); // 1 number of replacement
            }

            $css = $this->css.''.$css;

            $extension1 = $this->getExtension('data-logo-home-url', 'pictoHome');
            $extension2 = $this->getExtension('data-logo-refrs-url', 'pictoRef');
            $extension3 = $this->getExtension('data-logo-home-url', 'pictoRcp');

            $cssTheme = $this->util->renderView(
                '@Presentation/mi-deep/main-theme.css.twig',
                array(
                    'extension1' => $extension1,
                    'extension2' => $extension2,
                    'extension3' => $extension3,
                )
            );

            $css .= $cssTheme;
            if ('merck' === $env) {
                $this->awsMedia->copyFileInS3(
                    $this->S3,
                    $this->zipName,
                    "/zip_input/Merck/editor.css",
                    "css/editor.css"
                );
                $css .= '.sl-block .ref-container {opacity: 0;}';
            }
            $this->awsMedia->putFileInS3($this->S3, $this->zipName, $css, "theme/theme1/main.css");
        }
    }

    /**
     * @param \DOMDocument $document
     * @param string $tagName
     * @param array $attributes
     *
     * @return \DOMElement
     */
    public function createElement(\DOMDocument $document, string $tagName, array $attributes = null): \DOMElement
    {
        $tag = $document->createElement($tagName);

        if (!empty($attributes)) {
            foreach ($attributes as $attr => $val) {
                $tag->setAttribute($attr, $val);
            }
        }

        return $tag;
    }

    /**
     * @param string $screenId
     *
     * @return void
     */
    public function createFiles(string $screenId): void
    {

        $this->awsMedia->putFileInS3($this->S3, $this->zipName, "", "screen/$screenId/index.html");
        $this->awsMedia->putFileInS3($this->S3, $this->zipName, "", "screen/$screenId/main.css");
        $contentJS = '$(".slides section").removeClass();$(".slides section").addClass("present");';
        $this->awsMedia->putFileInS3($this->S3, $this->zipName, $contentJS, "screen/$screenId/main.js");

    }

    /**
     * @return array
     */
    public function generateFlowsJs(): array
    {
        $pdfParams = array(
            'pdfNbr' => 0,
            'pdfName' => '',
        );

        $animation = array(
            'theme' => 'theme1',
            'events' => 'touchstart',
            'easingSlideIn' => 'transition.fadeIn',
            'easingSlideOut' => 'transition.fadeOut',
            'easingRef' => 'transition.fadeIn',
            'easingPop' => 'transition.fadeIn',
            'rcp' => '',
        );

        $pdfName = '';
        $pdfList = $this->rev->getPdf()->toArray();
        /** @var Pdf $pdf */
        foreach ($pdfList as $pdf) {
            // $pdfName = !empty($pdf->getTitle()) ? $pdf->getTitle() : 'No Title';
            $fileResult = $this->util->getFileNameByPattern($pdf->getUrl(), "media/pdf", "pdf");
            $this->awsMedia->copyFileInS3(
                $this->S3,
                $this->zipName,
                $fileResult['sourceName'],
                $fileResult['fileName']
            );
            $animation['rcp'] .= '<li data-pdf="'.$fileResult['cleanFileName'].'">'.$fileResult['cleanFileName'].'</li>';
        }

        if (count($pdfList) == 1) {
            $animation['rcp'] = '';
            $pdfParams = [
                'pdfNbr' => 1,
                'pdfName' => $pdfName,
            ];
        }

        $flowsJs = $this->util->renderView(
            '@Presentation/mi-deep/flows.js.twig',
            array(
                'animation' => $animation,
                'screens' => $this->flowsJs->getAtt(),
            )
        );

        $this->awsMedia->putFileInS3(
            $this->S3,
            $this->zipName,
            $flowsJs,
            "js/framework/flows.js"
        );

        return $pdfParams;
    }

    public function generateThumbnail()
    {
        $key = "/thumbs/".$this->pres->getId()."-".$this->rev->getId()."/thumb-".$this->pres->getId().".jpg";
        $thumbnailUrl = $this->awsMedia->companyName.$key;
            if ($this->awsMedia->fileExistS3($thumbnailUrl)) {
                $this->awsMedia->copyFileInS3($this->S3, $this->zipName, $key, "media/images/thumbnails/200x150.jpg");
            }
    }

    public function generateReferences()
    {
        $this->reference = new ReferenceMi(
            $this->container,
            $this->fs,
            $this->rev->getId(),
            $this->param,
            $this->S3,
            $this->zipName,
            $this->awsMedia
        );
        $this->reference->setUtil($this->util);
        $this->reference->injectProperties();
        $ref = $this->reference->htmlMi();
        $fileName = "theme/theme1/reference/reference.html";
        $this->awsMedia->putFileInS3($this->S3, $this->zipName, $ref, $fileName);
    }

    /**
     * generateRcp
     */
    public function generateRcp()
    {
        $close = $this->reference->bgBtnClose;
        $rcp = $this->util->renderView('@Presentation/mi-deep/rcp.html.twig', ['close' => $close]);
        $fileName = "theme/theme1/rcp/rcp.html";
        $this->awsMedia->putFileInS3($this->S3, $this->zipName, $rcp, $fileName);
    }

    /**
     * generatePopins
     */
    public function generatePopins()
    {
        $styleClose = $this->reference->bgBtnClose;

        $popup = $this->util->renderView('@Presentation/mi-deep/popup.html.twig', ['close' => $styleClose]);
        $fileName = "theme/theme1/popup/popup.html";
        $this->awsMedia->putFileInS3($this->S3, $this->zipName, $popup, $fileName);
    }

    public function generateFramework()
    {
        $em = $this->container->get('doctrine')->getManager();
        $s3Folder = $em->getRepository('PresentationBundle:Revision')->getS3FolderByRev($this->rev->getId());
        if ($this->awsMedia->getExistFolderS3(
            $this->S3,
            $this->awsMedia->companyName."/zip/mi-deep/".$s3Folder['dataFolderS3']."/index.html"
        )
        ) {
            $this->awsMedia->deleteS3Object($this->S3, $this->awsMedia->companyName."/zip/mi-deep/".$s3Folder['dataFolderS3']."/");
        }
        $saveFolder = $this->awsMedia->cloneSourceMi(
            $this->S3,
            $this->zipName,
            'zip_input/frameworkMiDeep',
            $this->awsMedia->companyName.'/zip/mi-deep/'
        );
        if ($saveFolder) {
            $revision = $em->getRepository('PresentationBundle:Revision')->find($this->rev->getId());
            $revision->setDataFolderS3($this->zipName);
            $em->flush();
        }
        // set div#logo
        $logoPres = $this->param->getDataLogoPresUrl();
        if (!empty($logoPres)):
            $fileResult = $this->util->getFileNameByPattern($logoPres, "theme/theme1/images", "image");
            $this->awsMedia->copyFileInS3(
                $this->S3,
                $this->zipName,
                $fileResult['sourceName'],
                $fileResult['fileName']
            );
            $params['logo'] = $fileResult['fileName'];
        endif;
        $document = new \DOMDocument();
        $logoDiv = $this->createElement(
            $document,
            'div',
            array(
                'id' => 'logo',
                'class' => 'logo',
                'data-prevent-tap' => 'false',
            )
        );
        if (!empty($params['logo'])) {
            $img = $this->createElement($document, 'img', ['src' => $params['logo']]);
            $logoDiv->appendChild($img);
        }
        $document->appendChild($logoDiv);
        $indexHtml = $this->util->renderView(
            '@Presentation/mi-deep/index.html.twig',
            array('logoHtml' => $document->saveHTML())
        );
        $this->awsMedia->putFileInS3($this->S3, $this->zipName, $indexHtml, "index.html");
    }

    /**
     * @return string
     */
    public function getZipName()
    {
        $em = $this->container->get('doctrine')->getManager();
        $zipName = $em->getRepository('PresentationBundle:Presentation')->getZipName($this->rev->getId());
        /* if (empty($zipName)) {
             $this->glob = null;

             return $zipName = $this->rev->getId();
         }

         // to use when removing old zips, see the generateSharedResources() method
         $this->glob = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_*.zip';*/

        $currentDate = new \DateTime();
        $d = $currentDate->getTimestamp();
        $zipName = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_'.$d.'_'.$zipName['version'];

        return $zipName;
    }

    /**
     * @param \stdClass $std
     * @param string $type
     * @param string $dataChapter
     *
     * @return array
     */
    public function getLinksValues(\stdClass $std, string $type, string $dataChapter): array
    {
        $screenName = $chapterName = '';

        if (property_exists($std, 'children')) {
            // $std->{'children'} is the section.stack
            $slide = ($std->{'children'})[0];
        } else {
            $slide = $std;
        }

        if (property_exists($slide->{'attributes'}, 'data-screen-name')) {
            $screenName = $slide->{'attributes'}->{'data-screen-name'};
        }

        if (property_exists($slide->{'attributes'}, 'data-chapter-name')) {
            $chapterName = $slide->{'attributes'}->{'data-chapter-name'};
        }

        if (empty($screenName)) {
            $screenName = "Slide $dataChapter";
        }

        if ('Slide' === $type && !empty($chapterName)) {
            return array(
                'screenName' => $screenName,
                'chapterName' => $chapterName,
                'isChapterName' => true,
            );
        }

        return array(
            'screenName' => $screenName,
            'isChapterName' => false,
        );
    }

    /**
     * @return array
     */
    public function getParams(): array
    {
        // params to return
        $params = [];

        $this->param = $this->util->getPresentationParameter($this->rev->getPreSettings());

        // enable submenu
        if (!empty($this->param->getDataAllowSubmenu())) {
            if ($this->param->getDataAllowSubmenu() == 'false') {
                $enableSubMenu = 'hide-menu';
                $params['enable'] = $enableSubMenu;
            }
        }

        if (!empty($this->param->getDataDisableScroll())) {
            if ($this->param->getDataDisableScroll() == 'true') {
                $params['disallowScroll'] = true;
            }
        }


        if (!empty($this->param->getDataAllowSubmenuwidth())) {
            if ($this->param->getDataAllowSubmenuwidth() == 'true') {
                $params['enableSubMenuWidth'] = 'fullWidthSubmenu';
            }
        }


        return $params;
    }

    /**
     * generateIndexTheme
     */
    public function generateIndexTheme()
    {
        $params = $this->getParams();

        $document = new \DOMDocument();

        $subPicto = $this->createElement(
            $document,
            'div',
            array(
                'class' => 'subPicto',
                'data-prevent-tap' => 'true',
            )
        );
        $document->appendChild($subPicto);

        $maxMenu = $this->createElement(
            $document,
            'div',
            array(
                'class' => 'maxMenu',
                'data-prevent-tap' => 'true',
                'data-disable-scroll' => (!empty($params['disallowScroll']))? 'true' : 'false',
            )
        );

        $scrollMenu = $this->createElement(
            $document,
            'div',
            array(
                'id' => 'scrollmenu',
            )
        );

        $scroller = $this->createElement(
            $document,
            'div',
            array(
                'id' => 'scroller',
            )
        );

        $maxMenu->appendChild($scrollMenu);
        $scrollMenu->appendChild($scroller);
        $document->appendChild($maxMenu);

        /*$aHome = $this->createElement(
            $document,
            'a',
            array(
                'class' => 'home',
                'data-link' => '0',
                'data-chapter' => '1',
            )
        );

        $document->appendChild($aHome);*/

        $dataLink = -1;     // data-link begin with 0
        $dataChapter = 0;  // data-chapter begin with 1 see the <a class="home" ...></a>

        if (is_array($this->slides)) {
            $slides = $this->slides;
            foreach ($slides as $i => $slide) {
                // the first slide does not have a menu yet!
                /*if (0 === $i) {
                    continue;
                }*/
                $dataLink = $dataLink + 1;
                $dataChapter = $dataChapter + 1;
                $chapterName = '';
                $classHome = '';
                if (0 === $i) {
                    $classHome = 'home';
                }
                $aMaxMenu = $this->createElement(
                    $document,
                    'a',
                    array(
                        'class' => $classHome,
                        'data-link' => $dataLink.'',
                        'data-chapter' => $dataChapter.'',
                    )
                );

                $links = $this->getLinksValues($slide, 'Slide', $dataChapter);
                $aMaxMenu->nodeValue = $links['screenName'];
                if (true === $links['isChapterName']) {
                    $chapterName = $links['screenName'];
                    $aMaxMenu->nodeValue = $links['chapterName'];
                }
                if (0 === $i) {
                    $aMaxMenu->nodeValue = '';
                    $document->appendChild($aMaxMenu);
                } else {
                    $scroller->appendChild($aMaxMenu);
                }


                $params['enable'] = $params['enable'] ?? '';
                $params['enableSubMenuWidth'] = $params['enableSubMenuWidth'] ?? '';

                $subMenu = $this->createElement(
                    $document,
                    'div',
                    array(
                        'class' => 'subMenu '.$params['enable'],
                        'data-chapter' => $dataChapter.'',
                        'data-prevent-tap' => 'true',
                    )
                );

                $scrollMenu1 = $this->createElement(
                    $document,
                    'div',
                    array(
                        'class' => 'scrollmenu1'.' '.$params['enableSubMenuWidth'],
                    )
                );

                $scroller1 = $this->createElement(
                    $document,
                    'div',
                    array(
                        'class' => 'scroller1',
                    )
                );

                $subMenu->appendChild($scrollMenu1);
                $scrollMenu1->appendChild($scroller1);

                if (true === $links['isChapterName']) {
                    $aSubMenu = $this->createElement(
                        $document,
                        'a',
                        array(
                            'data-link' => $dataLink.'',
                            'data-sub' => $this->labels[$dataLink],
                        )
                    );
                    $aSubMenu->nodeValue = $chapterName;
                    $scroller1->appendChild($aSubMenu);
                    $document->appendChild($subMenu);
                }

                // if has sub slides
                if (property_exists($slide, 'children')) {
                    $children = (array)$slide->{'children'};
                    foreach ($children as $j => $child) {
                        if ($j === 0) {
                            continue;
                        }

                        $dataLink = $dataLink + 1;
                        $subScreenName = $this->getLinksValues($child, 'subSlide', ($i + 1).".".($j));
                        $aSubMenu = $this->createElement(
                            $document,
                            'a',
                            array(
                                'data-link' => $dataLink.'',
                                'data-sub' => $this->labels[$dataLink],
                            )
                        );
                        $aSubMenu->nodeValue = $subScreenName['screenName'];
                        $scroller1->appendChild($aSubMenu);
                        $document->appendChild($subMenu);
                    }
                }
            }

            // set div.minMenu
            $minMenu = $this->createElement(
                $document,
                'div',
                array(
                    'class' => 'minMenu',
                    'data-prevent-tap' => 'true',
                )
            );
            $subMinMenu1 = $this->createElement(
                $document,
                'div',
                array(
                    'class' => 'ref show',
                    'data-prevent-tap' => 'true',
                )
            );
            $minMenu->appendChild($subMinMenu1);

            // set div.showRcp
            $subMinMenu2 = $this->createElement(
                $document,
                'div',
                array(
                    'class' => 'doc menu-ml showRcp',
                    'data-prevent-tap' => 'true',
                )
            );

            // todo !!
//            if (array_key_exists('pdfNbr', $pdfParams)) {
//                if (1 == $pdfParams['pdfNbr']) {
//                    $subMinMenu2->setAttribute('data-pdf', $pdfParams['pdfName']);
//                }
//            }
            $minMenu->appendChild($subMinMenu2);
            $document->appendChild($minMenu);
            $this->awsMedia->putFileInS3($this->S3, $this->zipName, $document->saveHTML(), "theme/theme1/index.html");
        }
    }

    /**
     * @param \stdClass $slide
     *
     * @return bool
     */
    public function isLastSlide(\stdClass $slide): bool
    {
        $lastSlide = end($this->slides);
        if (property_exists($lastSlide, 'children')) {
            $lastSlide = end($lastSlide->{'children'});
        }

        return $slide->{'attributes'}->{'data-id'} === $lastSlide->{'attributes'}->{'data-id'};
    }

    /**
     * generateParametersXML
     */
    public function generateParametersXML()
    {
        $parameters = $this->getParametersXML();
        /** @var \DOMDocument $document */
        $document = $parameters['dom'];
        /** @var \DOMElement $pages */
        $pages = $parameters['pages'];
        /** @var \DOMElement $sequence */
        $sequence = $parameters['sequence'];
        /** @var string $names */
        $name = $parameters['name'];
        /**Create Question Xml**/
        $questions = $document->createElement('Questions');
        $checkQuestion = false;
        foreach ($this->generateLabels() as $label => $slide) {

            if (property_exists($slide, 'blocks')) {

                $doc = new \DOMDocument();
                $blocks = (array)$slide->{'blocks'};
                foreach ($blocks as $i => $block) {
                    if ($block->{'type'} == "survey") {
                        if ($block->{'blockStyle'}->{'blockcontent'}->{'data'} != "" and !empty($block->{'blockStyle'}->{'blockcontent'}->{'data'})) {
                            $html = $block->{'blockStyle'}->{'blockcontent'}->{'data'};

                            $doc->loadHTML($html);
                            $xpath = new \DOMXPath($doc);
                            $questionTitles = $xpath->query("//*[contains(@class, 'surveyIDs')]");
                            $questionId = '';
                            $questionTitle = '';
                            foreach ($questionTitles as $elt) {
                                $questionId = $elt->getAttribute('id');
                                $questionTitle = $elt->firstChild->data;
                            }

                            $checkQuestion = true;
                            $question = $document->createElement('Question');
                            $question->setAttribute('id', $questionId);
                            $question->setAttribute('text', $questionTitle);
                            $question->setAttribute('type', 'TEXT');
                            $questions->appendChild($question);
                        }

                    }
                }
            }
            /**Create Page with id**/
            $pageId = $label;
            if (property_exists($slide->{'attributes'}, 'data-chapter-name')) {
                $pageId = $slide->{'attributes'}->{'data-chapter-name'};
            }
            $page = $document->createElement('Page');
            $page->setAttribute('pageid', $pageId);
            $pages->appendChild($page);
            //@todo Last Slide !!!!
            //   if ($this->isLastSlide($slide)) {
            $sequence->setAttribute('Id', $name);
            $sequence->setAttribute('xmlns', 'urn:param-schema');

        }
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

        $this->awsMedia->putFileInS3(
            $this->S3,
            $this->zipName,
            $document->saveXML($document->documentElement),
            "parameters/parameters.xml"
        );
    }

    /**
     * @param \stdClass $slide
     *
     * @return void
     */
    public function downloadBackgroundImage(\stdClass $slide, $type): void
    {

        if (property_exists($slide, 'attributes')) {
            $attributes = $slide->{'attributes'};
            if (property_exists($attributes, 'data-background-image')) {
                $bgImg = $attributes->{'data-background-image'};
                if (property_exists($attributes, 'data-bg-screen-img')) {
                    $bgImg = $attributes->{'data-bg-screen-img'};
                }
                $sourceName = "";
                $fileName = "";
                $pattern = '/.*\/(.*?)\.(.*)/';
                $matches = array();
                if (preg_match($pattern, $bgImg, $matches)) {
                    $sourceName = "/image/$matches[1].$matches[2]";
                    $matches[1] = $this->util->cleanFileName($matches[1]);
                    $fileName = "theme/theme1/images/$matches[1].$matches[2]";
                }
                $this->awsMedia->copyFileInS3($this->S3, $this->zipName, $sourceName, $fileName);
                $attributes->{'data-background-image'} = $fileName;
                if (property_exists($slide, 'styles')) {
                    if (property_exists($slide->{"styles"}, 'background-image')) {
                        $slide->{"styles"}->{"background-image"} = "url('$fileName')";
                    }
                }
            }

        } else {
            trigger_error('Error is json structure: property "attributes" does not exist', E_USER_ERROR);
        }
    }

    /**
     * @param \stdClass $slide
     *
     * @return void
     */
    public function downloadBackgroundPopin(\stdClass $slide, $type): void
    {

        if (property_exists($slide, 'attributes')) {
            $attributes = $slide->{'attributes'};
            if (property_exists($attributes, 'data-bg-image') and !empty($attributes->{'data-bg-image'})) {
                $bgImg = $attributes->{'data-bg-image'};
                $sourceName = "";
                $fileName = "";
                $pattern = '/.*\/(.*?)\.(.*)/';
                $matches = array();
                if (preg_match($pattern, $bgImg, $matches)) {
                    $sourceName = "/image/$matches[1].$matches[2]";
                    $matches[1] = $this->util->cleanFileName($matches[1]);
                    $fileName = "theme/theme1/images/popin/$matches[1].$matches[2]";
                }
                $this->awsMedia->copyFileInS3($this->S3, $this->zipName, $sourceName, $fileName);
                $attributes->{'data-bg-image'} = $fileName;
            }

        } else {
            trigger_error('Error is json structure: property "attributes" does not exist', E_USER_ERROR);
        }
    }

    /**
     * @param \stdClass $data
     * @param string $attr
     * @param string $dir
     */
    public function setNewPath(\stdClass $data, string $attr, string $dir, $type): void
    {
        $src = $data->{$attr};
        $fileResult = $this->util->getFileNameByPattern($src, $dir, $type);
        $this->awsMedia->copyFileInS3($this->S3, $this->zipName, $fileResult['sourceName'], $fileResult['fileName']);
        $data->{$attr} = $fileResult['fileName'];

    }

    /**
     * @param string $screenId
     * @param \stdClass $slide
     *
     * @return void
     */
    public function downloadMedias(string $screenId, \stdClass $slide, $type): void
    {
        if ($type == "popin") {
            $popin = '/popin';
        } else {
            $popin = '';
        }

        if (property_exists($slide, 'blocks')) {
            $blocks = (array)$slide->{'blocks'};
            foreach ($blocks as $i => $block) {
                switch ($block->{'type'}) {
                    case 'image':
                        $data = $block->{'blockStyle'}->{'blockcontent'}->{'data'};
                        $this->setNewPath($data, 'src', "screen/$screenId/images$popin", "image");
                        break;
                    case 'video':
                        $data = $block->{'blockStyle'}->{'blockcontent'}->{'data'};
                        $this->setNewPath($data, 'source', "media/video$popin", "video");
                        $block->{'attributes'}->{'data-video'} = $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'source'};
                        $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'attributes'}->{'controls'} = "controls";
                        /*$poster = $block->{'attributes'};
                        $this->setNewPath($poster, 'data-video-poster', "media/video", "thumbvideo");*/
                        break;
                    default:
                        break;
                }

                // linked PDF
                if (property_exists($block->{'attributes'}, 'data-pdf-link')) {
                    //$this->setNewPath($block->{'attributes'}, 'data-pdf-link', 'media/pdf'.$popin, "pdf");
                    $src = $block->{'attributes'}->{'data-pdf-link'};
                    $fileResult = $this->util->getFileNameByPattern($src, "media/pdf$popin", "pdf");
                    $this->awsMedia->copyFileInS3(
                        $this->S3,
                        $this->zipName,
                        $fileResult['sourceName'],
                        $fileResult['fileName']
                    );
                    $block->{'attributes'}->{'data-pdf-name'} = $fileResult['cleanFileName'];
                    unset($block->{'attributes'}->{'data-pdf-link'});
                }
            }
        } else {
            trigger_error('Error is json structure: property "blocks" does not exist', E_USER_ERROR);
        }

    }

    /**
     * @param \stdClass $slide
     */
    public function generateAnimation(\stdClass $slide): void
    {
        if (property_exists($slide, 'blocks')) {
            $blocks = (array)$slide->{'blocks'};
            foreach ($blocks as $i => $block) {
                if (property_exists($block->{'attributes'}, "data-block-anim")) {
                    if ($block->{'attributes'}->{'data-block-anim'} == "tap") {
                        $block->{'blockStyle'}->{'blockcontent'}->{'attributes'}->{'data-animation-type-tap'} =
                            $block->{'blockStyle'}->{'blockcontent'}->{'attributes'}->{'data-animation-type'}."-tap";
                    }
                }
            }
        }
    }

    /**
     * @param string $label
     * @param \stdClass $slide
     *
     * @return void
     */
    public function setScreenContent(string $label, \stdClass $slide): void
    {
        $slide->{"screenId"} = $label;
        try {
            $this->awsMedia->putJsonInS3($this->S3, $this->zipName, $slide, "screen/$label/screen.json");
        } catch (IOException $e) {
        }
    }

    /**
     * @param string $label
     * @param \stdClass $slide
     *
     * @return void
     */
    public function setPopinContent(string $label, \stdClass $pop, string $idPop): void
    {

        try {
            $this->awsMedia->putJsonInS3($this->S3, $this->zipName, $pop, "screen/$label/popup/$idPop.json");
        } catch (IOException $e) {
        }
    }

    /**
     * @param string $label
     * @param int $slideCounter
     * @param int $chapter
     *
     * @return void
     */
    public function setLinkedReferences(string $label, array $refs, string $dataId, int $chapter): void
    {
        $listRef = '';
        foreach ($refs as $ref) {
            if ($ref->{'data_id'} == $dataId) {
                foreach ($ref->{'Refs'} as $linkedRef) {
                    $listRef .= '<li>'.$linkedRef->{'value'}.$linkedRef->{'description'}.'</li>';
                }
                $additionalText = $ref->{'additional_text'};
                if ($additionalText != "") {
                    $listRef .= '<li>'.$additionalText.'</li>';
                }
            }
        }

        $this->flowsJs->push(new Screen($label, $label, $chapter, $listRef));
    }

    /**
     * @return \Generator
     */
    public function generateLabels(): \Generator
    {

        $slides = $this->slides;
        foreach ($slides as $i => $slide) {
            if (!property_exists($slides[$i], 'children')) {
                $this->labels[] = 'S1_'.($i + 1) * 10;
                yield end($this->labels) => $slide;
            } else {
                $children = (array)$slide->{'children'};
                $this->labels[] = 'S1_'.($i + 1) * 10;

                yield end($this->labels) => $children[0];

                foreach ($children as $k => $child) {
                    if (0 !== $k) {
                        $this->labels[] = 'S1_'.((($i + 1) * 10).'_'.$k * 10);
                        $child->isChild = true;

                        yield end($this->labels) => $child;
                    }
                }
            }
        }
    }

    /**
     * @return array
     */
    public function getParametersXML(): array
    {
        $document = new \DOMDocument();
        $sequence = $document->createElement('Sequence');
        $pages = $document->createElement('Pages');

        $names = $this->container
            ->get('doctrine')
            ->getManager()
            ->getRepository('PresentationBundle:Revision')
            ->getPresentationVersionAndProjectName($this->rev->getId());

        $date = new \DateTime();
        $tamp = $date->getTimestamp();
        $name = $names['name'].'_'.$tamp.'_'.$names['version'];

        return [
            'dom' => $document,
            'pages' => $pages,
            'sequence' => $sequence,
            'name' => $name,
        ];
    }

    /**
     * @return array
     */
    public function getLinkedPopin($slide)
    {
        $popins = array();
        foreach ($slide->{"blocks"} as $block) {
            if ($block->{"linkedpopin"}) {
                if (property_exists($block->{"linkedpopin"}, 'data')) {
                    $popins[] = $block->{"linkedpopin"}->{"data"};
                }
            }
        }

        return array_unique($popins);

    }

    public function generateContentPopins($label, $popins, $dataPops)
    {
        foreach ($dataPops as $key => $dataPop) {
            if (in_array($dataPop->{"attributes"}->{"data-id"}, $popins)) {
                $this->downloadMedias($label, $dataPop, 'popin');
                $this->downloadBackgroundPopin($dataPop, 'popin');
                $dataPop = (object)(array)$dataPop;
                $this->generateAnimation($dataPop);
                $this->setPopinContent($label, $dataPop, $dataPop->{"attributes"}->{"data-id"});
                $this->aPopin[]= $dataPop->{"attributes"}->{"data-popin-name"};
            }

        }

    }

    /**
     * @return void
     */
    public function generateScreens(): void
    {
        /** @var \stdClass $this ->slides */
        $this->slides = (array)json_decode($this->rev->getSlides());

        $chapter = $slideCounter = 0;
        $dataPops = (array)json_decode($this->rev->getPopin());
        $references = (array)json_decode($this->rev->getLinkedRef());
        foreach ($this->generateLabels() as $label => $slide) {

            $this->createFiles($label);
            $this->downloadBackgroundImage($slide, 'slide');
            $this->downloadMedias($label, $slide, 'slide');
            $this->generateAnimation($slide);
            $popins = $this->getLinkedPopin($slide);
            $this->generateContentPopins($label, $popins, $dataPops);
            if (!property_exists($slide, 'isChild')) {
                $chapter = $chapter + 1;
            }
            $this->setLinkedReferences($label, $references, $slide->{'attributes'}->{'data-id'}, $chapter);
            $slideCounter = $slideCounter + 1;
            $this->setScreenContent($label, $slide);

        }
        $this->generateFlowsJs();

    }

    /**
     * @param $dir
     *
     * @return string
     */
    public function generateSlidesJsonFiles($dir): string
    {
        $tamp = (new \DateTime())->getTimestamp();
        $fileName = "slides.$tamp.json";
        $this->fs->dumpFile("$dir/$fileName", $this->rev->getSlides());

        return $fileName;
    }

    /**
     * @param Presentation $pres
     * @param Revision $rev
     * @param string $env
     *
     * @return \stdClass|string
     */
    public function zip(Presentation $pres, Revision $rev, string $env, string $companyParentName)
    {
        $this->pres = $pres;
        $this->rev = $rev;
        $this->slides = (array)json_decode($this->rev->getSlides());
        $this->param = $this->util->getPresentationParameter($rev->getPreSettings());
        $this->mi = $this->container->getParameter('zip_deep_directory')."/".$this->rev->getId();
        $this->zipName = $this->util->slugify($this->getZipName());
        $this->S3 = $this->awsMedia->getS3Client();
        $this->awsMedia->companyName = $companyParentName;
        $this->generateFramework();
        $this->generateReferences();
        $this->generatePopins();
        $this->generateRcp();
        $this->generateThumbnail();
        $this->generateScreens();
        $this->generateParametersXML();
        $this->generateIndexTheme();
        $this->generateCssTheme($env);

        $response = $this->awsMedia->generateZipByLambda($this->zipName, "mi", "zip");
        dump($response);die();
        $response = \GuzzleHttp\json_decode($response);

        return $response;
    }
}
