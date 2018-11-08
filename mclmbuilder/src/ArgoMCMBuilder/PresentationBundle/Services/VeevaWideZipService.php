<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\PresentationBundle\Entity\Menu;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
//use ArgoMCMBuilder\PresentationBundle\Entity\Slider;
use ArgoMCMBuilder\PresentationBundle\Objects\Flows;
use ArgoMCMBuilder\PresentationBundle\Objects\Parameter;
use ArgoMCMBuilder\PresentationBundle\Objects\PresentationParameter;
use ArgoMCMBuilder\PresentationBundle\Objects\Reference;
use ArgoMCMBuilder\PresentationBundle\Objects\Screen;
use ArgoMCMBuilder\PresentationBundle\Objects\Util;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class VeevaWideZipService allow to generate Veeva zip.
 */
class VeevaWideZipService
{
    private $shared;
    private $fs;
    private $container;
    /** @var Reference $reference */
    private $reference;
    /** @var Parameter $parameter */
    private $parameter;
    private $idRev;
    private $idPres;
    private $slides;
    /** @var PresentationParameter $param */
    private $param;
    private $menu;
    private $popins;
    public  $errors;
    public  $currentUrl;
    public  $util;
    public  $zipName;
    public  $wideDir;
    public  $framework;
    public  $media;
    public  $currentDate;
    public  $crawler;

    /**
     * VeevaWideZipService constructor.
     *
     * @param Filesystem $fileSystem
     * @param Container $container
     */
    public function __construct($fileSystem, $container)
    {
        $this->fs = $fileSystem;
        $this->container = $container;

        $this->errors = [];
        $this->wideDir = $this->container->getParameter('zip_wide_directory');
        // zip input
        $this->framework = $this->container->getParameter('veeva_wide_framework');
        $this->media = $this->container->getParameter('media_directory');

        $this->crawler = new Crawler();
        $this->currentDate = new \DateTime();
        $this->util = new Util($this->container);

        return $this;
    }

    /**
     * @return string
     */
    public function getZipName()
    {
        $em = $this->container->get('doctrine')->getManager();
        $zipName = $em->getRepository('PresentationBundle:Presentation')->getZipName($this->idRev);

        if (empty($zipName)) {
            return $zipName = $this->idRev;
        }

        foreach ($zipName as $key => $name) {
            $zipName[$key] = $this->util->slugify($name);
        }
        $this->zipName = $zipName;

        $d = $this->currentDate->getTimestamp();
        $zip = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_'.$d.'_'.$zipName['version'];

        return $zip;
    }

    /**
     * @param string $content
     * @param string $nameFolder
     *
     * @return string
     */
    public function generatePdfLink($content, $nameFolder)
    {
        $dom = $this->util->newDomDocument($content);
        $xpath = new \DOMXPath($dom);
        $pdfList = $xpath->query('//*[@data-pdf-link]');

        $veeva = $this->wideDir;

        /** @var \DOMElement $pdf */
        foreach ($pdfList as $pdf) {
            $urlPdf = $pdf->getAttribute('data-pdf-link');
            $pdfTab = explode('/', $urlPdf);
            $urlHttp = explode('/uploads/', $urlPdf);
            $pathAbsolute = $this->media.$urlHttp[1];
            $nameOrigPdf = $pdfTab[count($pdfTab) - 1];

            if ($this->fs->exists($pathAbsolute)) {
                $this->fs->copy($pathAbsolute, "$veeva/$this->idRev/$nameFolder/pdf/$nameOrigPdf");
            }
            $pdf->setAttribute('data-pdf-link', $nameOrigPdf);
        }

        return $dom->saveHTML();
    }

    /**
     * @param string $content
     * @param string $nameFolder
     *
     * @return bool
     */
    public function getSurvey($content, $nameFolder)
    {
        $dom = new \DomDocument();
        $content = str_replace("\n", '', $content);
        $dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
        $xpath = new \DOMXPath($dom);
        $btnList = $xpath->query("//*[contains(@id, 'submitButton')]");

        $veeva = $this->wideDir;
        $mcmSurvey = $this->container->getParameter('mcm_survey');
        $exist = false;

        /* @var \DOMElement $survey */
        if ($btnList->length > 0) {
            foreach ($btnList as $btn) {
                $this->fs->mirror($mcmSurvey, "$veeva/$this->idRev/$nameFolder/js");
                $exist = true;
            }
        }

        return $exist;
    }

    /**
     * @param \DOMElement $video
     * @param int $nameFolder
     *
     * @return array
     */
    public function generatePoster(&$video, $nameFolder)
    {
        $urlVideoPoster = $video->getAttribute('data-video-poster');
        $videoAutoPlay = $video->getAttribute('data-video-autoplay');
        $veeva = $this->wideDir;
        $web = $this->container->getParameter('web_directory');
        $thumbDirectory = $this->container->getParameter('presentations_thumbnails');
        $thumbnails = $this->container->getParameter('thumbnails');
        $posterAbsolutePath = '';
        $poster = false;

        if ($urlVideoPoster !== '') {
            $videoPosterTab = explode('/', $urlVideoPoster);
            if (in_array('uploads', $videoPosterTab) == true) {
                $urlPosterHttp = explode('/uploads/', $urlVideoPoster);
                $posterAbsolutePath = $this->media.$urlPosterHttp[1];
            } elseif (in_array('img', $videoPosterTab) == true) {
                $posterAbsolutePath = $web.$urlVideoPoster;
            } elseif (in_array($thumbDirectory, $videoPosterTab) == true) {
                $urlPosterHttp = explode($thumbDirectory, $urlVideoPoster);
                $posterAbsolutePath = "$thumbnails$urlPosterHttp[1]";
            }

            if ('' !== $posterAbsolutePath) {
                $posterVideo = end($videoPosterTab);
                if ($this->fs->exists($posterAbsolutePath)) {
                    $poster = "video/$posterVideo";
                    $this->fs->copy($posterAbsolutePath, "$veeva/$this->idRev/$nameFolder/video/$posterVideo");
                }
                $video->setAttribute('data-video-poster', "video/$posterVideo");
            }
        }

        return ['autoplay' => ($videoAutoPlay === 'true'), 'poster' => $poster];
    }

    /**
     * @param string $content
     * @param string $nameFolder
     *
     * @return string
     */
    public function generateVideo($content, $nameFolder)
    {
        $veeva = $this->wideDir;
        $dom = $this->util->newDomDocument($content);
        $crawler = new Crawler();
        $crawler->addHtmlContent($dom->saveHTML());

        $i = 0;
        /** @var \DOMElement $slBlock */
        foreach ($crawler->filterXPath('//*[@data-video]') as $slBlock) {
            $uploads = explode('/uploads/', $slBlock->getAttribute('data-video'));
            $slashes = explode('/', $slBlock->getAttribute('data-video'));

            if (!empty($uploads) && count($uploads) > 1) {
                // get the absolute path
                $path = $this->media.$uploads[1];
                // get the last element
                $originName = end($slashes);

                if ($this->fs->exists($path)) {
                    $this->fs->copy($path, "$veeva/$this->idRev/$nameFolder/video/$originName");
                }

                $slBlock->setAttribute('data-video', "video/$originName");
                $slBlockParams = $this->generatePoster($slBlock, $nameFolder);

                /** @var \DOMElement $video */
                $video = $crawler->filter('#video')->getNode($i);

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
                            $source->setAttribute('src', "video/$originName");
                        }
                    }
                }
            }
        }

        return $crawler->filter('body')->html();
    }

    /**
     * @param string $content
     *
     * @return string
     */
    public function generateAnimation($content)
    {
        $dom = $this->util->newDomDocument($content);
        $xpath = new \DOMXPath($dom);
        $animationList = $xpath->query("//*[contains(@data-block-anim, 'tap')]");

        foreach ($animationList as $elt) {
            $valueAnimation = $elt->firstChild->firstChild->getAttribute('data-animation-type');
            $valueAnimation .= '-tap';
            $elt->firstChild->firstChild->removeAttribute('data-animation-type');
            $elt->firstChild->firstChild->setAttribute('data-animation-type-tap', $valueAnimation);
        }

        return $dom->saveHTML();
    }

    /**
     * @param Slider $slide
     * @param string $nameFolder
     */
    public function getPopins($slide, $nameFolder)
    {
        if ($this->popins != '') {
            $aPopin = $this->getLinkedPopin($slide->getContent(), $nameFolder);
            if (count($aPopin) > 0) {
                foreach ($aPopin as $key => $item) {
                    $contentPop = $item['content'];
                    $popName = $item['name'];
                    // download images popin backgrounds
                    $bgPopin = $this->downloadBgPopin($nameFolder, $contentPop, $key);
                    $imgPopin = $this->downloadImagesPopin($nameFolder, $popName, $bgPopin);
                    $videoPop = $this->generateVideo($imgPopin, $nameFolder);
                    $animationPop = $this->generateAnimation($videoPop);
                    $this->fs->dumpFile("$this->wideDir/$this->idRev/$nameFolder/popup/$popName.html", $animationPop);
                }
            }
        }
    }

    /**
     * @param string $html
     *
     * @return string
     */
    public function addAttributeToPopinInScreen($html)
    {
        $veeva = $this->wideDir;
        $dom = $this->util->newDomDocument($html);
        $xpath = new \DOMXPath($dom);
        $listLinkedPops = $xpath->query('//*[@data-popup]');
        if (null != $listLinkedPops) {

            $bgBtnClose = $this->param->getDataBgBtnClose();
            $bgColorOverlay = $this->param->getDataBgRefOverlaycolor();

            if (null !== $bgBtnClose && '' !== $bgBtnClose) {
                $btnTab = explode('/', $bgBtnClose);
                $urlHttp = explode('/uploads/', $bgBtnClose);
                $pathAbsolute = $this->media.$urlHttp[1];
                $nameOrigBtn = $btnTab[count($btnTab) - 1];
                if ($this->fs->exists($pathAbsolute)) {
                    $this->fs->copy(
                        $pathAbsolute,
                        "$veeva/$this->idRev/$this->shared/theme/theme1/images/$nameOrigBtn"
                    );
                }
                $bgBtnClose = "../shared/$this->shared/theme/theme1/images/$nameOrigBtn";
            }

            $overlayStyle = '';
            if (null !== $bgColorOverlay && '' !== $bgColorOverlay) {
                $bgColorOverlay = "background-color: $bgColorOverlay";
                $overlayStyle = "style=\"$bgColorOverlay\"";
            }

            $html = $this->util->renderView(
                '@Presentation/veeva-wide/popup.html.twig',
                array(
                    'overlay' => $overlayStyle,
                    'close' => $bgBtnClose,
                    'shared' => $this->shared,
                )
            );

            $this->fs->dumpFile("$veeva/$this->idRev/$this->shared/theme/theme1/popup/popup.html", $html);

            /** @var \DOMElement $elt */
            foreach ($listLinkedPops as $elt) {
                $elt->setAttribute('data-toggle', 'modal');
                $namePopin = $elt->getAttribute('data-popup');
                $elt->setAttribute('data-target', $namePopin);
            }
        }

        return $dom->saveHTML();
    }

    /**
     * @param string $html
     * @param string $nameFolder
     *
     * @return array
     */
    public function getLinkedPopin($html, $nameFolder)
    {
        $objPopins = array();
        $dom = new \DomDocument();
        $dom->loadHTML('<?xml encoding="UTF-8">'.$html);
        $xpath = new \DOMXPath($dom);
        $listLinkedPops = $xpath->query("//*[contains(@id, 'linkedpopin')]");
        /** @var \DOMElement $elt */
        foreach ($listLinkedPops as $elt) {
            $class = $elt->getAttribute('class');
            $start = explode(' ', $class);
            $oPopin = array();
            if (isset($start[1])) {
                $doc = new \DomDocument();
                $doc->loadHTML('<?xml encoding="UTF-8">'.$this->popins);
                $xpath = new \DOMXPath($doc);
                $linkedPopin = $xpath->query("//*[contains(@class, '".$start[1]."')]")->item(0);
                $oPopin['popin-name'] = $linkedPopin->getAttribute('data-popin-name');
                $oPopin['name'] = $start[1];
                $tmpDom = new \DOMDocument();
                $tmpDom->appendChild($tmpDom->importNode($linkedPopin, true));
                $contentPopin = trim($tmpDom->saveHTML());
                $oPopin['content'] = $this->generatePdfLink($contentPopin, $nameFolder);

                if (!in_array($oPopin, $objPopins)) {
                    array_push($objPopins, $oPopin);
                }
            }
        }

        return $objPopins;
    }

    /**
     * Get Rcp.
     *
     * @param int $idPres
     * @param int $idRev
     *
     * @return string|array
     */
    public function generateRcp($idPres, $idRev)
    {
        $rcp = '';

        $em = $this->container->get('doctrine')->getManager();
        $rev = $em->find('PresentationBundle:Revision', $idRev);
        $veeva = "$this->wideDir/$idRev";

        /** @var Presentation $pres */
        $pdfList = $rev->getPdf();
        foreach ($pdfList as $pdf) {
            /** @var Pdf $pdf */
            $url = parse_url($pdf->getUrl());
            $path = explode('/', $url['path']);
            $pdfName = $path[count($path) - 1];

            $rcp .= '<li><a data-pdf data-file-name="'.$pdfName.'">'.$pdf->getTitle().'</a></li>';

            $pdfPath = explode('/uploads/', $url['path']);
            if (count($pdfPath) > 0) {
                $file = "$this->media".$pdfPath[1];
                if ($this->fs->exists($file)) {
                    $this->fs->copy($file, "$veeva/$this->shared/theme/theme1/pdf/$pdfName");
                }
            }
        }

        $html = $this->util->renderView(
            '@Presentation/veeva-wide/rcp.html.twig',
            array(
                'shared' => $this->shared,
                'close' => $this->reference->bgBtnClose,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/theme/theme1/rcp/rcp.html", $html);

        if ('' === $rcp) {
            return '';
        }

        return $rcp;
    }

    /**
     * Set parameters (logo presentation, ...)
     * and render templates (main-theme.css.twig, main.css.twig, reference.css.twig, popup.css.twig, ...).
     */
    public function setSharedResources()
    {
        /** @var Menu $menu */
        $menu = $this->menu;

        $veeva = "$this->wideDir/$this->idRev";
        $this->parameter = new Parameter($this->container, $this->fs, $this->idRev, $this->param, $this->shared);

        $this->parameter->injectProperties();
        $this->parameter->downloadRcpLogo();
        $this->parameter->downloadPresLogo();
        $this->parameter->downloadFontsMenu();
        $this->parameter->downloadHomeLogo();

        $appJs = $this->util->renderView(
            '@Presentation/veeva-wide/app.js.twig',
            array(
                'shared' => $this->shared,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/js/app.js", $appJs);
        if (!empty($menu)) {
            $highlight = $menu->getHighlight();
        } else {
            $highlight = '';
        }
        if ('highlight' != $highlight) {
            $highlight = null;
        }
        $mainTheme = $this->util->renderView(
            '@Presentation/veeva-wide/main-theme.css.twig',
            array(
                'shared' => $this->shared,
                'selected' => $highlight,
                'logoRcp' => $this->parameter->logoRcp,
                'logoHome' => $this->parameter->logoHome,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/theme/theme1/css/main.css", $mainTheme);

        $mainCss = $this->util->renderView(
            '@Presentation/veeva-wide/main.css.twig',
            array(
                'shared' => $this->shared,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/css/main.css", $mainCss);

        $popupCss = $this->util->renderView(
            '@Presentation/veeva-wide/popup.css.twig',
            array(
                'shared' => $this->shared,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/theme/theme1/popup/popup.css", $popupCss);

        $rcpCss = $this->util->renderView(
            '@Presentation/veeva-wide/rcp.css.twig',
            array(
                'shared' => $this->shared,
                'bgColorOverlay' => $this->reference->bgColorOverlay,
                'closePop' => $this->reference->bgBtnClose,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/theme/theme1/rcp/rcp.css", $rcpCss);

        $refCss = $this->util->renderView(
            '@Presentation/veeva-wide/reference.css.twig',
            array(
                'shared' => $this->shared,
            )
        );
        $this->fs->dumpFile("$veeva/$this->shared/theme/theme1/reference/reference.css", $refCss);

        if (null != $menu) {
            $menuColor = $menu->getMenuColor();
            $fontColor = $menu->getFontColor();
            $itemColor = $menu->getItemColor();
            $highlight = $menu->getHighlight();

            $content = $this->util->renderView(
                '@Presentation/veeva-wide/menu.css.twig',
                array(
                    'menuColor' => $menuColor,
                    'itemColor' => $itemColor,
                    'fontColor' => $fontColor,
                    'highlight' => $highlight,
                    'logo' => '',
                    'logoRef' => '', // $this->reference->logo,
                    'fontFamily' => $this->parameter->menuFontFamily,
                    'fontSize' => $this->parameter->menuFontSize,
                )
            );

            $menuCss = "$veeva/$this->shared/css/menu.css";
            $this->fs->dumpFile($menuCss, $content);
        }

        if ($this->currentUrl == 'merck') {
            if ($this->fs->exists("$veeva/$this->shared/css/editor.css")) {
                $this->fs->remove("$veeva/$this->shared/css/editor.css");
            }

            $merckDirectory = $this->container->getParameter('css_merck');
            if ($this->fs->exists("$merckDirectory/editor.css")) {
                $this->fs->copy("$merckDirectory/editor.css", "$veeva/$this->shared/css/editor.css");
            }
        }
    }

    /**
     * @param string $folder
     * @param string $popName
     * @param string $content
     *
     * @return string
     */
    public function downloadImagesPopin($folder, $popName, $content)
    {
        $veeva = $this->wideDir; // output

        $document = $this->util->newDomDocument($content);
        $images = $document->getElementsByTagName('img');

        for ($i = 0; $i < $images->length; ++$i) {
            $src = $images->item($i)->getAttribute('src');
            $extension = '.'.substr($src, -3);
            $fullPath = $this->media.explode('/uploads/', $src)[1];
            if ($this->fs->exists($fullPath)) {
                $targetImage = $veeva."/$this->idRev/$folder/images/popin-image-{$popName}-".($i + 1).$extension;
                $this->fs->copy($fullPath, $targetImage);
                $images->item($i)->setAttribute('src', "./images/popin-image-{$popName}-".($i + 1).$extension);
            }
        }

        return $document->saveHTML();
    }

    /**
     * @param string $nameFolder
     * @param string $content
     * @param int $index
     *
     * @return mixed
     */
    public function downloadBgPopin($nameFolder, $content, $index)
    {
        $document = $this->getImages('popin', $nameFolder, $content, $index);

        return $document->saveHTML();
    }

    /**
     * Generate References.
     */
    public function generateReferences()
    {
        $veeva = "$this->wideDir/$this->idRev";

        $this->reference = new Reference($this->container, $this->fs, $this->idRev, $this->param, $this->shared);
        $this->reference->setUtil($this->util);
        $this->reference->injectProperties();

        $html = $this->reference->html();

        $ref = "$veeva/$this->shared/theme/theme1/reference/reference.html";
        $this->fs->dumpFile($ref, $html);
    }

    /**
     * Download image tags (<img>).
     *
     * @param string $folder
     * @param Slider $slider
     *
     * @return Slider|array
     */
    public function downloadImages($folder, $slider)
    {

        $veeva = $this->wideDir; // output
        $document = $this->util->newDomDocument($slider->getContent());
        $images = $document->getElementsByTagName('img');
        $hasImg = false;
        for ($i = 0; $i < $images->length; ++$i) {
            if ($images->item($i)->getAttribute('src') != '') {
                $hasImg = true;
                $src = $images->item($i)->getAttribute('src');
                $extension = '.'.substr($src, -3);
                $fullPath = $this->media.explode('/uploads/', $src)[1];
                if ($this->fs->exists($fullPath)) {
                    $targetImage = $veeva."/$this->idRev/$folder/images/image".($i + 1).$extension;
                    $this->fs->copy($fullPath, $targetImage);
                    $images->item($i)->setAttribute('src', './images/image'.($i + 1).$extension);
                }
            }
        }

        if ($hasImg) {
            $html = $document->saveHTML($document->documentElement);
            $crawler = new Crawler();
            $crawler->addHtmlContent($html);
            $slider->setContent($crawler->filter('body')->html());

        }

        return $slider;
    }

    /**
     * @param string $imageName
     * @param string $nameFolder
     * @param string $content
     * @param null|int $index
     *
     * @return \DOMDocument
     */
    public function getImages($imageName, $nameFolder, $content, $index = null)
    {
        $veeva = $this->wideDir; // output

        $document = $this->util->newDomDocument($content);
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
                $imgNewPath = "images/{$imageName}-bg-img{$ext}";
                $this->fs->copy($fullPath, "{$veeva}/{$this->idRev}/{$nameFolder}/{$imgNewPath}");

                if ($section->hasAttribute('style')) {
                    $style = $section->getAttribute('style');
                    $style = "{$style} background-image: url('{$imgNewPath}');";
                    $section->setAttribute('style', $style);
                } else {
                    $style = "background-image: url('{$imgNewPath}');";
                    $section->setAttribute('style', $style);
                }

                if ($section->hasAttribute('data-bg-screen-img')) {
                    $section->removeAttribute('data-bg-screen-img');
                }

                if ($section->hasAttribute('data-bg-img')) {
                    $section->removeAttribute('data-bg-img');
                }
            }
        }

        return $document;
    }

    /**
     * Download background image tags.
     *
     * @param string $nameFolder
     * @param Slider $slider
     *
     * @return Slider
     */
    public function downloadBackgroundImage(string $nameFolder, Slider $slider)
    {
        $document = $this->getImages('screen', $nameFolder, $slider->getContent());
        $html = $document->saveHTML($document->documentElement);

        $crawler = new Crawler();
        $crawler->addHtmlContent($html);
        $slider->setContent($crawler->filter('body')->html());

        return $slider;
    }

    /**
     * Get data ids from thumbs.
     *
     * @param array $thumbs
     * @param string $pattern
     *
     * @return array
     */
    public function getDataIds(array $thumbs, $pattern)
    {
        $dataIds = array();
        foreach ($thumbs as $ids => $thumb) {
            $dataIds["$thumb"] = str_replace([$pattern, '.jpg'], '', $thumb);
        }

        return $dataIds;
    }

    /**
     * @param array $folders
     * @param array $dataIds
     * @param string $thumbs
     * @param string $pattern
     * @param string $imageName
     */
    public function phantom(array $folders, array $dataIds, $thumbs, $pattern, $imageName)
    {
        $veeva = $this->wideDir;

        $cmd = "cd $thumbs; cd $this->idPres-$this->idRev; cd slides; ls | grep '$pattern*'";
        exec($cmd, $output, $returnVar);

        if (0 == $returnVar) {
            $map = $this->getDataIds($output, $pattern);
            $intersect = array_intersect($map, $dataIds);
            if (count($intersect) > 0) {
                foreach ($dataIds as $i => $sectionId) {
                    $key = array_search($sectionId, $intersect);
                    if ($key != false) {
                        $path = "$thumbs/$this->idPres-$this->idRev/slides/$key";

                        if ($this->fs->exists($path)) {
                            $target = "$veeva/$this->idRev/$folders[$i]/$folders[$i]-$imageName.jpg";
                            $this->fs->copy($path, $target);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param array $folders
     */
    public function generateImages(array $folders)
    {
        // $dataIs contains sections Ids
        $dataIds = array();
        $crawler = new Crawler();

        /** @var Slider $slide */
        foreach ($this->slides as $idx => $slide) {
            $crawler->addHtmlContent($slide->getContent());
            $section = $crawler->filter('section');
            if ($section->count() > 0) {
                $dataIds[] = $section->attr('data-id');
            }
            $crawler->clear();
        }

        $web = $this->container->getParameter('web_directory');
        $presThumbs = $this->container->getParameter('presentations_thumbnails');
        $thumbs = "$web/$presThumbs";
        $this->phantom($folders, $dataIds, $thumbs, 'screen-200-', 'thumb');
        $this->phantom($folders, $dataIds, $thumbs, 'screen-', 'full');
    }

    /**
     * @param array $tree
     * @param array $names
     */
    public function generateSlidesHtml(array $tree, array $names)
    {
        for ($i = 0; $i < count($this->slides); ++$i) {
            $this->createSlideHtml($names[$i], $this->slides[$i], $tree); // $name, $slide
        }
    }

    /**
     * Generate an array of arrays that contains the presentation's tree
     * for example [[s1], [s2, s2.1, s2.2], [s3], [s4]].
     *
     * @param array $folders
     *
     * @return array
     */
    public function generateSlidesTree(array $folders)
    {
        $tree = array();
        $parentIdx = -1; // init the parent index
        for ($i = 0; $i < count($this->slides); ++$i) {
            /** @var Slider $slide */
            $slide = $this->slides[$i];
            if (null == $slide->getParent()) {
                $tree["$i"][] = $folders[$i]; // $tree associative array
                $parentIdx = $i;
            } else {
                $tree["$parentIdx"][] = $folders[$i];
            }
        }

        return $tree;
    }

    /**
     * @param array $tree
     */
    public function generateMenuHtml(array $tree)
    {
        libxml_use_internal_errors(true);
        $document = new \DOMDocument();
        libxml_clear_errors();

        $enableSubmenu = $this->parameter->enableSubmenu;
        $enableSubmenuWidth = $this->parameter->enableSubmenuWidth;

        if (!empty($enableSubmenu)) {
            if ($enableSubmenu == 'false') {
                $enableSubmenu = 'hide-menu';
            }
        } else {
            $enableSubmenu = '';
        }

        if (!empty($enableSubmenuWidth)) {
            if ($enableSubmenuWidth == 'true') {
                $enableSubmenuWidth = 'fullWidthSubmenu';
            }
        } else {
            $enableSubmenuWidth = '';
        }

        $home = $document->createElement('a');
        $home->setAttribute('class', 'home');
        $home->setAttribute('data-link', $tree[0][0]);
        $document->appendChild($home);

        $maskMenu = $document->createElement('div');
        $maskMenu->setAttribute('id', 'maskMenu');
        $document->appendChild($maskMenu);

        $logo = $document->createElement('div');
        $logo->setAttribute('class', 'logo');
        $logo->setAttribute('id', 'logo');
        if (!empty($this->parameter->logoPres)) {
            $imgLogo = $document->createElement('img');
            $imgLogo->setAttribute('class', 'logoImg');
            $imgLogo->setAttribute('src', $this->parameter->logoPres);
            $logo->appendChild($imgLogo);
        }

        $document->appendChild($logo);

        $minMenu = $document->createElement('div');
        $minMenu->setAttribute('class', 'minMenu');
        $minMenu->setAttribute('data-prevent-tap', 'true');

        $ref = $document->createElement('div');
        $ref->setAttribute('class', 'ref');
        $ref->setAttribute('data-prevent-tap', 'true');

        $doc = $document->createElement('div');
        $doc->setAttribute('class', 'doc');
        $doc->setAttribute('data-prevent-tap', 'true');

        $iconDoc = $document->createElement('img');
        if (!empty($this->parameter->logoRcp)) {
            $iconDoc->setAttribute('src', $this->parameter->logoRcp);
            $iconDoc->setAttribute('class', 'fulldata');
        } else {
            $iconDoc->setAttribute('src', '../shared/'.$this->shared.'/theme/theme1/images/ref.png');
            $iconDoc->setAttribute('class', 'emptydata');
        }
        $doc->appendChild($iconDoc);

        $iconRef = $document->createElement('img');
        if (!empty($this->reference->logo)) {
            $iconRefPath = '../shared'.'/'.$this->shared.'/'.str_replace('../', '', $this->reference->logo);
            $iconRef->setAttribute('src', $iconRefPath);
            $iconRef->setAttribute('class', 'fulldata');
        } else {
            $iconRef->setAttribute('src', '../shared/'.$this->shared.'/theme/theme1/images/doc.png');
            $iconRef->setAttribute('class', 'emptydata');
        }
        $ref->appendChild($iconRef);

        $minMenu->appendChild($ref);
        $minMenu->appendChild($doc);
        $document->appendChild($minMenu);

        $maxMenu = $document->createElement('div');
        $maxMenu->setAttribute('class', 'maxMenu');
        $a0 = $document->createElement('a');
        $a0->setAttribute('data-link', '0');
        $maxMenu->appendChild($a0);

        $warraper = $document->createElement('div');
        $warraper->setAttribute('id', 'warraper');
        $maxMenu->appendChild($warraper);

        $scrollerMenu = $document->createElement('div');
        $scrollerMenu->setAttribute('warraper', 'scrollerMenu');
        $warraper->appendChild($scrollerMenu);

        $chapter = 0;
        $cpt = 0;

        $slice = array_slice($tree, 1, count($tree), true); // skip the first element

        $screenNames = array();
        for ($k = 1; $k < count($this->slides); ++$k) {
            ++$cpt;
            /** @var Slider $slide */
            $slide = $this->slides[$k];
            $screenNames[$k - 1]['screenName'] = $slide->getScreenName();
            $screenNames[$k - 1]['chapterName'] = $slide->getChapterName();
        }

        $idx = 1;
        foreach ($slice as $paper) {
            $chapterValue = '';
            ++$chapter;
            $dataChapter = $chapter * 10;
            $a = $document->createElement('a');
            $a->setAttribute('data-link', $paper[0]);
            $a->setAttribute('data-chapter', $dataChapter);

            $screenName = $screenNames[$idx - 1]['screenName'];
            $chapterName = $screenNames[$idx - 1]['chapterName'];

            $nodeValue = $screenName;
            if (empty($screenName)) {
                $nodeValue = 'Slide '.($chapter + 1);
            }
            if (!empty($chapterName)) {
                $chapterValue = $nodeValue;
                $nodeValue = $chapterName;
            }

            $a->nodeValue = htmlspecialchars($nodeValue);
            $scrollerMenu->appendChild($a);

            $subMenu = $document->createElement('div');
            $subMenu->setAttribute('data-chapter', $dataChapter);
            $subMenu->setAttribute('class', 'subMenu '.$enableSubmenu);
            $subMenu->setAttribute('style', 'display: none;');

            $warraperSub = $document->createElement('div');
            $warraperSub->setAttribute('id', 'warraperSub');
            $warraperSub->setAttribute('class', $enableSubmenuWidth);
            $subMenu->appendChild($warraperSub);

            $scrollerSub = $document->createElement('div');
            $scrollerSub->setAttribute('id', 'scrollerSub');
            $warraperSub->appendChild($scrollerSub);

            if (!empty($chapterValue)) {
                $a = $document->createElement('a');
                $a->setAttribute('data-link', $paper[0]);
                $a->nodeValue = $chapterValue;
                $scrollerSub->appendChild($a);
                $document->appendChild($subMenu);
            }

            if (count($paper) > 1) {
                for ($i = 1; $i < count($paper); ++$i) {
                    $a = $document->createElement('a');
                    $a->setAttribute('data-link', $paper[$i]);
                    $a->nodeValue = 'Slide_'.($chapter + 1).".$i";
                    ++$idx;
                    if (!empty($screenNames[$idx - 1]['screenName'])) {
                        $a->nodeValue = $screenNames[$idx - 1]['screenName'];
                    }
                    $scrollerSub->appendChild($a);
                }
                $document->appendChild($subMenu);
            }
            ++$idx;
        }
        $document->appendChild($maxMenu);

        $this->fs->dumpFile("$this->wideDir/$this->idRev/$this->shared/theme/theme1/menu.html", $document->saveHTML());
    }

    /**
     * Create slide.html.
     *
     * @param string $name
     * @param Slider $slide
     * @param array $tree
     */
    public function createSlideHtml($name, $slide, $tree)
    {
        $veeva = $this->wideDir; // output

        $document = $this->util->newDomDocument($slide->getContent());
        $section = $document->getElementsByTagName('section');

        // delete old menu
        $menu = $document->getElementById('wrapperMenuScroll');
        if (!empty($menu)) {
            $section->item(0)->removeChild($menu);
        }

        $sections = $document->getElementsByTagName('section');
        if ($sections->length > 0) {
            $section = $sections->item(0);
            $section->setAttribute('class', 'present');
        }

        $xpath = new \DomXpath($document);
        $slBlocks = $xpath->query('//*[@data-link]');
        /** @var \DOMNode $slBlock */
        foreach ($slBlocks as $slBlock) {
            /** @var \DOMAttr $attr */
            foreach ($slBlock->attributes as $attr) {
                if ('data-link' === $attr->name) {
                    $folderName = $this->getDataLink($tree, $attr->value);
                    $attr->value = $folderName;
                }
            }
        }

        $crawler = new Crawler();
        $html = $document->saveHTML($document->documentElement).PHP_EOL.PHP_EOL;
        $crawler->addHtmlContent($html);

        $this->util->removeElement($crawler, '.BlockRef');
        $this->util->removeElement($crawler, '.BlockRefOverlay');
        $this->util->removeElement($crawler, '.sl-block .ui-rotatable-handle');

        $exist = $this->getSurvey($html, $name);
        $body = $crawler->filter('body')->html();

        $file = "$veeva/$this->idRev/$name/$name.html";
        $this->fs->touch($file);
        $content = $this->util->renderView(
            '@Presentation/veeva-wide/veeva.html.twig',
            array(
                'content' => $body,
                'shared' => $this->shared,
                'survey' => $exist,
            )
        );
        $this->fs->dumpFile($file, $content);
    }

    /**
     * @param array $tree
     */
    public function generateFlowJs(array $tree)
    {
        $veeva = $this->wideDir; // output

        // get Rcp
        $rcp = $this->generateRcp($this->idPres, $this->idRev);

        $flows = new Flows();
        $chapter = $k = 0; // $k is slide counter
        $listRef = '';
        foreach ($tree as $idx => $plan) {
            for ($j = 0; $j < count($tree[$idx]); ++$j) {
                /** @var Slider $slide */
                $slide = $this->slides[$k];
                foreach ($slide->getLinkedReferences() as $ref) {
                    $listRef .= '<li>'.$ref->getCode().$ref->getDescription().'</li>';
                }

                $screen = new Screen($tree[$idx][$j], '', sprintf('%02d', $chapter * 10), $listRef, 'theme1', $rcp);
                $flows->push($screen);

                ++$k;
                // clear $listRef
                $listRef = '';
            }
            ++$chapter;
        }

        $flowsJs = $this->util->renderView(
            '@Presentation/veeva-wide/flows.js.twig',
            array(
                'screens' => $flows->getAtt(),
            )
        );

        $file = "$veeva/$this->idRev/$this->shared/js/flows.js";
        $this->fs->touch($file);
        $this->fs->dumpFile($file, $flowsJs);
    }

    /**
     * Create slide.js file.
     *
     * @param string $name
     */
    public function createSlideJs($name)
    {
        $slideJs = "$this->wideDir/$this->idRev/$name/js/slide.js";
        $content = 'SLIDE={start:function(){return{id:"'.$name.'",flow:"flow1"}}};';

        $this->fs->touch($slideJs);
        $this->fs->dumpFile($slideJs, $content);
    }

    /**
     * Create folder.
     *
     * @param int $i
     *
     * @return string
     */
    public function createFolder($i)
    {
        /** @var Slider $slider */
        $slider = $this->slides[$i];
        /*  if ( $slider->getScreenName()!='' ) {
              $name = $slider->getScreenName();
          } else {*/
        // decimal format
        $index = sprintf('%02d', $i + 1);
        // folder name
        $name = date('dm')."_Presentation_$index".'_01';
        /* }*/
        $this->fs->mkdir($this->wideDir);
        if ($this->fs->exists($this->wideDir)) {
            $this->fs->mirror("$this->framework/slide/css", "$this->wideDir/$this->idRev/$name/css");
            $this->fs->mkdir("$this->wideDir/$this->idRev/$name/images");
            $this->fs->mirror("$this->framework/slide/js", "$this->wideDir/$this->idRev/$name/js");
        }

        return $name;
    }

    /**
     * @param array $tree
     * @param string $dataLink
     *
     * @return string|false
     */
    public function getDataLink(array $tree, $dataLink)
    {
        $j = 0;
        foreach ($tree as $arr) {
            foreach ($arr as $name) {
                ++$j;
                if ($dataLink == $j - 1) {
                    return $name;
                }
            }
        }

        return false;
    }

    /**
     * Generate folders.
     *
     * @return array
     */
    public function generateFolders()
    {
        // names of folders that we will use in flow.js
        $names = array();
        for ($i = 0; $i < count($this->slides); ++$i) {
            $names[] = $this->createFolder($i);
            $this->createSlideJs($names[$i]);

            /** @var Slider $slide */
            $slide = $this->slides[$i];
            $slide = $this->downloadBackgroundImage($names[$i], $slide);
            $slide = $this->downloadImages($names[$i], $slide);

            $html = $this->generatePdfLink($slide->getContent(), $names[$i]);
            $html = $this->generateAnimation($html);
            $html = $this->generateVideo($html, $names[$i]);

            $html = $this->addAttributeToPopinInScreen($html);

            $this->crawler->clear();
            $this->crawler->addHtmlContent($html);
            $slide->setContent($this->crawler->filter('body')->html());

            $this->getPopins($slide, $names[$i]);
        }

        return $names;
    }

    /**
     * Create Veeva directory.
     */
    public function generateSharedResources()
    {
        $veeva = "$this->wideDir/$this->idRev";

        $zipName = $this->zipName;
        $pattern = $this->wideDir.'/'.$zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_*.zip';

        // delete old zips
        $zips = glob($pattern);
        if (count($zips) > 0) {
            for ($i = 0; $i < count($zips); ++$i) {
                $this->fs->remove($zips[$i]);
            }
        }

        if ($this->fs->exists("$veeva.zip")) {
            $this->fs->remove("$veeva.zip");
        }

        if (!$this->fs->exists($veeva)) {
            $this->fs->mkdir($veeva);
        } else {
            $this->fs->remove($veeva);
        }

        $this->fs->mirror("$this->framework/dev_framework_shared", "$veeva/$this->shared");
        $this->fs->rename(
            "$veeva/$this->shared/mcm builder-sr-full.jpg",
            "$veeva/$this->shared/$this->shared-full.jpg"
        );
        $this->fs->rename(
            "$veeva/$this->shared/mcm builder-sr-thumb.jpg",
            "$veeva/$this->shared/$this->shared-thumb.jpg"
        );
    }

    public function initShared()
    {
        $currentDate = $this->currentDate->getTimestamp();
        $this->shared = "shared_$currentDate";
    }

    /**
     * Generate Veeva Wide zip.
     *
     * @param int $idRev
     * @param int $idPres
     * @param array $slides
     * @param string $param
     * @param Menu $menu
     * @param string $popins
     * @param string $currentUrl
     *
     * @return array
     */
    public function zip($idRev, $idPres, $slides, $param, $menu, $popins, $currentUrl)
    {
        $this->idRev = $idRev;
        $this->idPres = $idPres;
        /*        dump($slides);
                die('ok');*/
        $this->slides = $slides;
        $this->menu = $menu;
        $this->popins = $popins;
        $this->currentUrl = $currentUrl;
        $this->param = $this->util->getPresentationParameter($param);

        // init shared with timestamp
        $this->initShared();
        // generate the zip name
        $zipName = $this->getZipName();
        // generate shared Resources
        $this->generateSharedResources();
        // generate references
        $this->generateReferences();
        // generate folders and linkedScreens
        $folders = $this->generateFolders();
        // generate the presentation's tree
        $tree = $this->generateSlidesTree($folders);
        $this->generateSlidesHtml($tree, $folders);
        // set shared resources (shared/css/main.css, ...)
        $this->setSharedResources();
        // generate menu.html
        $this->generateMenuHtml($tree);
        // generate flows.js
        $this->generateFlowJs($tree);
        // generate images + thumbs
        $this->generateImages($folders);
        $this->container->get('doctrine')->getManager()->clear();
        $veeva = $this->wideDir; // output

        $cmd = "cd $veeva/$idRev; ";
        $cmd .= 'for i in */; do zip "${i%/}.zip" -r "$i"; rm -r "$i" ; done;';
        $cmd .= "zip -r ../$zipName.zip ./*";

        exec($cmd, $output, $returnVar);

        $zip = array();
        $zip['name'] = "$zipName.zip";
        $zip['zipPath'] = "$veeva/$zipName.zip";

        if (0 == $returnVar) {
            return $zip;
        }

        $this->errors['zip'] = [];
        $this->errors['zip']['return'] = "An error occurred while generating your zip ($returnVar)";
        $this->errors['zip']['output'] = $output;
        $this->errors['zip']['cmd'] = $cmd;

        return $this->errors;
    }
}
