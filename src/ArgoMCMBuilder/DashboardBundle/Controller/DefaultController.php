<?php

namespace ArgoMCMBuilder\DashboardBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/dashboard", name="dashboard_index")
     */
    public function indexAction()
    {
        return $this->render('DashboardBundle:Default:index.html.twig');
    }
}
