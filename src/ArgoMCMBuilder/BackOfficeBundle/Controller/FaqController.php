<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;


/**
 * Faq controller.
 *
 * @Route("/faq")
 */
class FaqController extends Controller
{
    /**
     * List all Agence entities.
     *
     * @Route("/", name="faq_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        return $this->render('BackOfficeBundle:Faq:index.html.twig');
    }


}
