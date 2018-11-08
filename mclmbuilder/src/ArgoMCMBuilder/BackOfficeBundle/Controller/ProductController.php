<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use ArgoMCMBuilder\BackOfficeBundle\Entity\Product;
use ArgoMCMBuilder\BackOfficeBundle\Form\ProductType;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Product controller.
 *
 * @Route("/product")
 */
class ProductController extends Controller
{
    /**
     * Lists all Product entities.
     *
     * @Route("/", name="products")
     * @Route("/", name="product_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $products = $em->getRepository('BackOfficeBundle:Product')->findAll();

        return $this->render(
            'BackOfficeBundle:Product:index.html.twig',
            array(
                'products' => $products,
            )
        );
    }

    /**
     * Creates a new Product entity.
     *
     * @Route("/new", name="product_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $product = new Product();
        $user = $this->getUser();
        $form = $this->createForm(new ProductType($user->getCompany()->getId(), $user->getRoles()), $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($product);
            $em->flush();

            //return $this->redirectToRoute('product_show', array('id' => $product->getId()));
            return $this->redirectToRoute('products');
        }

        return $this->render(
            'BackOfficeBundle:Product:new.html.twig',
            array(
                'product' => $product,
                'form' => $form->createView(),
            )
        );
    }

    /**
     * Finds and displays a Product entity.
     *
     * @Route("/{id}", name="product_show")
     * @Method("GET")
     */
    public function showAction(Product $product)
    {
        $deleteForm = $this->createDeleteForm($product);

        return $this->render(
            'BackOfficeBundle:Product:show.html.twig',
            array(
                'product' => $product,
                'delete_form' => $deleteForm->createView(),
            )
        );
    }

    /**
     * Displays a form to edit an existing Product entity.
     *
     * @Route("/{id}/edit", name="product_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Product $product)
    {
        $deleteForm = $this->createDeleteForm($product);
        $user = $this->getUser();
        $editForm = $this->createForm(new ProductType($user->getCompany()->getId(), $user->getRoles()), $product);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($product);
            $em->flush();

            return $this->redirectToRoute('product_index');
        }

        return $this->render(
            'BackOfficeBundle:Product:edit.html.twig',
            array(
                'product' => $product,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
            )
        );
    }

    /**
     * Deletes a Product entity.
     *
     * @Route("/{id}/remove", name="product_delete")
     * @Method({"GET","DELETE"})
     */
    public function deleteAction(Request $request, Product $product)
    {
        $form = $this->createDeleteForm($product);
        $form->handleRequest($request);

        //if ($form->isSubmitted() && $form->isValid()) {
        $em = $this->getDoctrine()->getManager();
        $em->remove($product);
        $em->flush();

        //}

        return $this->redirectToRoute('product_index');
    }

    /**
     * Creates a form to delete a Product entity.
     *
     * @param Product $product The Product entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Product $product)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('product_delete', array('id' => $product->getId())))
            ->setMethod('DELETE')
            ->getForm();
    }

    /**
     * @Method("GET")
     * @Route("/product/getProductsByCompany", name="get_products_by_company")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getProductsByCompanyAction(Request $request)
    {
        $companyId = $request->query->get('idCompany');
        $listProducts = array();
        if ($companyId) {
            $listProducts = $this->getDoctrine()->getRepository('BackOfficeBundle:Product')
                ->findProductsByCompany($companyId);

            return new JsonResponse(array('listProducts' => $listProducts));
        }

        return new JsonResponse(array());
    }
}
