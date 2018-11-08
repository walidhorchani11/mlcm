<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class Reference.
 */
class Reference
{
    public $fs;
    public $container;
    public $idRev;
    public $crawler;
    /** @var PresentationParameter $presParam */
    public $presParam;
    public $textColor;
    public $width;
    public $height;
    public $bgColor;
    public $bgColorOverlay;
    public $bgImg;
    public $fontFamily;
    public $fontSize;
    public $fontSizeContent;
    public $bgBtnClose;
    public $fonts;
    public $logo;
    public $overlay;
    public $opacity;
    public $shared;
    public $errors;
    /** @var Util $util */
    public $util;

    /**
     * Reference constructor.
     *
     * @param Container $container
     * @param Filesystem $fs
     * @param int $idRev
     * @param PresentationParameter $presParam
     * @param string $shared
     */
    public function __construct($container, $fs, $idRev, $presParam, $shared = null)
    {
        $this->container = $container;
        $this->fs = $fs;
        $this->idRev = $idRev;
        $this->shared = $shared;
        $this->presParam = $presParam;
    }

    /**
     * @param string $bgImg
     * @param string $imageName
     * @param null|string $type
     *
     * @return string
     */
    public function downloadImage($bgImg, $imageName, $type = null)
    {
        /** @var Filesystem $fs */
        $fs = $this->fs;
        $idRev = $this->idRev;

        /** @var Container $container */
        $container = $this->container;
        $mediaDirectory = $container->getParameter('media_directory');
        $veeva = $container->getParameter('zip_wide_directory')."/$idRev";

        $explode = explode('/uploads/', $bgImg);
        $img = $explode[1];
        $fullPath = $mediaDirectory.$img;
        $ext = substr($img, -3);

        if ($fs->exists($fullPath)) {
            $target = $veeva."/$this->shared/theme/theme1/images/$imageName.$ext";
            $fs->copy($fullPath, $target);

            if ('logo' === $type) {
                return "../theme/theme1/images/$imageName.$ext";
            }

            return "../shared/$this->shared/theme/theme1/images/$imageName.$ext";
        }

        return '';
    }

    /**
     * Inject Reference.
     */
    public function injectProperties()
    {
        $this->textColor = $this->presParam->getDataTextRefColor();
        $this->width = $this->presParam->getDataRefWidth();
        $this->height = $this->presParam->getDataRefHeight();
        $this->bgColor = $this->presParam->getDataBgRefColor();
        $this->bgColorOverlay = $this->presParam->getDataBgRefOverlaycolor();
        $this->bgImg = $this->presParam->getDataBgRefImg();
        $this->fontFamily = $this->presParam->getDataMenuFontTitleRef();
        $this->fontSize = $this->presParam->getDataFontSizeTitleRef();
        $this->fontSizeContent = $this->presParam->getDataFontSizeRefContent();
        $this->bgBtnClose = $this->presParam->getDataBgBtnClose();
        $this->fonts = $this->presParam->getDataFontUrlExist();
        $this->logo = $this->presParam->getDataLogoRefrsUrl();
    }

    /**
     * @return string
     */
    public function html()
    {
        $mcmParams = $this->presParam;

        // div#box
        $textColor = $this->getCssProp('color', $this->textColor);
        $width = $this->getCssProp('width', $this->width);
        $height = $this->getCssProp('height', $this->height);
        $bgColor = $this->getCssProp('background-color', $this->bgColor);
        $styleArrow = '';

        $boxStyle = "style=\"$textColor $width $height $bgColor\"";
        if (!empty($this->bgColor)) {
            $borderArrow = "border-top: 30px solid $this->bgColor ;";
            $styleArrow = "style=\"$borderArrow\"";
        }

        if (!empty($this->bgImg)) {
            $bgImg = $this->downloadImage($this->bgImg, 'ref-image');
            $bgImg = "url('$bgImg')";
            $bgImg = $this->getCssProp('background-image', $bgImg);
            $boxStyle = "style=\"$textColor $width $height $bgColor $bgImg\"";
        }

        if (!empty($this->logo)) {
            $this->logo = $this->downloadImage($this->logo, 'ref-logo', 'logo');
        }

        // div.title
        $fontFamily = $this->getCssProp('font-family', $this->fontFamily);
        $fontSize = $this->getCssProp('font-size', $this->fontSize);
        if (false === strpos($fontSize, 'px')) {
            $fontSize = str_replace(';', 'px;', $fontSize);
        }
        $titleStyle = "style=\"$fontFamily $fontSize\"";

        // ul[content]
        $title = $mcmParams->getDataTitleRefContent();
        $fontSizeContent = $this->getCssProp('font-size', $this->fontSizeContent);

        // if $fontSizeContent does not have a px; we add it!
        if (false === strpos($fontSizeContent, 'px')) {
            $fontSizeContent = str_replace(';', 'px;', $fontSizeContent);
        }
        $ulStyle = "style=\"$fontFamily $fontSizeContent\"";

        // div [btnClose]
        if (!empty($this->bgBtnClose)) {
            $this->bgBtnClose = $this->downloadImage($this->bgBtnClose, 'btnClose');
        }

        $overlayStyle = '';
        if (!empty($this->bgColorOverlay)) {
            $this->bgColorOverlay = str_replace(['rgb', ')'], ['rgba', ', 0.5)'], $this->bgColorOverlay);
            $bgColorOverlay = "background-color: $this->bgColorOverlay";
            $overlayStyle = "style=\"$bgColorOverlay\"";
        }

        if (!empty($this->fonts)) {
            $this->downloadFonts($this->fonts);
        }

        return $this->util->renderView(
            '@Presentation/veeva-wide/reference.html.twig',
            array(
                'overlay'    => $overlayStyle,
                'arrow'      => $styleArrow,
                'boxStyle'   => $boxStyle,
                'titleStyle' => $titleStyle,
                'title'      => $title,
                'ulStyle'    => $ulStyle,
                'close'      => $this->bgBtnClose,
                'shared'     => $this->shared,
            )
        );
    }

    /**
     * @param string $prop
     * @param string $value
     * @param string|null $important
     *
     * @return string
     */
    public function getCssProp($prop, $value, $important = null)
    {
        if (!empty($value)) {
            if (!empty($important) && '!important' === $important) {
                return "$prop: $value $important;";
            }

            return "$prop: $value;";
        }

        return '';
    }

    /**
     * @return Util
     */
    public function getUtil()
    {
        return $this->util;
    }

    /**
     * @param Util $util
     */
    public function setUtil(Util $util)
    {
        $this->util = $util;
    }
}
