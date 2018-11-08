<?php

namespace ArgoMCMBuilder\UserBundle\Twig\Extension;

class FileExtension extends \Twig_Extension
{
    /**
     * Return the functions registered as twig extensions.
     *
     * @return array
     */
    public function getFunctions()
    {
        return array(
            new Twig_SimpleFunction('file_exists', 'file_exists'),
        );
    }

    public function getName()
    {
        return 'clm_file';
    }
}
