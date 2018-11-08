<?php

namespace ArgoMCMBuilder\PresentationBundle\Controller\V1;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\JsonResponse;

class ProductsController extends FOSRestController
{
	/**
	 * @return \symfony\component\HtpFoundation\Response
	 * @Rest\Get("/products")
	 * @Rest\View
	 */
	public function getAction()
	{
		$res = $this->getDoctrine()->getRepository('PresentationBundle:Presentation')->find(1);
		$view = $this->view($res, 200);
		return $this->handleView($view);
	}
}