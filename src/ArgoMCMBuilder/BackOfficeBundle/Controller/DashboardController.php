<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class DashboardController.
 */
class DashboardController extends Controller
{
    /**
     * @Route("/dashboard" , name="dashboard")
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function indexAction()
    {
        return $this->redirect($this->generateUrl('projects_actives_projects_list'));
        //return $this->render('BackOfficeBundle:Dashboard:index.html.twig');
    }
}
