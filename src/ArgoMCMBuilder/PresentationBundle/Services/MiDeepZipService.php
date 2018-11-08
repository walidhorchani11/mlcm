<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Survey;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\PresentationBundle\Entity\LinkedRef;
use ArgoMCMBuilder\PresentationBundle\Entity\Menu;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
//use ArgoMCMBuilder\PresentationBundle\Entity\Slider;
use ArgoMCMBuilder\PresentationBundle\Objects\Flows;
use ArgoMCMBuilder\PresentationBundle\Objects\PresentationParameter;
use ArgoMCMBuilder\PresentationBundle\Objects\ReferenceMi;
use ArgoMCMBuilder\PresentationBundle\Objects\Screen;
use ArgoMCMBuilder\PresentationBundle\Objects\Util;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class MiDeepZipService.
 */
class MiDeepZipService
{
    private $fs;
    private $container;
    public $idPres;
    public $idRev;
    public $slides;
    /** @var ReferenceMi $reference */
    public $reference;
    /** @var  PresentationParameter $param */
    public $param;
    public $popins;
    public $errors;
    public $labels = array();
    public $util;
    public $crawler;
    /** @var Presentation $pres */
    public $pres;
    public $glob;
    public $css;
    public $mi;
    public $media;
    public $framework;

    /**
     * MiDeep2ZipService constructor.
     *
     * @param Filesystem $fileSystem
     * @param Container  $container
     */
    public function __construct($fileSystem, $container)
    {
        $this->fs = $fileSystem;
        $this->container = $container;

        $this->errors = [];
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
     * @param string $str
     * @param string $pattern
     *
     * @return array|false
     */
    public function getExtensionAndPath($str, $pattern = null)
    {
        if (null === $pattern) {
            $pattern = '#(http(\W|\w)*)?/uploads(\W|\w)+(jpg|png|jpeg|gif|bmp")#i';
        }

        $matches = $matches2 = [];

        if (preg_match($pattern, $str, $matches)) {
            $explode = explode('/uploads/', $matches[0]);

            if (!empty($explode) && count($explode) > 1) {
                $img = $explode[1];
                $fullPath = $this->media.$img;

                $ext = 'jpg'; // just init the $ext variable
                $start = strrpos($img, '.');
                if (false != $start) {
                    $ext = substr($img, $start, strlen($img));
                }

                return ['ext' => $ext, 'path' => $fullPath];
            }
        }

        return false;
    }

    /**
     * @param string  $selector
     * @param string  $nameCss
     *
     * @return string|null
     */
    public function getExtension(string $selector, string  $nameCss)
    {
        $selector = ucwords($selector, '-');
        $selector = str_replace('-', '', $selector);

        $attr = call_user_func(array($this->param, "get{$selector}"));
        if (!empty($attr)) {
            $details = $this->getImageDetails($attr, $this->media);
            if ($this->fs->exists($details['pathAbsolute'])) {
                $this->fs->copy($details['pathAbsolute'], "$this->mi/theme/theme1/images/$nameCss.".$details['extension']);
            }

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
    public function getImageDetails($url, $media)
    {
        $urlHttp = explode('/uploads/', $url);
        $pathAbsolute = $media.$urlHttp[1];
        $extension = substr($url, -3);

        return ['pathAbsolute' => $pathAbsolute, 'extension' => $extension];
    }

    /**
     * @param Menu   $menu
     * @param string $currentUrl
     * @param string $parameters
     */
    public function generateCssTheme($menu, $currentUrl, $parameters)
    {
        if (null != $menu) {
            $css = '';

            $cssMenu = $menu->getMenuColor(); // bgMenuColor
            if (null != $cssMenu) {
                $cssSubMenu = '#menu .subMenu {'.$cssMenu.'} ';
                $cssMenu = '#menu {'.$cssMenu.'} ';
                $css = $cssMenu.$cssSubMenu;
            }

            $cssLink = $menu->getFontColor(); // dataFontMenuColor
            if (null != $cssLink) {
                $cssLink = '#menu a {'.$cssLink.'} ';
                $css .= $cssLink;
            }

            $itemColor = $menu->getItemColor(); // currentItemColor
            if (null != $itemColor) {
                $itemColor = '#menu a.current {'.$itemColor.'} ';
                $css .= $itemColor;
            }

            $fonts = $menu->getFonts(); // dataMenuFont
            if (null != $fonts) {
                $subFonts = '#menu .subMenu a {'.$fonts.'} ';
                $subFonts = str_replace('display: block;', '', $subFonts);
                $subFonts = str_replace('white-space: normal;', '', $subFonts);
                $fonts = '#menu {'.$fonts.'} ';
                $css .= $fonts.$subFonts;
            }

            $highlight = $menu->getHighlight(); //dataHighlightMenu
            if ('highlight' == $highlight) {
                $highlight = '#menu a.current {background-image: url(theme/theme1/images/selected.png);}';
                $css .= $highlight;
            }

            if ('' != $css) {
                $css = str_replace([';', 'width: 782px !important;'], [' !important;', ''], $css);
                $css = str_replace("#menu {display: block !important; font-family:", "#menu {display: block; font-family:", $css);

                $matches = [];
                $int = preg_match(
                    '/#menu .subMenu {background-color: rgb((\w|\W)*) !important; display: block !important;}/',
                    $css,
                    $matches
                );
                if (1 == $int && !empty($matches)) {
                    $subMenu = str_replace('display: block !important;', 'display: block;', $matches[0]);
                    $css = str_replace($matches[0], $subMenu, $css); // 1 number of replacement
                }
                $css = $this->css.''.$css;
            } else {
                $css = $this->css;
            }

            $extension1 = $this->getExtension('data-logo-home-url', 'pictoHome');
            $extension2 = $this->getExtension('data-logo-refrs-url', 'pictoRef');
            $extension3 = $this->getExtension('data-logo-home-url', 'pictoRcp');

            $cssTheme = $this->util->renderView('@Presentation/mi-deep/main-theme.css.twig', array(
                    'extension1' => $extension1,
                    'extension2' => $extension2,
                    'extension3' => $extension3,
            ));

            $css .= $cssTheme;
            $cssMerck = $this->container->getParameter('css_merck');
            if ($currentUrl == 'merck') {
                $this->fs->remove("$this->mi/css/editor.css");
                $this->fs->copy("$cssMerck/editor.css", "$this->mi/css/editor.css");
                $css .= '.sl-block .ref-container {opacity: 0;}';
            }

            $this->fs->dumpFile("$this->mi/theme/theme1/main.css", $css);
        }
    }

    /**
     * @param Slider $slide
     * @param string $type
     * @param string $dataChapter
     *
     * @return array
     */
    public function setScreenName($slide, $type, $dataChapter)
    {
        $result = [];
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
     * @param \DOMDocument $document
     * @param string       $tagName
     * @param array        $attributes
     *
     * @return \DOMElement|array
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
     * Generate an array of arrays that contains the presentation's tree
     * for example [[s1], [s2, s2.1, s2.2], [s3], [s4]].
     *
     * @param array $slides
     *
     * @return array $tree
     */
    public function generateSlidesTree(array $slides)
    {
        $tree = [];
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
     * @param string $paramsEditor
     *
     * @return array
     */
    public function getParams($paramsEditor)
    {
        // params to return
        $params = [];

        $mcmParams = $this->param;

        // enable submenu
        if (!empty($mcmParams->getDataAllowSubmenu())) {
            if ($mcmParams->getDataAllowSubmenu() == 'false') {
                $enableSubMenu = 'hide-menu';
                $params['enable'] = $enableSubMenu;
            }
        }

        if (!empty($mcmParams->getDataAllowSubmenuwidth())) {
            if ($mcmParams->getDataAllowSubmenuwidth() == 'true') {
                $params['enableSubMenuWidth'] = 'fullWidthSubmenu';
            }
        }

        $logoPres = $mcmParams->getDataLogoPresUrl();
        if (!empty($logoPres)) {
            $uploads = explode('/uploads/', $logoPres);
            $slashes = explode('/', $logoPres);

            if (!empty($uploads) && count($uploads) > 1) {
                $pathAbsolute = $this->media.$uploads[1];
                $nameLogo = end($slashes);

                if ($this->fs->exists($pathAbsolute)) {
                    $this->fs->copy($pathAbsolute, "$this->mi/theme/theme1/images/$nameLogo");
                }
                $params['logo'] = "theme/theme1/images/$nameLogo";
            }
        }

        return $params;
    }

    /**
     * @param string $paramsEditor
     * @param array  $pdfParams
     */
    public function generateIndexTheme($paramsEditor, array $pdfParams)
    {
        $params = $this->getParams($paramsEditor);

        $document = new \DOMDocument();
        $subPicto = $this->createElement($document, 'div', ['class' => 'subPicto', 'data-prevent-tap' => 'true']);
        $document->appendChild($subPicto);

        $maxMenu = $this->createElement($document, 'div', ['class' => 'maxMenu', 'data-prevent-tap' => 'true']);
        $scrollMenu = $this->createElement($document, 'div', ['id' => 'scrollmenu']);
        $scroller = $this->createElement($document, 'div', ['id' => 'scroller']);
        $maxMenu->appendChild($scrollMenu);
        $scrollMenu->appendChild($scroller);

        $document->appendChild($maxMenu);

        $tree = $this->generateSlidesTree($this->slides);

        $aHome = $this->createElement($document, 'a', ['class' => 'home', 'data-link' => '0', 'data-chapter' => '1']);
        $document->appendChild($aHome);

        $labels = $this->labels;

        $dataLink = 0;     // data-link begin with 0
        $dataChapter = 1;  // data-chapter begin with 1 see the <a class="home" ...></a>

        foreach (array_slice($tree, 1) as $idx => $slidesTab) {
            ++$dataLink;
            ++$dataChapter;
            $chapterName = '';

            $aMaxMenu = $this->createElement($document, 'a', array(
                'data-link'    => $dataLink.'',
                'data-chapter' => $dataChapter.'',
            ));

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
                    'class'            => 'subMenu '.$params['enable'],
                    'data-chapter'     => $dataChapter.'',
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
        $logoUrl = "";
        if (!empty($params['logo'])) {
            $logoUrl = $params['logo'];
        }
        $indexHtml = $this->util->renderView('@Presentation/mi-deep/index.html.twig', array(
            'slides' => $this->slides,
            'logo' => $logoUrl
        ));
        $this->fs->dumpFile("$this->mi/index.html", $indexHtml);

        // set div.minMenu
        $minMenu = $this->createElement($document, 'div', ['class' => 'minMenu', 'data-prevent-tap' => 'true']);
        $subMinMenu1 = $this->createElement($document, 'div', ['class' => 'ref show', 'data-prevent-tap' => 'true']);
        $minMenu->appendChild($subMinMenu1);

        // set div.showRcp
        $subMinMenu2 = $this->createElement($document, 'div', array(
                'class' => 'doc menu-ml showRcp',
                'data-prevent-tap' => 'true',
        ));

        if (array_key_exists('pdfNbr', $pdfParams)) {
            if (1 == $pdfParams['pdfNbr']) {
                $subMinMenu2->setAttribute('data-pdf', $pdfParams['pdfName']);
            }
        }
        $minMenu->appendChild($subMinMenu2);
        $document->appendChild($minMenu);

        $this->fs->dumpFile("$this->mi/theme/theme1/index.html", $document->saveHTML());
    }

    public function generateParametersXML()
    {
        $labels = $this->labels;

        $document = new \DOMDocument();
        $sequence = $document->createElement('Sequence');

        $names = $this->container
            ->get('doctrine')
            ->getManager()
            ->getRepository('PresentationBundle:Revision')
            ->getPresentation($this->idRev);

        $date = new \DateTime();
        $tamp = $date->getTimestamp();
        $name = $names['name'].'_'.$tamp.'_'.$names['version'];
        $name = str_replace("&", "", $name);
        $name = str_replace(" ", "_", $name);
        $name = str_replace("&amp;", "", $name);
        $sequence->setAttribute('Id', $name);
        $sequence->setAttribute('xmlns', 'urn:param-schema');

        $pages = $document->createElement('Pages');

        $checkQuestion = false;
        $questions = $document->createElement('Questions');

        for ($i = 0; $i < count($this->slides); ++$i) {
            /** @var Slider $slide */
            $slide = $this->slides[$i];
            $surveys = $slide->getSurvey();
            /** @var Survey $survey */
            foreach ($surveys as $survey) {
                $checkQuestion = true;
                $question = $document->createElement('Question');
                $question->setAttribute('id', $survey->getCode());
                $question->setAttribute('text', utf8_decode(str_replace("  ", "", $survey->getQuestion())));
                define('CHARSET', 'ISO-8859-1');
                define('REPLACE_FLAGS', ENT_COMPAT | ENT_XHTML);
                $question->setAttribute('text', str_replace("&amp;", "",htmlspecialchars($survey->getQuestion(), REPLACE_FLAGS, CHARSET)));
                $question->setAttribute('type', 'TEXT');
                $questions->appendChild($question);

            }

            $pageId = $labels[$i];
            if (!empty($slide->getAssetDescription())) {
                $pageId = $slide->getAssetDescription();
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
        $this->fs->dumpFile("$this->mi/parameters/parameters.xml", $document->saveXML($document->documentElement));
    }

    /**
     * @param string $content
     *
     * @return array|string
     */
    public function generatePdfLink($content)
    {
        $dom = new \DomDocument();
        $dom->loadHTML('<?xml encoding="UTF-8">'.$content);
        $xpath = new \DOMXPath($dom);
        $pdfList = $xpath->query('//*[@data-pdf-link]');

        /** @var \DOMElement $pdf */
        foreach ($pdfList as $pdf) {
            $urlPdf = $pdf->getAttribute('data-pdf-link');
            $pdfTab = explode('/', $urlPdf);
            $urlHttp = explode('/uploads/', $urlPdf);
            $pathAbsolute = $this->media.$urlHttp[1];
            $nameOrigPdf = $pdfTab[count($pdfTab) - 1];
            if ($this->fs->exists($pathAbsolute)) {
                $this->fs->copy($pathAbsolute, "$this->mi/media/pdf/$nameOrigPdf");
            }
            $pdf->removeAttribute('data-pdf-link');
            $pdf->setAttribute('data-pdf', $nameOrigPdf);
        }

        return $dom->saveHTML();
    }

    /**
     * @param \DOMElement $video
     *
     * @return array
     */
    public function generatePoster(&$video)
    {
        $web = $this->container->getParameter('web_directory');
        $thumbnails = $this->container->getParameter('presentations_thumbnails');

        $urlVideoPoster = $video->getAttribute('data-video-poster');
        $videoAutoPlay = $video->getAttribute('data-video-autoplay');
        $posterAbsolutePath = '';
        $poster = false;

        if ('' != $urlVideoPoster) {
            $videoPosterTab = explode('/', $urlVideoPoster);
            if (in_array('uploads', $videoPosterTab) == true) {
                $urlPosterHttp = explode('/uploads/', $urlVideoPoster);
                $posterAbsolutePath = $this->media.$urlPosterHttp[1];
            } elseif (in_array('img', $videoPosterTab) == true) {
                $posterAbsolutePath = $web.$urlVideoPoster;
            } elseif (in_array($thumbnails, $videoPosterTab) == true) {
                $urlPosterHttp = explode($thumbnails, $urlVideoPoster);
                $posterAbsolutePath = "$thumbnails$urlPosterHttp[1]";
            }

            if ('' != $posterAbsolutePath) {
                $posterVideo = $videoPosterTab[count($videoPosterTab) - 1];
                if ($this->fs->exists($posterAbsolutePath)) {
                    $poster = "media/video/$posterVideo";
                    $this->fs->copy($posterAbsolutePath, "$this->mi/$poster");
                }
                $video->setAttribute('data-video-poster', "$poster");

//                if (null !== $video->firstChild->firstChild->firstChild) {
//                    $video->firstChild->firstChild->firstChild->setAttribute('poster', "media/video/$posterVideo");
//                }
//                dump($video->firstChild->firstChild->firstChild === null); exit(0);
//                $r = $this->getVideoElement($video, 'video');
//                dump($r, $video->getAttribute('class'));
//
//                $dom = new \DOMDocument();
//                $crawler = new Crawler();
//                $crawler->addHtmlContent($dom->saveHTML($video));
//                dump($crawler->html());
            }
        }
//        exit(0);

//        if ($videoAutoPlay == 'true' && null !== $video->firstChild->firstChild->firstChild) {
//            $video->firstChild->firstChild->firstChild->setAttribute('autoplay', true);
//        }

        return ['autoplay' => ($videoAutoPlay === 'true'), 'poster' => $poster];
    }

    /**
     * @param string $content
     *
     * @return array|string
     */
    public function generateVideoPopin($content)
    {
        $dom = $this->util->newDomDocument($content);

        $xpath = new \DOMXPath($dom);
        $videoList = $xpath->query('//*[@data-video]');

        foreach ($videoList as $video) {
            /** @var \DOMElement $video */
            $urlVideo = $video->getAttribute('data-video');
            $videoTab = explode('/', $urlVideo);
            $urlHttp = explode('/uploads/', $urlVideo);
            $pathAbsolute = $this->media.$urlHttp[1];
            $nameOrigVideo = $videoTab[count($videoTab) - 1];
            if ($this->fs->exists($pathAbsolute)) {
                $this->fs->copy($pathAbsolute, "$this->mi/media/video/$nameOrigVideo");
            }
            $video->setAttribute('data-video', "media/video/$nameOrigVideo");
            if (null != $video->firstChild->firstChild->firstChild && null !== $video->firstChild->firstChild->firstChild->firstChild) {
                $video->firstChild->firstChild->firstChild->setAttribute('controls', 'controls');
                $video->firstChild->firstChild->firstChild->firstChild->setAttribute('src', "media/video/$nameOrigVideo");
            }
            $this->generatePoster($video);
        }

        return $dom->saveHTML();
    }

    /**
     * @param string $html
     * @param string $popins
     *
     * @return array
     */
    public function getLinkedPopin($html, $popins)
    {
        $crawler = new Crawler();
        $crawler->addHtmlContent($html);
        $linkedPop = $crawler->filter('#linkedpopin');

        $linkedPops = [];
        for ($i = 0; $i < $linkedPop->count(); ++$i) {
            // class attribute is saved into div#linkedpopin
            $class = $linkedPop->eq($i)->text();

            $crawler->clear();
            $crawler->addHtmlContent($popins);

            // find section with $class class
            $popin = $crawler->filter(".$class");
            /** @var \DOMElement $section */
            $section = $crawler->filter(".$class")->getNode(0);

            // to get outerHtml (outerHtml not supported in DOMCrawler!)
            $pdfInPopin = $crawler->getNode(0)->ownerDocument->saveHTML($section);

            $popAttr = array(
                'name' => $class,
                'popin-name' => $popin->attr('data-popin-name'),
//                'content'    => $this->generatePdfLink($pdfInPopin),
                'content' => $this->setPdf(new Slider(), $pdfInPopin),
            );

            array_push($linkedPops, $popAttr);
        }

        return $linkedPops;
    }

    /**
     * @param \DOMElement $element
     * @param string      $attr
     *
     * @return \DOMElement|null
     */
    public function getChildWithAttr(\DOMElement $element, $attr)
    {
        if ($element->hasAttribute($attr)) {
            return $element;
        }

        // Checks if $element has children
        if (!$element->hasChildNodes()) {
            return null;
        }

        // init the $firstChild
        $firstChild = $element->firstChild;

        // get the first element node child
        for ($i = 0; $i < $element->childNodes->length; ++$i) {
            $node = $element->childNodes->item($i);
            if (XML_ELEMENT_NODE === $node->nodeType) {
                $firstChild = $node;
                break;
            }
        }
        if (XML_ELEMENT_NODE !== $firstChild->nodeType) {
            return null;
        }

        return $this->getChildWithAttr($firstChild, $attr);
    }

    /**
     * @param string $content
     * @param string $screenId
     *
     * @return array|string
     */
    public function generateAnimationPopin($content, $screenId)
    {
        $dom = $this->animation($content);
        $images = $dom->getElementsByTagName('img');

        for ($i = 0; $i < $images->length; ++$i) {
            $src = $images->item($i)->getAttribute('src');
            $expath = $this->getExtensionAndPath($src);
            if (is_array($expath)) {
                $extension = $expath['ext'];
                $fullPath = $expath['path'];

                if ($this->fs->exists($fullPath)) {
                    $targetImage = $this->mi."/screen/$screenId/images/image_in_pop".($i + 1).$extension;

                    $this->fs->copy($fullPath, $targetImage);
                    $images->item($i)->setAttribute('src', "screen/$screenId/images/image_in_pop".($i + 1).$extension);
                }
            }
        }

        $this->crawler->clear();
        $this->crawler->addHtmlContent($dom->saveHTML());
        // remove unnecessary tags
        $this->util->removeElement($this->crawler, '.sl-block .ui-rotatable-handle');

        return $this->crawler->filter('body')->html();
    }

    /**
     * @param string $html
     * @param string $screenId
     * @param string $popin
     *
     * @return string
     */
    public function backgroundImgPop($html, $screenId, $popin)
    {
        $document = $this->util->newDomDocument($html);

        /** @var \DOMElement $section */
        $section = $document->getElementsByTagName('section')->item(0);
        $style = $section->getAttribute('style');
        $bgPattern = '#background-image:\surl(\W|\w)+\);#';

        if (preg_match($bgPattern, $style, $matches1)) {
            $urlPattern = '#/uploads(\W|\w)+(jpg|png|jpeg|gif|bmp")#i';

            if (preg_match($urlPattern, $matches1[0], $matches2)) {
                $img = explode('/uploads/', $matches2[0])[1];
                $fullPath = $this->container->getParameter('media_directory').$img;

                $ext = 'jpg'; // just inti the $ext variable
                $start = strrpos($img, '.');
                if (false != $start) {
                    $ext = substr($img, $start, strlen($img));
                }

                if ($this->fs->exists($fullPath)) {
                    $target = "$this->mi/screen/$screenId/images/$popin-screen-bg-img$ext";
                    $this->fs->copy($fullPath, $target);

                    $section->setAttribute(
                        'style',
                        str_replace($matches2[0], "screen/$screenId/images/$popin-screen-bg-img$ext", $style)
                    );

                    if ($section->hasAttribute('data-bg-screen-img')) {
                        $section->removeAttribute('data-bg-screen-img');
                    }

                    if ($section->hasAttribute('data-bg-img')) {
                        $section->removeAttribute('data-bg-img');
                    }
                }
            }
        }

        $html = $document->saveHTML($document->documentElement).PHP_EOL.PHP_EOL; // utf-8 encoding
        $this->crawler->clear();
        $this->crawler->addHtmlContent($html);

        return $this->crawler->filter('body')->html();
    }

    /**
     * @param string $html
     * @param string $screenId
     * @param string $popin
     *
     * @return string|array
     */
    public function downloadImagesPop($html, $screenId, $popin)
    {
        $document = $this->util->newDomDocument($html);
        $images = $document->getElementsByTagName('img');
        for ($i = 0; $i < $images->length; ++$i) {
            $src = $images->item($i)->getAttribute('src');
            $expath = $this->getExtensionAndPath($src);
            if (is_array($expath)) {
                $extension = $expath['ext'];
                $fullPath = $expath['path'];

                if ($this->fs->exists($fullPath)) {
                    $targetImage = $this->mi."/screen/$screenId/images/$screenId-$popin".($i + 1).$extension;
                    $this->fs->copy($fullPath, $targetImage);
                    $images->item($i)->setAttribute('src', "screen/$screenId/images/$screenId-$popin".($i + 1).$extension);
                }
            }
        }
        $html = $document->saveHTML($document->documentElement).PHP_EOL.PHP_EOL; // to get UTF-8 charset!!
        $this->crawler->clear();
        $this->crawler->addHtmlContent($html);

        return $this->crawler->filter('body')->html();
    }

    /**
     * @param Slider $slide
     * @param string $screenId
     * @param string $popins
     */
    public function setLinkedPopins(Slider $slide, $screenId, $popins)
    {
        if ('' != $popins) {
            $popinsArray = $this->getLinkedPopin($slide->getContent(), $popins);
            if (count($popinsArray) > 0) {
                $k = 0;
                foreach ($popinsArray as $pop) {
                    //                    $html = $this->downloadImagesPop($pop['content'], $screenId, "popin-$k");
                    $html = $this->downloadImages(new Slider(), $screenId, $pop['content'], $k + 1);
//                    $html = $this->backgroundImgPop($html, $screenId, 'pop-'.($k + 1));
                    $html = $this->backgroundImg(new Slider(), $screenId, '', $html, $k + 1);
//                    $videoPop = $this->generateVideoPopin($html);
                    $videoPop = $this->setVideo(new Slider(), $html);
                    $animationPop = $this->generateAnimationPopin($videoPop, $screenId);

                    $popName = $pop['name'];
                    $this->fs->touch("$this->mi/screen/$screenId/popup/$popName.html");
                    $this->fs->dumpFile("$this->mi/screen/$screenId/popup/$popName.html", $animationPop);
                    $this->popins[] = $pop['popin-name'];

                    $k = $k + 1;
                }
            }
        }
    }

    /**
     * @param string $content
     *
     * @return \DOMDocument
     */
    public function animation($content)
    {
        $dom = $this->util->newDomDocument($content);
        $xpath = new \DOMXPath($dom);

        $animationList = $xpath->query("//*[contains(@data-block-anim, 'tap')]");
        foreach ($animationList as $elt) {
            $node = $this->getChildWithAttr($elt, 'data-animation-type');
            if (null !== $node) {
                $animationType = $node->getAttribute('data-animation-type').'-tap';
                $node->setAttribute('data-animation-type-tap', $animationType);
            }
        }

        return $dom;
    }

    /**
     * @param Slider      $slide
     * @param string|null $content
     *
     * @return Slider|string
     */
    public function setAnimation(Slider $slide, $content = null)
    {
        if ($content !== null) {
            $html = $content;
            $slide = null;
        } else {
            $html = $slide->getContent();
        }

        $dom = $this->animation($html);

        $this->crawler->clear();
        $this->crawler->addHtmlContent($dom->saveHTML($dom->documentElement));
        $body = $this->crawler->filter('body')->html();

        if (null !== $slide) {
            $slide->setContent($body);

            return $slide;
        }

        return $body;
    }

    /**
     * @param Slider $slide
     * @param string $content
     *
     * @return Slider|string
     */
    public function setVideo(Slider $slide, $content = null)
    {
        if (null === $content) {
            $html = $slide->getContent();
        } else {
            $html = $content;
            $slide = null;
        }
        $dom = $this->util->newDomDocument($html);

        $this->crawler->clear();
        $this->crawler->addHtmlContent($dom->saveHTML());

        $i = 0;
        /** @var \DOMElement $slBlock */
        foreach ($this->crawler->filterXPath('//*[@data-video]') as $slBlock) {
            $uploads = explode('/uploads/', $slBlock->getAttribute('data-video'));
            $slashes = explode('/', $slBlock->getAttribute('data-video'));

            if (!empty($uploads) && count($uploads) > 1) {
                // get the absolute path
                $path = $this->media.$uploads[1];
                // get the last element
                $originName = end($slashes);

                if ($this->fs->exists($path)) {
                    $this->fs->copy($path, "$this->mi/media/video/$originName");
                }

                $slBlock->setAttribute('data-video', "media/video/$originName");
                $slBlockParams = $this->generatePoster($slBlock);

                /** @var \DOMElement $video */
                $video = $this->crawler->filter('#video')->getNode($i);
                if (null !== $video) {
                    // increase video counter
                    $i = $i + 1;

                    $video->setAttribute('controls', 'controls');
                    if (true === $slBlockParams['autoplay']) {
                        $video->setAttribute('autoplay', true);
                        $video->setAttribute('poster', $slBlockParams['poster']);
                    }

                    if ($video->hasChildNodes()) {
                        /** @var \DOMElement $source */
                        $source = $video->firstChild;
                        if ('source' == strtolower($source->nodeName)) {
                            $source->setAttribute('src', "media/video/$originName");
                        }
                    }
                }
            }
        }

        $body = $this->crawler->filter('body')->html();

        if (null === $slide) {
            return $body;
        }

        $slide->setContent($body);

        return $slide;
    }

    /**
     * @param Slider      $slide
     * @param string|null $content
     *
     * @return string|Slider
     */
    public function setPdf(Slider $slide, $content = null)
    {
        if (null !== $content) {
            $html = $content;
            $slide = null;
        } else {
            $html = $slide->getContent();
        }

        $dom = $this->util->newDomDocument($html);
        $xpath = new \DOMXPath($dom);

        $pdfList = $xpath->query('//*[@data-pdf-link]');

        /** @var \DOMElement $pdf */
        foreach ($pdfList as $pdf) {
            $uploads = explode('/uploads/', $pdf->getAttribute('data-pdf-link'));
            $slashes = explode('/', $pdf->getAttribute('data-pdf-link'));

            if (!empty($uploads) && count($uploads) > 1) {
                // get the absolute path of the pdf
                $path = $this->media.$uploads[1];
                $originName = end($slashes); // get the last element

                if ($this->fs->exists($path)) {
                    $this->fs->copy($path, "$this->mi/media/pdf/$originName");
                }

                $pdf->removeAttribute('data-pdf-link');
                $pdf->setAttribute('data-pdf', $originName);
            }
        }

        $html = $dom->saveHTML($dom->documentElement);
        $this->crawler->clear();
        $this->crawler->addHtmlContent($html);
        $body = $this->crawler->filter('body')->html();

        if (null !== $slide) {
            $slide->setContent($body);

            return $slide;
        }

        return $body;
    }

    /**
     * @param Slider $slide
     * @param string $screenId
     * @param string $imageName
     * @param string $popinContent
     * @param string $popinIndex
     *
     * @return Slider|string
     */
    public function backgroundImg(Slider $slide, $screenId, $imageName, $popinContent = null, $popinIndex = null)
    {
        if (null !== $popinContent && null !== $popinIndex) {
            $html = $popinContent;
            $popinIndex = "bg_popin_$popinIndex";
            $slide = null; // avoid memory leaks
        } else {
            $html = $slide->getContent();
        }

        $document = $this->util->newDomDocument($html);

        /** @var \DOMElement $section */
        $section = $document->getElementsByTagName('section')->item(0);

        $uri = $section->getAttribute('data-background-image');
        $explode = explode('/uploads/', $uri);
        if (!empty($explode) && count($explode) > 1) {
            $img = $explode[1];
            $fullPath = $this->container->getParameter('media_directory').$img;

            $ext = 'jpg'; // just init the $ext variable
            $start = strrpos($img, '.');
            if (false != $start) {
                $ext = substr($img, $start, strlen($img));
            }
            if ($this->fs->exists($fullPath)) {
                $imgNewPath = "screen/$screenId/images/{$screenId}_{$imageName}{$popinIndex}{$ext}";
                $this->fs->copy($fullPath, "$this->mi/$imgNewPath");

                if ($section->hasAttribute('style')) {
                    $style = $section->getAttribute('style');
                    $style = "{$style} background-image: url('{$imgNewPath}');";
                    $section->setAttribute('style', $style);
                } else {
                    $style = "background-image: url('{$imgNewPath}');";
                    $section->setAttribute('style', $style);
                }

                if ($section->hasAttribute('data-background-image')) {
                    $section->removeAttribute('data-background-image');
                }
            }
        }

        $saveHtml = $document->saveHTML($document->documentElement).PHP_EOL.PHP_EOL;
        $this->crawler->clear();
        $this->crawler->addHtmlContent($saveHtml);
        $body = $this->crawler->filter('body')->html();

        if (null == $slide) {
            return $body;
        }

        $slide->setContent($body);

        return $slide;
    }

    /**
     * @param Slider $slide
     * @param string $screenId
     * @param int    $i
     */
    public function setScreenContent(Slider $slide, $screenId, $i)
    {
        // remove unnecessary tags
        $this->crawler->clear();
        $this->crawler->addHtmlContent($slide->getContent());
        $this->util->removeElement($this->crawler, '.BlockRef');
        $this->util->removeElement($this->crawler, '.BlockRefOverlay');
        $this->util->removeElement($this->crawler, '.sl-block .ui-rotatable-handle');

        if (0 == $i) {
            $divOpen = '<div class="content main active" id="'.$screenId.'">';
        } else {
            $divOpen = '<div class="content main" id="'.$screenId.'">';
        }
        $divClose = '</div>';

        $section = str_replace("\n", '', $this->crawler->filter('body')->html());
        $html = '<div class="reveal"><div class="slides">'.$section.'</div></div>';
        $html = $divOpen.$html.$divClose;

        $this->fs->dumpFile("$this->mi/screen/$screenId/index.html", $html);
    }

    /**
     * @param Slider $slider
     * @param string $screenId
     * @param string $popinContent
     * @param string $popinIndex
     *
     * @return string|Slider
     */
    public function downloadImages(Slider $slider, $screenId, $popinContent = null, $popinIndex = null)
    {
        if (null !== $popinContent && null !== $popinIndex) {
            $html = $popinContent;
            $popinIndex = "_popin_$popinIndex";
            $slider = null; // avoid memory leaks
        } else {
            $html = $slider->getContent();
        }

        $document = $this->util->newDomDocument($html);
        $images = $document->getElementsByTagName('img');

        for ($i = 0; $i < $images->length; ++$i) {
            $src = $images->item($i)->getAttribute('src');
            $expath = $this->getExtensionAndPath($src);

            if (is_array($expath)) {
                $extension = $expath['ext'];
                $fullPath = $expath['path'];

                if ($this->fs->exists($fullPath)) {
                    $imgNewPath = "screen/$screenId/images/$screenId".'_image'.$popinIndex.'_'.($i + 1).$extension;
                    $this->fs->copy($fullPath, "$this->mi/$imgNewPath");
                    $images->item($i)->setAttribute('src', $imgNewPath);
                }
            }
        }

        $saveHtml = $document->saveHTML($document->documentElement);
        $this->crawler->clear();
        $this->crawler->addHtmlContent($saveHtml);
        $body = $this->crawler->filter('body')->html();

        if (null !== $popinContent && null !== $popinIndex) {
            return $body;
        }

        $slider->setContent($body);

        return $slider;
    }

    /**
     * @param string $screenId
     */
    public function createFiles($screenId)
    {
        $this->fs->mkdir("$this->mi/screen/$screenId");
        $this->fs->mkdir("$this->mi/screen/$screenId/images");
        $this->fs->mkdir("$this->mi/screen/$screenId/popup");
        $this->fs->touch("$this->mi/screen/$screenId/index.html");
        $this->fs->touch("$this->mi/screen/$screenId/main.css");
        $this->fs->touch("$this->mi/screen/$screenId/main.js");

        $contentJS = '$(".slides section").removeClass();$(".slides section").addClass("present");';
        $this->fs->dumpFile("$this->mi/screen/$screenId/main.js", $contentJS);
    }

    /**
     * @param Flows $flows
     *
     * @return array
     */
    public function generateFlowsJs(Flows $flows)
    {
        $pdfParams = ['pdfNbr' => 0, 'pdfName' => ''];

        $animation = [
            'theme' => 'theme1',
            'events' => 'touchstart',
            'easingSlideIn' => 'transition.fadeIn',
            'easingSlideOut' => 'transition.fadeOut',
            'easingRef' => 'transition.fadeIn',
            'easingPop' => 'transition.fadeIn',
            'rcp' => '',
        ];

        $pdfName = '';
        $pdfList = $this->pres->getPdf()->toArray();

        foreach ($pdfList as $pdf) {
            /** @var Pdf $pdf */
            $url = parse_url($pdf->getUrl());
            $path = explode('/', $url['path']);
            $pdfName = end($path);

            $pdfPath = explode('/uploads/', $url['path']);
            if (count($pdfPath) > 0) {
                $file = "$this->media".$pdfPath[1];
                if ($this->fs->exists($file)) {
                    $this->fs->copy($file, "$this->mi/media/pdf/$pdfName");
                }
            }
            $animation['rcp'] .= '<li data-pdf="'.$pdfName.'">'.$pdf->getTitle().'</li>';
        }

        if (1 === count($pdfList)) {
            $animation['rcp'] = '';
            $pdfParams = [
                'pdfNbr' => 1,
                'pdfName' => $pdfName,
            ];
        }

        $flowsJs = $this->util->renderView('@Presentation/mi-deep/flows.js.twig', array(
                'animation' => $animation,
                'screens' => $flows->getAtt(),
        ));

        $file = "$this->mi/js/framework/flows.js";
        $this->fs->touch($file);
        $this->fs->dumpFile($file, $flowsJs);

        return $pdfParams;
    }

    /**
     * @param Slider $slide
     * @param int    $i
     * @param int    $chapter
     *
     * @return Screen
     */
    public function setLinkedRef(Slider $slide, $i, &$chapter)
    {
        $assetDesc = $slide->getAssetDescription();
        if ('' == $assetDesc) {
            $assetDesc = $this->labels[$i];
        }

        $assetId = $this->labels[$i];
        if (null == $slide->getParent()) {
            ++$chapter;
        }

        $listRef = '';
        /** @var LinkedRef $ref */
        foreach ($slide->getLinkedReferences() as $ref) {
            // delete \n & \r after delete spaces
            $desc = str_replace(["\r\n", "\n\n", "\n", "\r"], '', rtrim($ref->getDescription()));
            $listRef .= '<div class="item-ref-wrapper"><div class="row-ref">'.$ref->getCode().'<span class="descRef">'.$desc.'</span></div></div>';
        }

        return new Screen($assetId, $assetDesc, $chapter, $listRef);
    }

    /**
     * @param string $popins
     *
     * @return Flows
     */
    public function generateScreens($popins)
    {
        // flows.js
        $flowsJs = new Flows();
        $e = $chapter = 0;
        for ($i = 0; $i < count($this->slides); ++$i) {
            /** @var Slider $slide */
            $slide = $this->slides[$i];

            $this->labels = array_merge($this->labels, $this->getLabel($slide, $e));
            $this->createFiles($this->labels[$i]);

            $slide = $this->downloadImages($slide, $this->labels[$i]);
            $slide = $this->backgroundImg($slide, $this->labels[$i], 'bg_image_'.($i + 1));
            $slide = $this->setPdf($slide);
            $slide = $this->setAnimation($slide);
            $this->setVideo($slide);
            $this->setLinkedPopins($slide, $this->labels[$i], $popins);
            $this->setScreenContent($slide, $this->labels[$i], $i);
            $screen = $this->setLinkedRef($slide, $i, $chapter);
            $flowsJs->push($screen);
        }

        return $flowsJs;
    }

    /**
     * @param Slider $slide
     * @param int    $e
     *
     * @return array
     */
    public function getLabel(Slider $slide, &$e)
    {
        $labels = array();
        $sliderRep = $this
                        ->container
                        ->get('doctrine')
                        ->getManager()
                        ->getRepository('PresentationBundle:Slider');

        // in case that slide is parent
        if (null == $slide->getParent()) {
            $nbScreens = $sliderRep->getNumberOfChildren($slide->getId());

            $labels[] = 'S1_'.($e + 1) * 10;
            if ($nbScreens[1] > 0) {
                for ($l = 0; $l < $nbScreens[1]; ++$l) {
                    $labels[] = 'S1_'.(($e + 1) * 10).'_'.($l + 1) * 10;
                }
            }
            ++$e;
        }

        return $labels;
    }

    public function generateThumbnail()
    {
        $thumbnailUrl = $this->pres->getThumbnailPath();
        if ($this->fs->exists("$thumbnailUrl")) {
            $this->fs->copy("$thumbnailUrl", "$this->mi/media/images/thumbnails/200x150.jpg", true);
        }
    }

    public function downloadFonts()
    {
        $fontPath = $this->container->getParameter('web_directory').'/fonts';

        $defaultFonts = ['opensans-regular-webfont', 'Montserrat-Regular'];

        $fontsArray = $this->param->getDataFontUrlExist();

        if (!empty($fontsArray)) {
            $fonts = explode(',', $fontsArray);
            // check the explode result!
            if (!empty($fonts) && count($fonts) > 1) {
                // loop into fonts array
                foreach ($fonts as $font) {
                    $preg = preg_match('#/fonts/(.*)/#', $font, $matches);
                    if (1 === $preg && !in_array($matches[1], $defaultFonts)) {
                        if ($this->fs->exists("$fontPath/$matches[1]")) {
                            $this->fs->mirror("$fontPath/$matches[1]", "$this->mi/fonts");
                        }
                    }
                }
            }
        }
    }

    public function generateReferences()
    {
        $this->reference = new ReferenceMi($this->container, $this->fs, $this->idRev, $this->param);
        $this->reference->setUtil($this->util);
        $this->reference->injectProperties();

        $ref = $this->reference->htmlMi();
        $this->fs->dumpFile("$this->mi/theme/theme1/reference/reference.html", $ref);
    }

    public function generateRcp()
    {
        $close = $this->reference->bgBtnClose;
        $rcp = $this->util->renderView('@Presentation/mi-deep/rcp.html.twig', ['close' => $close]);

        $this->fs->dumpFile("$this->mi/theme/theme1/rcp/rcp.html", $rcp);
    }

    public function generatePopins()
    {
        $styleClose = $this->reference->bgBtnClose;

        $popup = $this->util->renderView('@Presentation/mi-deep/popup.html.twig', ['close' => $styleClose]);
        $this->fs->dumpFile("$this->mi/theme/theme1/popup/popup.html", $popup);
    }

    public function generateFramework()
    {
        if (!$this->fs->exists($this->mi)) {
            $this->fs->mkdir($this->mi);
        } else {
            $this->fs->remove($this->mi);
        }

        if ($this->fs->exists($this->framework)) {
            $this->fs->mirror($this->framework, $this->mi);
        }

    }

    /**
     * @return string
     */
    public function getZipName()
    {
        $em = $this->container->get('doctrine')->getManager();
        $zipName = $em->getRepository('PresentationBundle:Presentation')->getZipName($this->idRev);
        if (empty($zipName)) {
            $this->glob = null;

            return $zipName = $this->idRev;
        }

        // to use when removing old zips, see the generateSharedResources() method
        $this->glob = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_*.zip';

        $currentDate = new \DateTime();
        $d = $currentDate->format('mdY');
        $zipName = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_'.$d.'_'.$zipName['version'];

        return $zipName;
    }

    /**
     * Generate Veeva Wide zip.
     *
     * @param int          $idRev
     * @param Presentation $pres
     * @param array        $slides
     * @param string       $param
     * @param Menu         $menu
     * @param string       $popins
     * @param string       $currentUrl
     *
     * @return array
     */
    public function zip($idRev, $pres, $slides, $param, $menu, $popins, $currentUrl)
    {
        /* @var  Presentation $pres */
        $this->pres = $pres;
        $this->idPres = $pres->getId();
        $this->idRev = $idRev;
        // zip output
        $this->mi = $this->container->getParameter('zip_deep_directory')."/$this->idRev";
        // array of Slider
        $this->slides = $slides;

        $this->param = $this->util->getPresentationParameter($param);

        $this->generateFramework();
        $this->generateReferences();
        $this->generatePopins();
        $this->generateRcp();
        $this->downloadFonts();
        $this->generateThumbnail();
        $flows = $this->generateScreens($popins);
        $pdfParams = $this->generateFlowsJs($flows);
        $this->generateParametersXML();
        $this->generateIndexTheme($param, $pdfParams);
        $this->generateCssTheme($menu, $currentUrl, $param);

        // delete bad characters from the zip name
        $zipName = $this->util->slugify($this->getZipName());

        // delete old zips
        $mi = $this->container->getParameter('zip_deep_directory');
        if (null != $this->glob) {
            $oldZips = glob($mi.'/'.$this->glob);
            if (!empty($oldZips)) {
                for ($i = 0; $i < count($oldZips); ++$i) {
                    if ($this->fs->exists($oldZips[$i])) {
                        $this->fs->remove($oldZips[$i]);
                    }
                }
            }
        }

        // run the linux command zip
        $cmd = "cd $mi/$idRev;";
        $cmd .= "test -f $zipName.zip && rm -rf $zipName.zip;";
        $cmd .= "cd $idRev;";
        $cmd .= "zip -r ../$zipName.zip ./*;";
        $cmd .= 'cd .. ;';
        $cmd .= "test -d $idRev && rm -rf $idRev;";

        exec($cmd, $output, $returnVar);

        $zip = [];
        $zip['name'] = "$zipName.zip";
        $zip['zipPath'] = "$mi/$zipName.zip";
        if (0 == $returnVar) {
            return $zip;
        }

        // save errors for debug
        $this->errors['zip'] = [];
        $this->errors['zip']['return'] = "An error occurred while generating your zip ($returnVar)";
        $this->errors['zip']['output'] = $output;
        $this->errors['zip']['cmd'] = $cmd;

        return $this->errors;
    }
}
