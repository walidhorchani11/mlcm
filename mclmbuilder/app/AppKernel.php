<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),

            // Internal
            new ArgoMCMBuilder\BackOfficeBundle\BackOfficeBundle(),
            new ArgoMCMBuilder\UserBundle\UserBundle(),
            new ArgoMCMBuilder\ProjectBundle\ProjectBundle(),
            new ArgoMCMBuilder\PresentationBundle\PresentationBundle(),
            new ArgoMCMBuilder\NotificationBundle\NotificationBundle(),
            new ArgoMCMBuilder\ApprovedEmailBundle\ApprovedEmailBundle(),
            new ArgoMCMBuilder\MediaBundle\ArgoMCMBuilderMediaBundle(),
            new ArgoMCMBuilder\VeevaVaultBundle\VeevaVaultBundle(),

            // External
            new FOS\UserBundle\FOSUserBundle(),
            new Knp\Bundle\MenuBundle\KnpMenuBundle(),
            new Obtao\Bundle\Html2PdfBundle\ObtaoHtml2PdfBundle(),
            new Ivory\CKEditorBundle\IvoryCKEditorBundle(),
            new FM\ElfinderBundle\FMElfinderBundle(),
            new FOS\RestBundle\FOSRestBundle(),
            new JMS\SerializerBundle\JMSSerializerBundle(),
            new FOS\JsRoutingBundle\FOSJsRoutingBundle(),
            new Webfactory\Bundle\PiwikBundle\WebfactoryPiwikBundle(),
            new \Aws\Symfony\AwsBundle(),
            new Snc\RedisBundle\SncRedisBundle(),
            new ArgoMCMBuilder\DashboardBundle\DashboardBundle(),
            new EightPoints\Bundle\GuzzleBundle\GuzzleBundle(),
            new Craue\FormFlowBundle\CraueFormFlowBundle(),
            new AdamQuaile\Bundle\FieldsetBundle\AdamQuaileFieldsetBundle(),
            new SimpleThings\FormExtraBundle\SimpleThingsFormExtraBundle(),

        );

        if (in_array($this->getEnvironment(), array('dev', 'test'), true)) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
            $bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();
            $bundles[] = new Khepin\YamlFixturesBundle\KhepinYamlFixturesBundle();
//            $bundles[] = new CoreSphere\ConsoleBundle\CoreSphereConsoleBundle();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}
