<?php
/**
 * Created by PhpStorm.
 * User: argolife
 * Date: 13/07/16
 * Time: 09:46 ص.
 */

namespace ArgoMCMBuilder\UserBundle\Controller;

use FOS\UserBundle\Controller\SecurityController as BaseController;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\SecurityContextInterface;


class SecurityController extends BaseController
{
    protected function renderLogin(array $data)
    {
        $request = $this->getRequest();
        $currentUrl = $request->getSchemeAndHttpHost();
        $enableCookie = false;
        if (strpos($currentUrl, 'trial')) {
            $enableCookie = true;
        }
        $path = $this->container->getParameter('web_directory');
        $content = file_get_contents("$path/cookies/Pfizer-cgu.html");


        $securityContext = $this->container->get('security.authorization_checker');

        if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->render('BackOfficeBundle:Dashboard:index.html.twig');
        }

        return $this->render('FOSUserBundle:Security:login.html.twig',
            array(
                'data' => $data,
                'content' => $content,
                'enableCookie' => $enableCookie
            )
            );
    }

    public function logoutAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        if ($request->attributes->has(SecurityContextInterface::ACCESS_DENIED_ERROR)) {
            $error = $request->attributes->get(SecurityContextInterface::ACCESS_DENIED_ERROR);
        } else {
            $error = $session->get(SecurityContextInterface::ACCESS_DENIED_ERROR);
            $session->remove(SecurityContextInterface::ACCESS_DENIED_ERROR);
        }

        if ($this->has('security.csrf.token_manager')) {
            $csrfToken = $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue();
        } else {
            // BC for SF < 2.4
            $csrfToken = $this->has('form.csrf_provider')
                ? $this->get('form.csrf_provider')->generateCsrfToken('authenticate')
                : null;
        }

        return $this->render(
            'FOSUserBundle:Security:login.html.twig',
            array(
                'csrf_token' => $csrfToken,
                'last_username' => $session->get(SecurityContextInterface::LAST_USERNAME),
                'error' => $error,
            )
        );
        // throw new \RuntimeException('test test');
    }
}
