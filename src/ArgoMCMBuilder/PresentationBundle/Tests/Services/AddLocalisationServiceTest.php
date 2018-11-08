<?php
/**
 * Created by PhpStorm.
 * User: argo
 * Date: 09/08/17
 * Time: 12:49
 */

namespace ArgoMCMBuilder\PresentationBundle\Services;


class AddLocalisationServiceTest extends \PHPUnit_Framework_TestCase
{
    protected function setUp()
    {
        self::bootKernel();
        $this->container = static::$kernel->getContainer();
    }
}
