<?php

/*
 * This file is part of the UserBundle package.
 *
 */

namespace ArgoMCMBuilder\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use ArgoMCMBuilder\UserBundle\Entity\Company;
use ArgoMCMBuilder\UserBundle\Form\Type\SearchCompanyType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class CompanyController extends Controller
{
    /**
     * list company.
     *
     * @return company list template
     */
    public function indexAction()
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $repository = $this->getDoctrine()->getRepository('UserBundle:Company');
        if ($user->hasRole('ROLE_SUPER_ADMIN')) {
            $companies = $repository->findAll();
        } else {
            $companies = $repository->findCompanyAndChildForList($user->getCompany()->getId());
        }

        $form = $this->createForm(new SearchCompanyType());
        $request = $this->container->get('request');

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);
            $data = $form->getData();
            $companies = $repository->searchCompany($data);
        }

        $path = $this->container->get('clm.backoffice_path_twig')->getAbsolutePath('UserBundle:Company:list.html.twig');

        return $this->render(
            'UserBundle:Company:list.html.twig',
            array(
                'companies' => $companies,
                'twigPath' => $path,
                'form' => $form->createView(),
            )
        );
    }

    /**
     * add company.
     *
     * @return add template
     */
    public function addAction()
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $company = new Company();
        $form = $this->createForm($this->get('form.type.company'));
        $request = $this->container->get('request');

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $company = $form->getData();
                $em = $this->container->get('doctrine')->getEntityManager();
                $em->persist($company);
                $em->flush();
                $this->get('session')->getFlashBag()->add('success', 'The company is saved');

                return new RedirectResponse($this->generateUrl('clm_company_list'));
            }
        }

        return $this->render(
            'UserBundle:Company:add.html.twig',
            array(
                'form' => $form->createView(),
            )
        );
    }

    /**
     * update company by id.
     *
     * @param id company $id
     *
     * @return edit template
     */
    public function editAction($id)
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $repository = $this->getDoctrine()->getRepository('UserBundle:Company');
        $company = $repository->findOneById($id);

        $form = $this->createForm($this->get('form.type.company'), $company);

        $request = $this->container->get('request');

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->container->get('doctrine')->getEntityManager();
                $em->flush();
                $this->get('session')->getFlashBag()->add('success', 'The company is updated');

                return new RedirectResponse($this->generateUrl('clm_company_list'));
            }
        }

        return $this->render(
            'UserBundle:Company:edit.html.twig',
            array(
                'form' => $form->createView(),
                'company' => $company,
            )
        );
    }

    /**
     * delete company by id.
     *
     * @param id company $id
     *
     * @return redirection to company list
     */
    public function deleteAction($id)
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $repository = $this->getDoctrine()->getRepository('UserBundle:Company');
        $company = $repository->findOneById($id);
        $em = $this->container->get('doctrine')->getEntityManager();
        $em->remove($company);
        $em->flush();
        $this->get('session')->getFlashBag()->add('notice', 'Company is deleted');

        return new RedirectResponse($this->generateUrl('clm_company_list'));
    }

    /**
     * export companies.
     *
     * @return file csv
     */
    public function exportAction()
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $em = $this->getDoctrine()->getEntityManager();

        $companies = $em->getRepository('UserBundle:Company')->findAll();
        $handle = fopen('php://memory', 'r+');
        $header = array();

        fputcsv($handle, array('Company name', 'Number of Users', 'Number of Clm Presentations'));

        foreach ($companies as $item) {
            $nbrPres = 0;
            foreach ($item->getProjects() as $project) {
                $nbrPres = $nbrPres + count($project->getPresentations());
            }
            $tab = array($item->getName(), count($item->getUsers()), $nbrPres);

            fputcsv($handle, $tab);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);
        $name = 'export_companies_'.date('Y-m-d-H:i:s').'.csv';

        return new Response(
            $content, 200, array(
                'Content-Type' => 'application/force-download',
                'Content-Disposition' => 'attachment; filename="'.$name.'"',
            )
        );
    }
}
