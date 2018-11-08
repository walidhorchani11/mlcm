<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class UserController extends Controller
{
    /**
     * @Route("/users", name="users")
     */
    public function indexAction()
    {
        return $this->render('BackOfficeBundle:User:list.html.twig');
    }

    /**
     * @Route("/users/create-new-user", name="users_create_new_user")
     */
    public function createUserAction()
    {
        return $this->render('BackOfficeBundle:User:createNewUser.html.twig');
    }

    /**
     * @Route("/users/edit-user", name="users_edit_user")
     */
    public function editUserAction()
    {
        return $this->render('BackOfficeBundle:User:editUser.html.twig');
    }
}
