<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Filesystem\Filesystem;
use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;
use Aws\S3\S3Client;

/**
 * Class ReferenceVeeva.
 */
class ReferenceVeeva extends Reference
{


    /** @var S3Client $S3 */
    public $S3;
    public $zipName;
    /** @var AwsMedia $awsMedia */
    public $awsMedia;


    /**
     * Reference constructor.
     *
     * @param Container $container
     * @param Filesystem $fs
     * @param int $idRev
     * @param PresentationParameter $presParam
     */
    public function __construct($container, $fs, $idRev, $presParam, $shared, $S3, $zipName, $awsMedia)
    {
        $this->S3 = $S3;
        $this->shared = $shared;
        $this->zipName = $zipName;
        $this->awsMedia = $awsMedia;
        parent::__construct($container, $fs, $idRev, $presParam, $shared);
    }

    /**
     * @return string
     */
    public function htmlVeeva()
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
            $fileResult = $this->util->getFileNameByPattern($this->bgImg, "media/images", "image");
            $name = explode('/', $fileResult['fileName']);
            $fileName = "$this->shared/theme/theme1/images/$name[2]";
            $this->awsMedia->copyFileVeevaInS3(
                $this->S3,
                $this->zipName,
                $fileResult['sourceName'],
                $fileName
            );

            $bgImg = "url('.$fileName.')";
            $bgImg = $this->getCssProp('background-image', $bgImg);
            $boxStyle = "style=\"$textColor $width $height $bgColor $bgImg\"";
        }

        if (!empty($this->logo)) {
            $fileResult = $this->util->getFileNameByPattern($this->logo, "media/images", "image");
            $name = explode('/', $fileResult['fileName']);
            $fileName = "$this->shared/theme/theme1/images/$name[2]";
            $this->awsMedia->copyFileVeevaInS3(
                $this->S3,
                $this->zipName,
                $fileResult['sourceName'],
                $fileName
            );
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
        $bgBtnClose = "";
        if (!empty($this->bgBtnClose)) {
            $fileResult = $this->util->getFileNameByPattern($this->bgBtnClose, "media/images", "image");
            $name = explode('/', $fileResult['fileName']);
            $bgBtnClose = "$this->shared/theme/theme1/images/$name[2]";
            $this->awsMedia->copyFileVeevaInS3(
                $this->S3,
                $this->zipName,
                $fileResult['sourceName'],
	            $bgBtnClose
            );
            $this->bgBtnClose = $bgBtnClose;
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
                'close'      => $bgBtnClose,
                'shared'     => $this->shared,
            )
        );
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
            $this->awsMedia->copyFontsVeevaInS3($this->S3, $this->zipName, "$font/$name.ttf", "$this->shared/fonts/$name.ttf");
            $this->awsMedia->copyFontsVeevaInS3($this->S3, $this->zipName, "$font/$name.woff", "$this->shared/fonts/$name.woff");
        }

    }
}
