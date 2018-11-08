<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use ArgoMCMBuilder\BackOfficeBundle\Entity\Newsletter;
use ArgoMCMBuilder\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Newsletter controller.
 *
 * @Route("newsletter")
 */
class NewsletterController extends Controller
{
    /**
     * Lists all newsletter entities.
     *
     * @Route("/", name="newsletter_index", options={"expose"=true})
     * @Method("GET")
     *
     * @param Request $request
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        if (!$this->isGranted('ROLE_SUPER_ADMIN')) {
            throw new NotFoundHttpException();
        }
        if ($request->isXmlHttpRequest()) {
            $get = $request->query->all();
            $em = $this->getDoctrine();
            $rResult = $em->getRepository('BackOfficeBundle:Newsletter')->ajaxTable($get);

            return new JsonResponse($rResult);
        }

        return $this->render('@BackOffice/newsletter/index.html.twig');
    }

    /**
     * send newsletter.
     *
     * @Route("/send", name="newsletter_send")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function sendAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine();

        if ($id) {
            $newsletter = $em->getRepository('BackOfficeBundle:Newsletter')->find($id);
        } else {
            $newsletter = new Newsletter();
        }

        $form = $this->createForm('ArgoMCMBuilder\BackOfficeBundle\Form\NewsletterSendType', $newsletter);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $subject = $form->get('subject')->getData();
            $users = $form->get('users')->getData();
            $messages = $form->get('textMessage')->getData();

            $swift = \Swift_Message::newInstance()
              ->setSubject($subject)
              ->setFrom(array('no-reply@argolife.fr' => 'MCM Builder'));

            /** @var User $user */
            foreach ($users as $user) {
                $swift->addCc($user->getEmail());
            }
            $swift->setBody($messages, 'text/html');
            $this->get('mailer')->send($swift);

            $copy = (!$id) ? $form->get('copy')->getData() : null;

            if ($copy) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($newsletter);
                $em->flush($newsletter);

                return $this->redirectToRoute('newsletter_show', array('id' => $newsletter->getId()));
            } else {
                return $this->redirectToRoute('newsletter_index');
            }
        }

        return $this->render('@BackOffice/newsletter/send.html.twig', array(
            'newsletter' => $newsletter,
            'send_form' => $form->createView(),
        ));
    }

    /**
     * Creates a new newsletter entity.
     *
     * @Route("/new", name="newsletter_new")
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function newAction(Request $request)
    {
        $newsletter = new Newsletter();
        $form = $this->createForm('ArgoMCMBuilder\BackOfficeBundle\Form\NewsletterType', $newsletter);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($newsletter);
            $em->flush($newsletter);

            return $this->redirectToRoute('newsletter_show', array('id' => $newsletter->getId()));
        }

        return $this->render('@BackOffice/newsletter/new.html.twig', array(
            'newsletter' => $newsletter,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a newsletter entity.
     *
     * @Route("/{id}", name="newsletter_show", options={"expose"=true})
     * @Method("GET")
     *
     * @param Newsletter $newsletter
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showAction(Newsletter $newsletter)
    {
        $deleteForm = $this->createDeleteForm($newsletter);

        return $this->render('@BackOffice/newsletter/show.html.twig', array(
            'newsletter' => $newsletter,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing newsletter entity.
     *
     * @Route("/{id}/edit", name="newsletter_edit", options={"expose"=true})
     * @Method({"GET", "POST"})
     *
     * @param Request    $request
     * @param Newsletter $newsletter
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function editAction(Request $request, Newsletter $newsletter)
    {
        $deleteForm = $this->createDeleteForm($newsletter);
        $editForm = $this->createForm('ArgoMCMBuilder\BackOfficeBundle\Form\NewsletterType', $newsletter);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('newsletter_edit', array('id' => $newsletter->getId()));
        }

        return $this->render('@BackOffice/newsletter/edit.html.twig', array(
            'newsletter' => $newsletter,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a newsletter entity.
     *
     * @Route("/{id}", name="newsletter_delete")
     * @Method("DELETE")
     *
     * @param Request    $request
     * @param Newsletter $newsletter
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deleteAction(Request $request, Newsletter $newsletter)
    {
        $form = $this->createDeleteForm($newsletter);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($newsletter);
            $em->flush($newsletter);
        }

        return $this->redirectToRoute('newsletter_index');
    }

    /**
     * Creates a form to delete a newsletter entity.
     *
     * @param Newsletter $newsletter The newsletter entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Newsletter $newsletter)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('newsletter_delete', array('id' => $newsletter->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
