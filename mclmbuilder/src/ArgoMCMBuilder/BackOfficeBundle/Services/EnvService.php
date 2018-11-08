<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Services;

class EnvService
{
    /**
     *  container $container.
     */
    private $container;

    /**
     * Constructor.
     */
    public function __construct($container)
    {
        $this->container = $container;

        return $this;
    }

    public function getEnvByClient()
    {
        $path = $this->container->get('kernel')->getRootDir().'/../client.ini';
        $ini_array = parse_ini_file($path);

        return $ini_array;
    }
}
