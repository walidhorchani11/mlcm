<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

/**
 * Class Parameter.
 */
class Parameter
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

    /**
     * Reference constructor.
     *
     * @param Container             $container
     * @param Filesystem            $fs
     * @param int                   $idRev
     * @param PresentationParameter $presParam
     * @param string                $shared
     */
    public function __construct($container, $fs, $idRev, $presParam, $shared)
    {
        $this->container = $container;
        $this->fs = $fs;
        $this->idRev = $idRev;
        $this->presParam = $presParam;
        $this->shared = $shared;
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
        /** @var Filesystem $fs */
        $fs = $this->fs;
        $idRev = $this->idRev;

        /** @var Container $container */
        $container = $this->container;
        $mediaDirectory = $container->getParameter('media_directory');
        $veeva = $container->getParameter('zip_wide_directory')."/$idRev";

        $explode = explode('/uploads/', $imgUrl);
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

        return "null";
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
                    $fs->mirror("$fontPath/$font[0]", $veeva."/$this->shared/fonts");
                }
            }
        }
    }
}
