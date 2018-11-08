<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Twig\Extension;

use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use GuzzleHttp\Client;


class VeevaExtension extends \Twig_Extension
{
    /**
     * Return the functions registered as twig extensions.
     *
     * @return array
     */
    public function getFunctions()
    {

        return array(
            'veeva_name' => new \Twig_Function_Method($this, 'veeva_name'),
        );

    }

    public function veeva_name($name_machine)
    {

        $nbr = strlen($name_machine);
        $nbr = $nbr - 4;
        $rest = substr($name_machine, $nbr, -3);
        if ($rest != "_") {
            $output = substr($name_machine, 0, -3);
            $output = str_replace('_', ' ', $output);
        } else {
            $output = substr($name_machine, 0, -4);
        }
        $output = str_replace('_', ' ', $output);

        return ucfirst($output);
    }

    public function getName()
    {
        return 'twig_veeva_name_extension';
    }
}
