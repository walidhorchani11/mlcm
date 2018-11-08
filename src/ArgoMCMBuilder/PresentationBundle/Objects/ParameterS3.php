<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use ArgoMCMBuilder\PresentationBundle\Objects\Util;
use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;

/**
 * Class Parameter.
 */
class ParameterS3
{
    public $container;
    public $fs;
    /** @var PresentationParameter $presParam */
    public $presParam;
    public $idRev;
    public $shared;
    public $logoRcp;
    public $logoHome;
    public $logoPres;
    public $menuFontFamily;
    public $menuFontSize;
    public $enableSubmenu;
    public $enableSubmenuWidth;
    public $errors;
    public $awsMedia;
    public $zipName;
    public $util;
    public $backgroundPres;
    public $backgroundPop;
    public $logoRefrsUrl;
    public $disallowScroll;

    /**
     * Reference constructor.
     *
     * @param Container             $container
     * @param AwsMedia              $awsMedia
     * @param int                   $idRev
     * @param PresentationParameter $presParam
     * @param string                $shared
     */
    public function __construct($container, $awsMedia, $idRev, $presParam, $shared, $zipName)
    {
        $this->container = $container;
        $this->awsMedia = $awsMedia;
        $this->idRev = $idRev;
        $this->presParam = $presParam;
        $this->shared = $shared;
        $this->zipName = $zipName;
        $this->util = new Util($this->container);
        $this->S3 = $this->awsMedia->getS3Client();
    }

    /**
     * Inject Reference.
     */
    public function injectProperties()
    {
        $this->logoRcp = $this->presParam->getDataLogoRcpUrl();
        $this->logoHome = $this->presParam->getDataLogoHomeUrl();
        $this->logoPres = $this->presParam->getDataLogoPresUrl();
        $this->menuFontSize = $this->presParam->getDataFontSizeSelect();
        $this->enableSubmenu = $this->presParam->getDataAllowSubmenu();
        $this->menuFontFamily = $this->presParam->getDataMenuFont();
        $this->enableSubmenuWidth = $this->presParam->getDataAllowSubmenuwidth();
        $this->backgroundPres = $this->presParam->getDataBgPresImg();
        $this->backgroundPop = $this->presParam->getDataBgPopupImg();
        $this->logoRefrsUrl = $this->presParam->getDataLogoRefrsUrl();
        $this->disallowScroll = $this->presParam->getDataDisableScroll();

    }

    /**
     * @param string      $imgUrl
     * @param string      $imageName
     * @param null|string $type
     *
     * @return string
     */
    public function downloadImage($imgUrl, $imageName, $type = null): string
    {

        $sourceName = "";
        $fileName = "";
        $pattern = '/.*\/(.*?)\.(.*)/';
        $matches = array();
        if (preg_match($pattern, $imgUrl, $matches)) {
            $sourceName = "/image/$matches[1].$matches[2]";
            $matches[1] = $this->util->cleanFileName($matches[1]);
            $fileName = "$this->shared/theme/theme1/images/$matches[1].$matches[2]";
        }
        $this->awsMedia->copyFileVeevaInS3($this->S3, $this->zipName, $sourceName, $fileName);
        return $fileName;

    }

    /**
     * Download Rcp logo.
     */
    public function downloadRcpLogo()
    {
        $logoRcp = $this->logoRcp;
        if (!empty($logoRcp)) {
            $this->logoRcp = $this->downloadImage($logoRcp, 'rcp-image');
        }
    }

    /**
     * Download Home logo.
     */
    public function downloadHomeLogo()
    {
        $logoHome = $this->logoHome;
        if (!empty($logoHome)) {
            $this->logoHome = $this->downloadImage($logoHome, 'home-image');
        }
    }

    /**
     * Download Pres logo.
     */
    public function downloadPresLogo()
    {
        $logoPres = $this->logoPres;
        if (!empty($logoPres)) {
            $this->logoPres = $this->downloadImage($logoPres, 'pres-image');
        }
    }

    /**
     * Download Fonts menu.
     *
     * @return void
     */
    public function downloadFontsMenu()
    {
        $fs = $this->fs;
        $veeva = $this->container->getParameter('zip_wide_directory')."/$this->idRev";
        $fontPath = $this->container->getParameter('web_directory').'/fonts';

        $defaultFonts = ['opensans-regular-webfont', 'Montserrat-Regular'];
        $fontsMcm = $this->presParam->getDataFontUrlExist();
        if ('' != $fontsMcm) {
            $fonts = explode(',', $fontsMcm);

            foreach ($fonts as $font) {
                $font = explode('/', $font);
                $font = explode('.', $font[3]);
                if (!in_array($font[0], $defaultFonts)) {
                   // $fs->mirror("$fontPath/$font[0]", $veeva."/$this->shared/fonts");
                }
            }
        }
    }

    /**
     * Download background pres.
     *
     * @return void
     */
    public function downloadBackgroundPres()
    {
        $bgPres = $this->backgroundPres;
        if (!empty($bgPres)) {
            $this->backgroundPres = $this->downloadImage($bgPres, 'bg-pres');
        }
    }
    /**
     * Download background pop.
     *
     * @return void
     */
    public function downloadBackgroundPop()
    {
        $bgPop = $this->backgroundPop;
        if (!empty($bgPop)) {
            $this->backgroundPop = $this->downloadImage($bgPop, 'bg-pop');
        }
    }
    /**
     * Download Ref logo.
     *
     * @return void
     */
    public function downloadRefLogo()
    {
        $logoRef = $this->logoRefrsUrl;
        if (!empty($logoRef)) {
            $this->logoRefrsUrl = $this->downloadImage($logoRef, 'logo-ref');
        }
    }

}
