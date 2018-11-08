<?php

namespace ArgoMCMBuilder\PresentationBundle\Tests\Services;

use ArgoMCMBuilder\PresentationBundle\Services\MiDeepZipService;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class MiDeepService.
 */
class MiDeepService extends WebTestCase
{
    protected $container;

    protected function setUp()
    {
        self::bootKernel();
        $this->container = static::$kernel->getContainer();
    }

    /**
     * @test
     */
    public function testZipName()
    {
        $mi = new MiDeepZipService(new Filesystem(), $this->container);
        $mi->idRev = 621;

        $this->assertEquals(
            'debug1_Argolifetunisie1_EMEA_05242017_V0',
            $mi->getZipName()
        );
    }
}
