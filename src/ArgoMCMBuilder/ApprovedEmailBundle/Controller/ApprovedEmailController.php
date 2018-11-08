<?php

namespace ArgoMCMBuilder\ApprovedEmailBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class ApprovedEmailController extends Controller
{
    /**
     * @Route("/emails", name="emails")
     */
    public function indexAction()
    {
        return $this->render('ApprovedEmailBundle:ApprovedEmail:index.html.twig');
    }
}
