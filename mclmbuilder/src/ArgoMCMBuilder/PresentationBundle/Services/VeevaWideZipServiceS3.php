<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Objects\Flows;
use ArgoMCMBuilder\PresentationBundle\Objects\ReferenceVeeva;
use ArgoMCMBuilder\PresentationBundle\Objects\Screen;
use Symfony\Component\DomCrawler\Crawler;
use ArgoMCMBuilder\PresentationBundle\Parser\simple_html_dom;
use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Objects\PresentationParameter;
use ArgoMCMBuilder\PresentationBundle\Objects\ReferenceMi;
use ArgoMCMBuilder\PresentationBundle\Objects\Util;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Filesystem\Filesystem;
use ArgoMCMBuilder\PresentationBundle\Objects\ParameterS3;

/*
 * class VeevaWideZipServiceS3
 */

class VeevaWideZipServiceS3
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
    /** @var string[] $backgroundsImages */
    public $backgroundsImages;
    /** @var string[] $names */
    public $names;
    /** @var PresentationParameter $param */
    private $param;
    private $menu;
    private $popins;
    public  $errors;
    public  $currentUrl;
    public  $util;
    public  $currentDate;
    public  $crawler;

    /** @var  AwsMedia awsMedia */
    public $awsMedia;
    public $zipName;
    public $S3;
    public $glob;
    public $css;
    public $wideDir;
    public $media;
    public $framework;
    public $rev;

    /**
     * VeevaWideZipService constructor.
     *
     * @param Filesystem $fileSystem
     * @param Container $container
     */
    public function __construct($fileSystem, $container, $awsMedia)
    {
        $this->fs = $fileSystem;
        $this->container = $container;
        $this->awsMedia = $awsMedia;

        $this->errors = [];
        $this->wideDir = $this->container->getParameter('zip_wide_directory');
        // zip input
        $this->framework = $this->container->getParameter('veeva_wide_framework');
        $this->media = $this->container->getParameter('media_directory');

        $this->backgroundsImages = [];
        $this->names = [];
        $this->crawler = new Crawler();
        $this->currentDate = new \DateTime();
        $this->util = new Util($this->container);

        return $this;
    }

    /**
     * initShared
     */
    public function initShared()
    {
        $currentDate = $this->currentDate->getTimestamp();
        $this->shared = "shared_$currentDate";
        return $currentDate;
    }

    /**
     * @return string
     */

    public function getZipName()
    {
        $em = $this->container->get('doctrine')->getManager();
        $zipName = $em->getRepository('PresentationBundle:Presentation')->getZipName($this->rev->getId());
        $currentDate = new \DateTime();
        $d = $currentDate->getTimestamp();
        $zipName = $zipName['pres'].'_'.$zipName['company'].'_'.$zipName['country'].'_'.$d.'_'.$zipName['version'];

        return $zipName;
    }


    /**
     * Create Veeva directory.
     */
    public function generateSharedResources()
    {


        $em = $this->container->get('doctrine')->getManager();
        $s3Folder = $em->getRepository('PresentationBundle:Revision')->getS3FolderVeevaByRev($this->rev->getId());
        $shared_timestamp = '';
        if (!empty($s3Folder['dataFolderVeevaS3'])) {
            $shared = $s3Folder['dataFolderVeevaS3'];
            $shared = explode('_', $shared);
            $sizeofShared = sizeof($shared);
            $inedxShared = $sizeofShared - 2;
            $shared_timestamp = $shared[$inedxShared];
        }

        if ($this->awsMedia->getExistFolderS3(
            $this->S3,
            $this->awsMedia->companyName."/zip/veeva-wide/".$s3Folder['dataFolderVeevaS3']."/shared_".$shared_timestamp
            ."/css/editor.css"
        )) {
            $this->awsMedia->deleteS3Object($this->S3, $this->awsMedia->companyName."/zip/veeva-wide/".$s3Folder['dataFolderVeevaS3']."/");
        }
        $saveFolder = $this->awsMedia->cloneSourceVeeva(
            $this->S3,
            "$this->zipName/$this->shared",
            'zip_input/frameworkVeevaWide/dev_framework_shared',
            $this->awsMedia->companyName.'/zip/veeva-wide/'
        );
        if ($saveFolder) {
            $revision = $em->getRepository('PresentationBundle:Revision')->find($this->rev->getId());
            $revision->setDataFolderVeevaS3($this->zipName);
            $em->flush();
        }

    }

    /**
     * Generate References.
     */
    public function generateReferences()
    {
        $this->reference = new ReferenceVeeva(
            $this->container,
            $this->fs,
            $this->rev->getId(),
            $this->param,
            $this->shared,
            $this->S3,
            $this->zipName,
            $this->awsMedia
        );
        $this->reference->setUtil($this->util);
        $this->reference->injectProperties();

        $ref = $this->reference->htmlVeeva();
        $fileName = "$this->shared/theme/theme1/reference/reference.html";
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $ref, $fileName);
    }

    /**
     * Create folder.
     *
     * @param int $i
     *
     * @return string
     */
    public function createFolder($i, $currentDate)
    {
        /** @var Slider $slider */
        /*  $slider = $this->slides[$i];*/
        //todo keyMessage or ChapterName
        /* if ('' != $slider->getKeyMessage()) {
             $name = $slider->getKeyMessage();
         } else {*/
        // decimal format
        $index = sprintf('%02d', $i + 1);
        // folder name
        $name = $currentDate."_Presentation_$index".'_01';

        /* }*/

        return $name;
    }

    /**
     * Create slide.js file.
     *
     * @param string $name
     */
    public function createSlideJs($name)
    {
        $contentJS = 'SLIDE={start:function(){return{id:"'.$name.'",flow:"flow1"}}};';
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $contentJS, "$name/js/slide.js");
    }

    /**
     * @param \stdClass $slide
     * @param $type
     */
    public function downloadBackgroundImage(\stdClass $slide, $type, $name = null): void
    {
        if ($type == "popin") {
            $popin = 'popin/';
        } else {
            $popin = '';
        }
        if (property_exists($slide, 'attributes')) {
            $attributes = $slide->{'attributes'};
            $fileName = $this->parameter->backgroundPres;
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
                    $fileName = $name."/images/$popin$matches[1].$matches[2]";
                }
                $this->awsMedia->copyFileVeevaInS3($this->S3, $this->zipName, $sourceName, $fileName);
                $attributes->{'data-bg-screen-img'} = "../$fileName";

                $attributes->{'data-background-image'} = "../".$this->parameter->backgroundPres;
                if (property_exists($slide, 'styles')) {
                    $styles = $slide->{'styles'};
                    if (property_exists($styles, 'background-image')) {
                        $styles->{'background-image'} = "url('../".$fileName."')";
                    }
                }
            }

        } else {
            trigger_error('Error is json structure: property "attributes" does not exist', E_USER_ERROR);
        }
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
                        if ($type == "popin") {
                           // dump($data);
                        }
                        $this->setNewPathVeeva($data, 'src', "$screenId/images$popin", "image");
                        break;
                    case 'video':
                        $data = $block->{'blockStyle'}->{'blockcontent'}->{'data'};
                        $this->setNewPathVeeva($data, 'source', "$screenId/video$popin", "video");
                        $block->{'attributes'}->{'data-video'} = $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'source'};
                        $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'attributes'}->{'controls'} = "controls";
                        /*$poster = $block->{'attributes'};
                        $this->setNewPathVeeva($poster, 'data-video-poster', "$screenId/video", "thumbvideo");*/
                        break;
                    default:
                        break;
                }
                // linked PDF
                if (property_exists($block->{'attributes'}, 'data-pdf-link')) {
                    $src = $block->{'attributes'}->{'data-pdf-link'};
                    $fileResult = $this->util->getFileNameByPattern($src, "$screenId/pdf$popin", "pdf");
                    $this->awsMedia->copyFileVeevaInS3(
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
     * @param \stdClass $data
     * @param string $attr
     * @param string $dir
     */
    public function setNewPathVeeva(\stdClass $data, string $attr, string $dir, $type): void
    {
        $src = $data->{$attr};
        $fileResult = $this->util->getFileNameByPattern($src, $dir, $type);
        $this->awsMedia->copyFileVeevaInS3(
            $this->S3,
            $this->zipName,
            $fileResult['sourceName'],
            $fileResult['fileName']
        );
        $data->{$attr} = '../'.$fileResult['fileName'];

    }

    /**
     * @param \stdClass $slide
     */
    public function generateAnimation(\stdClass $slide)
    {
        $html = '';
        if (property_exists($slide, 'blocks')) {
            $blocks = (array)$slide->{'blocks'};
            foreach ($blocks as $i => $block) {
                if (property_exists($block->{'attributes'}, "data-block-anim")) {
                    if ($block->{'attributes'}->{'data-block-anim'} == "tap") {
                        $block->{'blockStyle'}->{'blockcontent'}->{'attributes'}->{'data-animation-type-tap'} =
                            $block->{'blockStyle'}->{'blockcontent'}->{'attributes'}->{'data-animation-type'}."-tap";
                        $html .= $block->{'blockStyle'}->{'blockcontent'}->{'attributes'}->{'data-animation-type-tap'};
                    }
                }
            }

            return $html;
        }
    }

    /**
     * @param $slide
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

    /**
     * @param $label
     * @param $popins
     * @param $dataPops
     */
    public function generateContentPopins($label, $popins, $dataPops)
    {
        foreach ($dataPops as $key => $dataPop) {
            if (in_array($dataPop->{"attributes"}->{"data-id"}, $popins)) {
                $this->downloadMedias($label, $dataPop, 'popin');
                $dataPop = (object)(array)$dataPop;
                if($this->param->getDataBgPopupImg() == $dataPop->{"attributes"}->{"data-bg-image"}){
                    $dataPop->{"attributes"}->{"data-bg-image"} = "url('../".$this->parameter->backgroundPop."')";
                }else{
//                    $bgImg = $dataPop->{"attributes"}->{"data-bg-image"};
//                    $sourceName = "";
//                    $fileName = "";
//                    $pattern = '/.*\/(.*?)\.(.*)/';
//                    $matches = array();
//                    if (preg_match($pattern, $bgImg, $matches)) {
//                        $sourceName = "/image/$matches[1].$matches[2]";
//                        $fileName = $label."/images/popin/$matches[1].$matches[2]";
//                    }
                    $this->setNewPathVeeva($dataPop->{"attributes"}, 'data-bg-image', "$label/images/popin", "image");

                    //$this->awsMedia->copyFileVeevaInS3($this->S3, $this->zipName, $sourceName, $fileName);
                    //$dataPop->{"attributes"}->{"data-bg-image"} = $fileName;
                }
                $contentPopin = $this->generateAnimation($dataPop);
                $popName = $dataPop->{"attributes"}->{"data-id"};
                $this->awsMedia->putJsonInS3($this->S3, $this->zipName, $dataPop, "$label/popup/$popName.json", "veeva-wide");
            }

        }

    }

    /**
     * Generate folders.
     *
     * @return array
     */
    public function generateFolders($currentDate)
    {
        // names of folders that we will use in flow.js

        $this->slides = (array)json_decode($this->rev->getSlides());
        $dataPops = (array)json_decode($this->rev->getPopin());
        $i = 0;
	    foreach ($this->generateLabels() as $label => $slide) {

            $this->names[] = $this->createFolder($i, $currentDate);
            $this->createSlideJs($this->names[$i]);
            $this->downloadBackgroundImage($slide, 'slide', $this->names[$i]);
            $this->downloadMedias($this->names[$i], $slide, 'slide');
            $this->generateAnimation($slide);
            //Get Popin Linké
            $popins = $this->getLinkedPopin($slide);
            $this->generateContentPopins($this->names[$i], $popins, $dataPops);
			$i++;
            /*


			 $html = $this->generateAnimation($html);

			 $html = $this->addAttributeToPopinInScreen($html);

			 $this->crawler->clear();
			 $this->crawler->addHtmlContent($html);
			 $slide->setContent($this->crawler->filter('body')->html());

             $this->getPopins($slide, $names[$i]);*/
        }

        return $this->names;
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
		$i = 0;
		foreach ($this->generateLabels() as $label => $slide) {
			//dump($slide);
//		//for ($i = 0; $i < count($this->slides); ++$i) {
//			/** @var Slider $slide */
//			$slide = $this->slides[$i];

			if (!property_exists($slide, "isChild")) {
				$tree["$i"][] = $folders[$i]; // $tree associative array
				$parentIdx = $i;
			} else {
				$tree["$parentIdx"][] = $folders[$i];
			}
			$i++;
		}

		return $tree;
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
	 * @param array $tree
	 * @param array $names
	 */
	public function generateSlidesHtml(array $tree, array $names)
	{
		$i = 0;
		foreach ($this->generateLabels() as $label => $slide) {
            $this->generateLinkedScreen($slide);
            $this->createSlideHtml($names[$i], $slide, $tree); // $name, $slide
            $this->awsMedia->putJsonInS3($this->S3, $this->zipName, $slide, $names[$i]."/screen.json", "veeva-wide");
			//$this->createSlideHtml($names[$i], $this->slides[$i], $tree); // $name, $slide
			$i++;
		}
	}

    /**
     * Create slide.html.
     *
     * @param string $name
     * @param \stdClass $slide
     * @param array  $tree
     */
    public function createSlideHtml($name, $slide, $tree)
    {
        $content = $this->util->renderView('@Presentation/veeva-wide/veeva.html.twig', array(
            'shared'    => $this->shared
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $content, "$name/$name.html");
    }

    /**
     * @param string $content
     * @param string $nameFolder
     *
     * @return bool
     */
//    public function getSurvey($slide, $nameFolder)
//    {
//        $exist = false;
//        foreach($slide->{"blocks"} as $block) :
//        if ($block->type == "survey") {
//            $this->awsMedia->cloneSourceSurvey(
//                $this->S3,
//                $this->zipName,
//                "veeva-wide",
//                "$nameFolder"
//            );
//                $exist = true;
//                break;
//        }
//        endforeach;
//
//        return $exist;
//    }

    /**
     * Set parameters (logo presentation, ...)
     * and render templates (main-theme.css.twig, main.css.twig, reference.css.twig, popup.css.twig, ...).
     */
    public function setSharedResources()
    {
        /** @var Menu $menu */
        $menu = $this->menu;

        $veeva = "$this->wideDir/$this->idRev";
        $this->parameter = new ParameterS3($this->container, $this->awsMedia, $this->idRev, $this->param, $this->shared, $this->zipName);

        $this->parameter->injectProperties();
        $this->parameter->downloadRcpLogo();
        $this->parameter->downloadPresLogo();
        //$this->parameter->downloadFontsMenu();
        $this->parameter->downloadHomeLogo();
        $this->parameter->downloadBackgroundPres();
        $this->parameter->downloadBackgroundPop();
        $this->parameter->downloadRefLogo();

        $appJs = $this->util->renderView('@Presentation/veeva-wide/app.js.twig', array(
            'shared' => $this->shared,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $appJs, "$this->shared/js/app.js");
//        $highlight = $menu->getHighlight();
//        if ('highlight' != $highlight) {
//            $highlight = null;
//        }
        $mainTheme = $this->util->renderView('@Presentation/veeva-wide/main-theme.css.twig', array(
            'shared' => $this->shared,
            'selected' => "",//$highlight,
            'logoRcp' => $this->parameter->logoRcp,
            'logoHome' => $this->parameter->logoHome,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $mainTheme, "$this->shared/theme/theme1/css/main.css");

        $mainCss = $this->util->renderView('@Presentation/veeva-wide/main.css.twig', array(
            'shared' => $this->shared,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $mainCss, "$this->shared/css/main.css");

        $popupCss = $this->util->renderView('@Presentation/veeva-wide/popup.css.twig', array(
            'shared' => $this->shared,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $popupCss, "$this->shared/theme/theme1/popup/popup.css");

        $rcpCss = $this->util->renderView('@Presentation/veeva-wide/rcp.css.twig', array(
            'shared' => $this->shared,
            'bgColorOverlay' => $this->reference->bgColorOverlay,
            'closePop' => $this->reference->bgBtnClose,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $rcpCss, "$this->shared/theme/theme1/rcp/rcp.css");

        $refCss = $this->util->renderView('@Presentation/veeva-wide/reference.css.twig', array(
            'shared' => $this->shared,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $refCss, "$this->shared/theme/theme1/reference/reference.css");

        $menuColor = $this->param->getDataBgMenuColor();
        $fontColor = $this->param->getDataFontMenuColor();
        $itemColor = $this->param->getDataCurrentItemColor();
        $highlight = $this->param->getDataHighlightMenu();

        $content = $this->util->renderView('@Presentation/veeva-wide/menu.css.twig', array(
            'menuColor' => $menuColor,
            'itemColor' => $itemColor,
            'fontColor' => $fontColor,
            'highlight' => $highlight,
            'logo' => '',
            'logoRef' => '', // $this->reference->logo,
            'fontFamily' => $this->parameter->menuFontFamily,
            'fontSize' => $this->parameter->menuFontSize,
        ));

        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $content, "$this->shared/css/menu.css");

        if ($this->currentUrl == 'merck') {
            $this->awsMedia->copyFromRacineVeevaInS3(
                $this->S3,
                $this->zipName,
                "/zip_input/Merck/editor.css",
                "$this->shared/css/editor.css"
            );
        }

        $this->awsMedia->copyFromRacineVeevaInS3(
            $this->S3,
            $this->zipName,
            "/zip_input/frameworkVeevaWide/mcm builder-sr-full.jpg",
            "$this->shared/$this->shared-full.jpg"
        );
        $this->awsMedia->copyFromRacineVeevaInS3(
            $this->S3,
            $this->zipName,
            "/zip_input/frameworkVeevaWide/mcm builder-sr-thumb.jpg",
            "$this->shared/$this->shared-thumb.jpg"
        );
    }

    /**
     * @param array $tree
     */
    public function generateMenuHtml(array $tree)
    {
        libxml_use_internal_errors(true);
        $document = new \DOMDocument();
        libxml_clear_errors();

        $disallowScroll= $this->parameter->disallowScroll;
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

        /*$home = $document->createElement('a');
        $home->setAttribute('class', 'home');
        $home->setAttribute('data-link', $tree[0][0]);
        $document->appendChild($home);*/

        $maskMenu = $document->createElement('div');
        $maskMenu->setAttribute('id', 'maskMenu');
        $document->appendChild($maskMenu);

        $logo = $document->createElement('div');
        $logo->setAttribute('class', 'logo');
        $logo->setAttribute('id', 'logo');
        if (!empty($this->parameter->logoPres)) {
            $imgLogo = $document->createElement('img');
            $imgLogo->setAttribute('class', 'logoImg');
            $imgLogo->setAttribute('src', '../shared/'.$this->parameter->logoPres);
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
            $iconDoc->setAttribute('src', '../shared/'.$this->parameter->logoRcp);
            $iconDoc->setAttribute('class', 'fulldata');
        } else {
            $iconDoc->setAttribute('src', '../shared/'.$this->shared.'/theme/theme1/images/ref.png');
            $iconDoc->setAttribute('class', 'emptydata');
        }
        $doc->appendChild($iconDoc);

        $iconRef = $document->createElement('img');
        if (!empty($this->reference->logo)) {
            $iconRefPath = $this->parameter->logoRefrsUrl;
            $iconRef->setAttribute('src', '../shared/'.$iconRefPath);
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
        $maxMenu->setAttribute('data-disable-scroll', 'false');
        if (!empty($disallowScroll)) {
            if ($disallowScroll == 'true') {
                $maxMenu->setAttribute('data-disable-scroll', 'true');
            }
        }
        $a0 = $document->createElement('a');
        $a0->setAttribute('data-link', '0');
        $maxMenu->appendChild($a0);

        $warraper = $document->createElement('div');
        $warraper->setAttribute('id', 'warraper');
        $maxMenu->appendChild($warraper);

        $scrollerMenu = $document->createElement('div');
        $scrollerMenu->setAttribute('warraper', 'scrollerMenu');
        $warraper->appendChild($scrollerMenu);

        $chapter = -1;

        //$slice = array_slice($tree, 1, count($tree), true); // skip the first element
        $slice = $tree; // skip the first element

        $screenNames = array();
        $k = 0;
        foreach ($this->generateLabels() as $label => $slide) {
                $screenNames[$k]['screenName'] = (property_exists($slide->{'attributes'}, "data-screen-name")) ? $slide->{'attributes'}->{'data-screen-name'} : "";
                $screenNames[$k]['chapterName'] = (property_exists($slide->{'attributes'}, "data-chapter-name")) ? $slide->{'attributes'}->{'data-chapter-name'} : "";
            $k++;
        }

        $idx = 1;
        foreach ($slice as $paper) {
            $chapterValue = '';
            ++$chapter;
            $dataChapter = ($chapter == 0) ? '00' : $chapter * 10;
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
            if (($idx - 1) === 0) {
                $a->setAttribute('class', 'home');
                $a->nodeValue = '';
                $document->appendChild($a);
            } else {
                $a->nodeValue = htmlspecialchars($nodeValue);
                $scrollerMenu->appendChild($a);
            }


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
                    $a->nodeValue = 'Slide '.($chapter + 1).".$i";
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
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $document->saveHTML(), "$this->shared/theme/theme1/menu.html");
    }

    /**
     * @param array $tree
     */
    public function generateFlowJs(array $folders)
    {
        $rcp = $this->generateRcp($this->idPres, $this->idRev);
        $flows = new Flows();
        $chapter = $k = 0; // $k is slide counter
        $listRef = '';
        $references = json_decode($this->rev->getLinkedRef());
        foreach ($this->generateLabels() as $label => $slide) {
            if (!property_exists($slide, 'isChild') and $k > 0) {
                $chapter = $chapter + 1;
            }
            foreach ($references as $ref){
                if($ref->{'data_id'} == $slide->{'attributes'}->{'data-id'}) {
                    foreach ($ref->{'Refs'} as $linkedRef) {
                        $listRef .= '<li>'.$linkedRef->{'value'}.$linkedRef->{'description'}.'</li>';
                    }
                    $additionalText = $ref->{'additional_text'};
                    if ($additionalText != "") {
                        $listRef .= '<li>'.$additionalText.'</li>';
                    }
                }
            }
            $screen = new Screen($folders[$k], '', sprintf('%02d', $chapter * 10), $listRef, 'theme1', $rcp);
            $flows->push($screen);
            $listRef = '';
            $k++;

        }
        $flowsJs = $this->util->renderView('@Presentation/veeva-wide/flows.js.twig', array(
            'screens' => $flows->getAtt(),
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $flowsJs, "$this->shared/js/flows.js");
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
        $rev = $this->rev;

        /** @var Presentation $pres */
        $pdfList = $rev->getPdf();
        foreach ($pdfList as $pdf) {
            /** @var Pdf $pdf */
            $fileResult = $this->util->getFileNameByPattern($pdf->getUrl(), "$this->shared/theme/theme1/pdf", "pdf");
            $rcp .= '<li><a data-pdf data-file-name="'.$fileResult['cleanFileName'].'">'.$pdf->getTitle().'</a></li>';
            $this->awsMedia->copyFileVeevaInS3(
                $this->S3,
                $this->zipName,
                $fileResult['sourceName'],
                $fileResult['fileName']
            );

        }

        $html = $this->util->renderView('@Presentation/veeva-wide/rcp.html.twig', array(
            'shared' => $this->shared,
            'close' => $this->reference->bgBtnClose,
        ));
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $html, "$this->shared/theme/theme1/rcp/rcp.html");

        if ('' === $rcp) {
            return '';
        }

        return $rcp;
    }

    /**
     * generatePopins
     */
    public function generatePopins()
    {
        $styleClose = $this->reference->bgBtnClose;
        $popup = $this->util->renderView('@Presentation/veeva-wide/popup.html.twig', ['close' => $styleClose, 'shared' => $this->shared]);
        $fileName = "$this->shared/theme/theme1/popup/popup.html";
        $this->awsMedia->putFileVeevaInS3($this->S3, $this->zipName, $popup, $fileName);
    }

    function generateLinkedScreen($slide){
        foreach($slide->{"blocks"} as $block){
            if(property_exists($block->{'linkedscreen'}, "data")){
                $slideId = $block->{'linkedscreen'}->{'data'};
                $screenName = $this->getScreenName($slideId);
                if(property_exists($block->{'attributes'}, 'data-link')){
                    $block->{'attributes'}->{'data-link'} = $screenName;
                }
            }
        }
    }
    function getScreenName($slideId){
        $i = 0;
        foreach ($this->generateLabels() as $label => $slide) {
            if($slide->{'attributes'}->{'data-id'} == $slideId){
                return $this->names[$i];
                break;
            }
            $i++;
        }
    }
    function setThumbnailsByScreen($folders, $dataId, $i, $type, $typeInVeeva){
    	$key = "/thumbs/".$this->pres->getId()."-".$this->rev->getId()."/slides/".$type.$dataId.".jpg";
    	$thumbnailUrl = $this->awsMedia->companyName.$key;
        if ($this->awsMedia->fileExistS3($thumbnailUrl)) {
            $this->awsMedia->copyFileVeevaInS3($this->S3, $this->zipName, $key, $folders[$i]."/".$folders[$i]."-".$typeInVeeva.".jpg");
        }
    }

    function getThumbnailsByScreen($folders){
        $i = 0;
        foreach ($this->generateLabels() as $label => $slide) {
            $dataId = $slide->{'attributes'}->{'data-id'};
            $this->setThumbnailsByScreen($folders, $dataId, $i, 'screen-200-', 'thumb');
            $this->setThumbnailsByScreen($folders, $dataId, $i, 'screen-', 'full');
            $i++;
        }
    }

    function setZipToEC2($urlPath, $foldername, $pathToS3, $fileName){
        set_time_limit(0);  // Uniquement pour le POC !!
        $ssh_key_path = '/home/sites/qa.mcm-builder.com/ssh';
        $cmd = "bash /var/www/html/ZIP/zip-to-s3.bash $urlPath $foldername $pathToS3 $fileName;";
        $connection = ssh2_connect('ec2-34-238-252-13.compute-1.amazonaws.com', 22, array('hostkey' => 'ssh-rsa'));
        if (ssh2_auth_pubkey_file(
            $connection,
            'ubuntu',
            "${ssh_key_path}/id_rsa.pub",
            "${ssh_key_path}/id_rsa"
        )) {
            $stream = ssh2_exec($connection, $cmd);
            stream_set_blocking($stream, true);
            $stream_out = stream_get_contents($stream);
            if ($stream_out) {
                $response = array();
                $pathZip = str_replace("s3://veeva-summit/", "", $urlPath);
                $response['uploadedZipKey'] = "$pathZip.zip";
                return (object)$response;
            }
        }
        return null;
    }
    /**
     * Generate Veeva Wide zip.
     * @param Presentation $pres        
     * @param Revision $rev
     * @param string $env
     * @return \stdClass|string
     */
    public function zip(Presentation $pres, Revision $rev, string $env, string $companyParentName, $process = "zip")
    {
	    $this->pres = $pres;
	    $this->rev = $rev;
	    $this->param = $this->util->getPresentationParameter($rev->getPreSettings());
	    // zip output
	    $this->wideDir = $this->container->getParameter('zip_wide_directory')."/".$this->rev->getId();
	    $this->zipName = $this->util->slugify($this->getZipName());
	    $this->S3 = $this->awsMedia->getS3Client();
	    $this->awsMedia->companyName = $companyParentName;

	    // init shared with timestamp
	    $currentDate = $this->initShared();
	    // generate the zip name
	    $zipName = $this->getZipName();
	    // generate shared Resources
	    $this->generateSharedResources();
	    // generate references
	    $this->generateReferences();
	    $this->generatePopins();
        $this->setSharedResources();
	    // generate folders and linkedScreens
	    $folders = $this->generateFolders($currentDate);
	    $tree = $this->generateSlidesTree($folders);
	    $this->generateSlidesHtml($tree, $folders);
        // generate menu.html
        $this->generateMenuHtml($tree);
        // generate flows.js
        $this->generateFlowJs($folders);
        // generate Thumbnails
        $this->getThumbnailsByScreen($folders);
        $response = $this->awsMedia->generateZipByLambda($this->zipName, "veeva", $process);
        $response = \GuzzleHttp\json_decode($response);

        if($response and is_object($response) and property_exists($response, "uploadedZipKey") and $process == "zip"):
/*            $seperator = explode('veeva-wide', $response->{"uploadedZipKey"});
            $filename = $seperator[1];*/
            $foldername = $response->{"uploadedZipKey"};
            $pathToS3 = "s3://".$this->awsMedia->expectedBucketName."/".$companyParentName."/zip/veeva-wide/";
            $urlPath = $pathToS3.$response->{"uploadedZipKey"};
            $fileName = $foldername.".zip";
            $result = $this->setZipToEC2($urlPath, $foldername, $pathToS3, $fileName);
            if ($result && is_object($result)) {
                return $result;
            }
        endif;

        return $response;

    }

}
