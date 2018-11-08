<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class CompanyController extends Controller
{
    /**
     * @Route("/companies" , name="companies")
     */
    public function indexAction()
    {
        return $this->render('BackOfficeBundle:Company:list.html.twig');
    }

    /**
     * @Route("/companies/create-new-company", name="company_create_new_company")
     */
    public function createNewCompanyAction()
    {
        return $this->render('BackOfficeBundle:Company:createNewCompany.html.twig');
    }
}
