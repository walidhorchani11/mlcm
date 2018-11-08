<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use ArgoMCMBuilder\BackOfficeBundle\Entity\Agence;
use ArgoMCMBuilder\BackOfficeBundle\Form\AgenceType;

/**
 * Agence controller.
 *
 * @Route("/agency")
 */
class AgenceController extends Controller
{
    /**
     * List all Agence entities.
     *
     * @Route("/", name="agence_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        $agences = $em->getRepository('BackOfficeBundle:Agence')->findAll();

        return $this->render('BackOfficeBundle:Agence:index.html.twig', array(
            'agences' => $agences,
        ));
    }

    /**
     * Create a new Agence entity.
     *
     * @Route("/new", name="agence_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $agence = new Agence();
        $form = $this->createForm('ArgoMCMBuilder\BackOfficeBundle\Form\AgenceType', $agence);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($agence);
            $em->flush();
            $this->get('session')->getFlashBag()->add('success', "The agency can't be created");

            return $this->redirectToRoute('agence_index');
        }

        $this->get('session')->getFlashBag()->add('error', "The agency can't be created");

        return $this->render('BackOfficeBundle:Agence:new.html.twig', array(
            'agence' => $agence,
            'form' => $form->createView(),
        ));
    }

    /**
     * Display a form to edit an existing Agence entity.
     *
     * @Route("/{id}/edit", name="agence_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('BackOfficeBundle:Agence');
        $agence = $repository->findOneById($id);

        $form = $this->createForm(new AgenceType(), $agence);

        $request = $this->container->get('request');

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
                // TODO traduction
                $this->get('session')->getFlashBag()->add('success', 'The agency is updated!');

                return $this->redirectToRoute('agence_index');
            }
        }

        $this->get('session')->getFlashBag()->add('error', "The agency can't be updated!");

        return $this->render('BackOfficeBundle:Agence:edit.html.twig', array(
            'agence' => $agence,
            'form' => $form->createView(),
        ));
    }

    /**
     * Delete a Agency entity.
     *
     * @Route("/remove/{id}", name="agency_remove")
     */
    public function deleteAgencyAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $agency = $em->getRepository('BackOfficeBundle:Agence')->findOneById($id);
        $em->remove($agency);
        $em->flush();

        return $this->redirectToRoute('agence_index');
    }
}
