<?php
/**
 * Created by PhpStorm.
 * User: BenMacha
 * Date: 23/05/17
 * Time: 12:46.
 */

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use ArgoMCMBuilder\UserBundle\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * ConnectedUser Controller.
 *
 * @category   MCMBuilder
 *
 * @author     [DT] Beyrem Chouaieb  <beyrem.chouaieb@argolife.fr>
 * @author     [DEV] Ali Benmacha     <ali.benmacha@argolife.fr>
 *
 * @version    GIT: $Id$ In development. Very unstable.
 *
 * @copyright  Ⓒ 2016 Argolife
 *
 * @see       http://argolife.mcm-builder.com/
 *
 * @Route("/admin/connected_user")
 */
class ConnectedUserController extends Controller
{
    /**
     * List all ConnectedUser.
     *
     * @Route("/", name="connected_user")
     * @Method("GET")
     *
     * @param Request $request
     *
     * @throws NotFoundHttpException
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        if ($this->container->getParameter('kernel.environment') != 'dev' and !$this->isGranted('ROLE_SUPER_ADMIN')) {
            throw new NotFoundHttpException();
        }
        if ($request->isXmlHttpRequest()) {
            $get = $request->query->all();

          /** @var User $userSession */
          $prefix = $this->container->getParameter('snc_redis.session.prefix');

            $redis = $this->container->get('snc_redis.session');
            $array = $redis->keys($prefix.'*');
            $users = array();
            foreach ($array as $key) {
                try {
                    $sesionUser = str_replace('_sf2_attributes|', '', $redis->get($key));
                    $metaUser = strpos($sesionUser, '_sf2_meta|');
                    $metaUser = substr($sesionUser, $metaUser);

                    $metaUser = unserialize(str_replace('_sf2_meta|', '', $metaUser));
                    $sesionUser = unserialize($sesionUser);

                    if (!empty($sesionUser)) {
                        if (array_key_exists('_security_main', $sesionUser)) {
                            $user = array();
                            $userSession = unserialize($sesionUser['_security_main'])->getUser();

                            $user['id'] = $userSession->getId();
                            $user['firstname'] = $userSession->getFirstname();
                            $user['lastname'] = $userSession->getLastname();
                            $user['email'] = $userSession->getEmail();
                            $user['lastacces'] = date('Y-m-d H:i:s', $metaUser['u']);
                            $user['connection'] = date('Y-m-d H:i:s', $metaUser['c']);
                            $user['key'] = $key;

                            $users[] = $user;
                        }
                    }
                } catch (\Exception $e) {
                }
            }
            $output = array(
            'request' => $get,
            'draw' => $get['draw'],
            'recordsTotal' => count($users),
            'recordsFiltered' => count($users),
            'data' => $users,
          );

            return new JsonResponse($output);
        }

        return $this->render('@BackOffice/connecteduser/index.html.twig');
    }

    /**
     * Fire connected user.
     *
     * @Route("/", name="connected_user_fire")
     * @Method("POST")
     *
     * @param Request $request
     *
     * @throws NotFoundHttpException
     *
     * @return JsonResponse
     */
    public function fireAction(Request $request)
    {
        if ($this->container->getParameter('kernel.environment') != 'dev' and !$this->isGranted('ROLE_SUPER_ADMIN')) {
            throw new NotFoundHttpException();
        }
        $redis = $this->container->get('snc_redis.session');
        $redis->del($request->get('key'));

        return new JsonResponse(array($request->get('key'), $request->get('id')));
    }
}
