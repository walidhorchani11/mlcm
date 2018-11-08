<?php
/**
 * Created by PhpStorm.
 * User: developper
 * Date: 10/05/17
 * Time: 11:20.
 */

namespace ArgoMCMBuilder\UserBundle\Handler;

use ArgoMCMBuilder\UserBundle\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

/**
 * Class GuestConnect.
 */
class GuestConnect
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var Container
     */
    private $container;

    /**
     * GuestConnect constructor.
     *
     * @param Container     $container
     * @param EntityManager $em
     */
    public function __construct(Container $container, EntityManager $em)
    {
        $this->em = $em;
        $this->container = $container;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        $connect = (bool) $request->query->get('testcharge');
        if ($connect and $this->container->get('kernel')->getEnvironment() === 'dev') {
            /** @var User $user */
      $user = $this->em->getRepository('UserBundle:User')->find(68);

            $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
            $this->container->get('security.context')->setToken($token);
            $this->container->get('session')->set('_security_main', serialize($token));

            $requestUri = $request->server->get('PHP_SELF');

            $event->setResponse(new RedirectResponse($requestUri));
        }
    }
}
