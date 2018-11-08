<?php

namespace ArgoMCMBuilder\NotificationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class NotificationController extends Controller
{
    /**
     * @Route("/alerts", name="alerts")
     */
    public function indexAction()
    {
        return $this->render('NotificationBundle:Notification:index.html.twig');
    }
}
