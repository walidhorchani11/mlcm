<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;
use Aws\S3\S3Client;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class ReferenceMi.
 */
class ReferenceMi extends Reference
{
    public $btnCloseStyle;
    /** @var S3Client $S3 */
    public $S3;
    public $zipName;
    /** @var AwsMedia $awsMedia */
    public $awsMedia;

    /**
     * Reference constructor.
     *
     * @param Container             $container
     * @param Filesystem            $fs
     * @param int                   $idRev
     * @param PresentationParameter $presParam
     */
    public function __construct($container, $fs, $idRev, $presParam, $S3, $zipName, $awsMedia)
    {
        $this->S3 = $S3;
        $this->zipName = $zipName;
        $this->awsMedia = $awsMedia;
        parent::__construct($container, $fs, $idRev, $presParam);
    }

    /**
     * @return string
     */
    public function htmlMi()
    {
        $width = $this->getCssProp('width', $this->width);
        $height = $this->getCssProp('height', $this->height);
        $bgColor = $this->getCssProp('background-color', $this->bgColor);

        $refBgImg = '';
        if (!empty($this->bgImg)) {
            $fileResult = $this->util->getFileNameByPattern($this->bgImg, "media/images", "image");
            $this->awsMedia->copyFileInS3($this->S3, $this->zipName, $fileResult['sourceName'], $fileResult['fileName']);
            $refBgImg = "url('".$fileResult['fileName']."')";
            $refBgImg = $this->getCssProp('background-image', $refBgImg).' background-size: contain !important;';
        }

        $btnCloseStyle = 'style="z-index: 99;"';
        if (!empty($this->bgBtnClose)) {

            $fileResult = $this->util->getFileNameByPattern($this->bgBtnClose, "media/images", "image");
            $this->awsMedia->copyFileInS3($this->S3, $this->zipName, $fileResult['sourceName'], $fileResult['fileName']);
            $this->bgBtnClose = $fileResult['fileName'];
            $bgBtnClose = "url('".$fileResult['fileName']."')";
            $bgBtnClose = $this->getCssProp('background-image', $bgBtnClose);
            $btnCloseStyle .= '"'.trim($bgBtnClose).'"';
            $btnCloseStyle = str_replace('""', ' ', $btnCloseStyle);
            $this->btnCloseStyle = $btnCloseStyle;
        }


        $mcmParams = $this->presParam;

        $textColor = $this->getCssProp('color', $this->textColor);
        $fontFamily = $this->getCssProp('font-family', $this->fontFamily);
        $fontSize = $this->getCssProp('font-size', $this->fontSize);
        if (false === strpos($fontSize, 'px')) {
            $fontSize = str_replace(';', 'px;', $fontSize);
        }

        $title = $mcmParams->getDataTitleRefContent();
        $titleStyle = "style='$textColor $fontFamily $fontSize'";

        $fontSizeContent = $this->getCssProp('font-size', $this->fontSizeContent);
        // if $fontSizeContent does not have a px; we add it!
        if (false === strpos($fontSizeContent, 'px')) {
            $fontSizeContent = str_replace(';', 'px;', $fontSizeContent);
        }
        $styleRefText = "style='$textColor $fontFamily $fontSizeContent'";
        $styleRef = "style=\"$width $height $bgColor $refBgImg\"";
        $styleArrow = '';
        if (!empty($this->bgColor)) {
            $borderArrow = "border-top: 30px solid $this->bgColor ;";
            $styleArrow = "style=\"$borderArrow\"";
        }

        if (!empty($this->fonts)) {
            $this->downloadFonts($this->fonts);
        }
        $styleLayer = '';
        if (null !== $this->bgColorOverlay && '' !== $this->bgColorOverlay) {
            $this->bgColorOverlay = str_replace(['rgb', ')'], ['rgba', ', 0.5)'], $this->bgColorOverlay);
            $bgColorOverlay = "background-color: $this->bgColorOverlay";
            $styleLayer = "style=\"$bgColorOverlay\"";
        }

        $structureRef = $this->util->renderView('@Presentation/mi-deep/reference.html.twig', array(
            'layer' => $styleLayer,
            'arrow' => $styleArrow,
            'styleRef' => $styleRef,
            'styleTitle' => $titleStyle,
            'title' => $title,
            'styleRefText' => $styleRefText,
            'close' => $this->bgBtnClose,
            'shared' => $this->shared,
        ));

        return $structureRef;
    }

    /**
     * @return mixed
     */
    public function getBtnCloseStyle()
    {
        return $this->btnCloseStyle;
    }

    /**
     * @param mixed $btnCloseStyle
     */
    public function setBtnCloseStyle($btnCloseStyle)
    {
        $this->btnCloseStyle = $btnCloseStyle;
    }

    /**
     * @param string $fonts
     *
     * @return void
     */
    public function downloadFonts($fonts)
    {
        $fonts = explode(',', $fonts);
        foreach ($fonts as $font) {
            $font     = str_replace('fonts/', 'commun-fonts/', $font);
            $fontName = ltrim($font, '/');
            $name     = explode('/', $fontName);
            array_shift($name);
            $name     = implode('/', $name);

            $this->awsMedia->copyFontInS3($this->S3, $this->zipName, "$font/$name.ttf", "fonts/$name.ttf");
            $this->awsMedia->copyFontInS3($this->S3, $this->zipName, "$font/$name.woff", "fonts/$name.woff");

        }

    }
}
