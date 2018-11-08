<?php

/*
 * This file is part of the UserBundle package.
 *
 */

namespace ArgoMCMBuilder\UserBundle\Controller;

use FOS\UserBundle\Model\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Response;
use ArgoMCMBuilder\UserBundle\Form\Type\SearchUserType;
use ArgoMCMBuilder\UserBundle\Form\Type\DeleteUserType;

class UserController extends Controller
{
    /**
     * get users list.
     *
     * @return users list
     */
    public function indexAction()
    {
        $user = $this->getUser();
        $repository = $this->getDoctrine()->getRepository('UserBundle:User');
        if ($user->hasRole('ROLE_SUPER_ADMIN')) {
            $users = $repository->findAll();
        } else {
            $company = $user->getCompany();
            $companyId = $company->getId();
            $query = $repository->getListUserByCompany($companyId);
            $users = $query->getQuery()->getResult();
        }

        $form = $this->createForm(new SearchUserType());
        $request = $this->container->get('request');
        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);
            $data = $form->getData();

            $length = $request->get('length');
            $length = $length && ($length != -1) ? $length : 0;

            $start = $request->get('start');
            $start = $length ? ($start && ($start != -1) ? $start : 0) / $length : 0;

            $users = $repository->searchUsers($data, $start, $length);
        }

        return $this->render(
            'UserBundle:User:list.html.twig',
            array(
                'users' => $users,
                'form' => $form->createView(),
            )
        );
    }

    /**
     * update user by id.
     *
     * @param id user $id
     *
     * @return edit form template
     */
    public function editUserAction($id)
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN') && !$user->hasRole('ROLE_MANAGER')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $repository = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $repository->findOneById($id);
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.change_password.form.factory');

        $formPassword = $formFactory->createForm();

        if (!is_object($user)) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $request = $this->container->get('request');
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);
        $form->handleRequest($request);

        if ($form->isValid()) {
            /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);

            $session = $this->getRequest()->getSession();
            $session->getFlashBag()->add('message', 'Successfully updated');
            $url = $this->generateUrl('clm_users_list');
            $response = new RedirectResponse($url);
        }

        return $this->render('UserBundle:User:edit.html.twig', array(
                'form' => $form->createView(),
                'form_password' => $formPassword->createView(),
                'user' => $user,
                'display_modal' => 0,
        ));
    }

    /**
     * @param User $id
     *
     * @return Response
     */
    public function transfertUserAction($id)
    {
        $userSession = $this->getUser();
        if (!$userSession->hasRole('ROLE_SUPER_ADMIN') && !$userSession->hasRole('ROLE_ADMIN') && !$userSession->hasRole('ROLE_MANAGER')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }
        $em = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $em->find($id);
        $users = $this->getDoctrine()->getRepository('UserBundle:User')->getListUserOwnerShip($user->getCompany()->getId(), $id);

        return $this->render('UserBundle:User:transfert.html.twig', array(
            'user' => $user,
            'users' => $users,
        ));
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function transfertUserAjaxAction(Request $request)
    {
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN') && !$user->hasRole('ROLE_MANAGER')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $em = $this->getDoctrine()->getManager();
        $userRepository = $this->getDoctrine()->getRepository('UserBundle:User');
        $type = $request->get('ajaxType');

        if ($type == 'transferOwner') {
            $userOldid = $request->get('userOldId');
            $userNewid = $request->get('userNewId');

            $userRepository->transfertUserRolePresentation($userOldid, $userNewid);
            $userRepository->transfertUserRoleProject($userOldid, $userNewid);

            $user = $userRepository->find($userOldid);

            $em->remove($user);
            $em->flush();

            return new JsonResponse(array(
                'userOldid' => $userOldid,
                'userNewid' => $userNewid,
            ));
        } elseif ($type == 'transferOwnerCustom') {
            $array = $request->get('data');

            foreach ($array as $userTransfer) {
                if (is_array($userTransfer)) {
                    if ($userTransfer['type'] == 'Presentation') {
                        $userRepository->transfertUserRolePresentation($userTransfer['oldOwnerId'], $userTransfer['newOwnerId'], $userTransfer['id']);
                    } else {
                        $userRepository->transfertUserRoleProject($userTransfer['oldOwnerId'], $userTransfer['newOwnerId'], $userTransfer['id']);
                    }
                }
            }
            $user = $userRepository->find($request->get('user'));
            $em->remove($user);
            $em->flush();

            return new JsonResponse($array);
        }

        return new JsonResponse(array('error' => 'error'));
    }

    public function deleteUserAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $repository->findOneById($id);

        $form = $this->createForm(new DeleteUserType($user->getId(), $user->getCompany()->getId()), $user);
        $session = $request->getSession();

        return $this->render('UserBundle:User:dynamic_content.html.twig', array(
            'formDelete' => $form->createView(),
            'username' => $user->getFirstname().$user->getLastname(),
        ));
    }

    /**
     * delete user by id.
     *
     * @param id user $id
     *
     * @return redirect to users list
     */
    public function deleteAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $repository->findOneById($id);
        $em = $this->container->get('doctrine')->getEntityManager();
        $em->remove($user);
        $em->flush();
        $this->get('session')->getFlashBag()->add('notice', $this->get('translator')->trans('user.success.remove', array(), 'users'));

        return new RedirectResponse($this->generateUrl('clm_users_list'));
    }

    /**
     * export users.
     *
     * @return file csv
     */
    public function exportAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $user = $this->getUser();
        if (!$user->hasRole('ROLE_SUPER_ADMIN') && !$user->hasRole('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this page.');
        }

        $repository = $this->getDoctrine()->getRepository('UserBundle:User');
        if ($user->hasRole('ROLE_SUPER_ADMIN')) {
            $users = $repository->findAll();
        } else {
            $company = $user->getCompany();
            $companyId = $company->getId();
            $query = $repository->getListUserByCompany($companyId);
            $users = $query->getQuery()->getResult();
        }
        $handle = fopen('php://memory', 'r+');
        $header = array();

        fputcsv($handle, array('Users name', 'Email', 'Function', 'Role', 'Company'));

        foreach ($users as $user) {
            $roles = $user->getRoles();
            $tab = array(
                $user->getFirstname().' '.$user->getLastname(),
                $user->getEmail(),
                $user->getOccupation(),
                $roles[0],
                $user->getCompany()->getName(),
            );
            fputcsv($handle, $tab);
        }
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);
        $name = 'export_users_'.date('Y-m-d-H:i:s').'.csv';

        return new Response($content, 200, array(
                'Content-Type' => 'application/force-download',
                'Content-Disposition' => 'attachment; filename="'.$name.'"',
            ));
    }

    /**
     * Change user password.
     */
    public function changePasswordAction($id, Request $request)
    {
        $repository = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $repository->findOneById($id);

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form_user = $formFactory->createForm();
        $form_user->setData($user);

        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.change_password.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('clm_user_edit', array('id' => $id));
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            return $response;
        }

        /*return $this->render('UserBundle:User:edit_password_content.html.twig', array(
            'form' => $form->createView(),
            'user' => $user,
        ));*/

        return $this->render('UserBundle:User:edit.html.twig', array(
            'form_password' => $form->createView(),
            'form' => $form_user->createView(),
            'user' => $user,
            'display_modal' => 1,
        ));
    }

    public function updateUserPictureToAvatarAction(Request $request)
    {
        $id = (int) $request->attributes->get('id');
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('UserBundle:User')->find($id);
        $user->setPicture(null);
        $em->flush();

        return new Response($id);
    }
}
