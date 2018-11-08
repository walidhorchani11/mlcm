<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Twig\Extension;

use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use GuzzleHttp\Client;


class VeevaZipNameExtension extends \Twig_Extension
{
    /**
     * Return the functions registered as twig extensions.
     *
     * @return array
     */
    public function getFunctions()
    {

        return array(
            'veeva_zip_name' => new \Twig_Function_Method($this, 'veeva_zip_name'),
        );

    }

    /**
     * @param $name
     * @return string
     * Trait Expression de type 2809_Presentation_04_01 or shared_1506596814
     */
    public function veeva_zip_name($name)
    {

        if (preg_match('/_/', $name)) {
            $nameZip = explode('_', $name);
            if (!empty($nameZip[1]) && $nameZip[1] == 'Presentation') {
                $name = $nameZip[1].' '.$nameZip[2];
            } else {
                $name = $nameZip[0];
            }
        } else {
            $name = '';
        }

        return $name;
    }

    public function getName()
    {
        return 'twig_veeva_zip_name_extension';
    }
}
