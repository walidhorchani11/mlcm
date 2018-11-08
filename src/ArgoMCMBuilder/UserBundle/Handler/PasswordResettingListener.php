<?php
/**
 * Created by PhpStorm.
 * User: developper
 * Date: 21/12/16
 * Time: 16:48.
 */

namespace  ArgoMCMBuilder\UserBundle\Handler;

use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Listener responsible to change the redirection at the end of the password resetting.
 */
class PasswordResettingListener implements EventSubscriberInterface
{
    private $router;

    /**
     * PasswordResettingListener constructor.
     *
     * @param UrlGeneratorInterface $router
     */
    public function __construct(UrlGeneratorInterface $router)
    {
        $this->router = $router;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
          FOSUserEvents::RESETTING_RESET_SUCCESS => 'onPasswordResettingSuccess',
        );
    }

    /**
     * @param FormEvent $event
     */
    public function onPasswordResettingSuccess(FormEvent $event)
    {
        $url = $this->router->generate('projects_actives_projects_list');

        $event->setResponse(new RedirectResponse($url));
    }
}
