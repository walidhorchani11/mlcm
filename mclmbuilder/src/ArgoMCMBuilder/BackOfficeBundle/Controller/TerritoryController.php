<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class TerritoryController extends Controller
{
    /**
     * @Route("/territories" , name="territories")
     */
    public function indexAction()
    {
        return $this->render('BackOfficeBundle:Territory:list.html.twig');
    }

    /**
     * @Route("/territories/create-new-territory", name="territory_create_new_territory")
     */
    public function createNewWTerritoryAction()
    {
        return $this->render('BackOfficeBundle:Territory:createNewTerritory.html.twig');
    }
}
