<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Services;

class PathService
{
    /**
     * nameParser service.
     */
    private $nameParser;

    /**
     * locator service.
     */
    private $locator;

    /**
     * Constructor.
     */
    public function __construct($nameParser, $locator)
    {
        $this->nameParser = $nameParser;
        $this->locator = $locator;

        return $this;
    }

    public function getAbsolutePath($templateName)
    {
        $path = $this->locator->locate($this->nameParser->parse($templateName));

        $length = strpos($path, '/src');
        $path = substr_replace($path, '', 0, $length);

        return $path;
    }
}
