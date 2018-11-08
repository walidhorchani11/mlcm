<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class GroupController extends Controller
{
    /**
     * @Route("/groups" , name="groups")
     */
    public function indexAction()
    {
        return $this->render('BackOfficeBundle:Group:list.html.twig');
    }

    /**
     * @Route("/groups/create-new-group", name="groups_create_new_group")
     */
    public function createNewGroupAction()
    {
        return $this->render('BackOfficeBundle:Group:createNewGroup.html.twig');
    }
}
