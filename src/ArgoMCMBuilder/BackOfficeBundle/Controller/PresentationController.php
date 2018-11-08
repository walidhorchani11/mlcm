<?php
/**
 * Created by PhpStorm.
 * User: BenMacha
 * Date: 22/05/17
 * Time: 17:12.
 */

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Presentation Controller.
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
 * @Route("/admin/presentations")
 */
class PresentationController extends Controller
{
    /**
     * List all Presentations entities.
     *
     * @Route("/", name="presentations_admin_index")
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
        $dir = $this->container->getParameter('web_directory');
        $thumbnails = $this->container->getParameter('presentations_thumbnails');
        if ($request->isXmlHttpRequest()) {
            $get = $request->query->all();
            $em = $this->getDoctrine();
            $rResult = $em->getRepository('PresentationBundle:Presentation')->ajaxTable($get);
            $result = array();
            foreach ($rResult['data'] as $presentation) {
                $presentation['popins'] = count(glob($dir.'/'.$thumbnails.'/'.$presentation['id'].'-'.$presentation['revision'].'/popin-*.png', GLOB_BRACE));
                $presentation['slides'] = count(glob($dir.'/'.$thumbnails.'/'.$presentation['id'].'-'.$presentation['revision'].'/slides/screen-200-*.jpg', GLOB_BRACE));
                $presentation['checked'] = $presentation['id'].'/'.$presentation['revision'];
                if ($presentation['slide'] > 0) {
                    $result[] = $presentation;
                }
            }
            $rResult['data'] = $result;

            return new JsonResponse($rResult);
        }

        return $this->render('@BackOffice/presentations/index.html.twig');
    }
}
