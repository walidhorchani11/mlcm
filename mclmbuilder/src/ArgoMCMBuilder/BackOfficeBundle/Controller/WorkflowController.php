<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class WorkflowController.
 */
class WorkflowController extends Controller
{
    /**
     * @Route("/workflows", name="workflows")
     */
    public function indexAction()
    {
        $path = $this->container->get('clm.backoffice_path_twig')->getAbsolutePath(
            'BackOfficeBundle:Workflow:list.html.twig'
        );

        return $this->render(
            'BackOfficeBundle:Workflow:list.html.twig',
            array(
                'twigPath' => $path,
            )
        );
    }

    /**
     * @Route("/workflows/create-new-workflow/mi-system", name="workflow_create_new_workflow_mi")
     */
    public function createNewWorkflowMIAction()
    {
        $path = $this->container->get('clm.backoffice_path_twig')->getAbsolutePath(
            'BackOfficeBundle:Workflow:createNewWorkflowMI.html.twig'
        );

        return $this->render(
            'BackOfficeBundle:Workflow:createNewWorkflowMI.html.twig',
            array(
                'twigPath' => $path,
            )
        );
    }

    /**
     * @Route("/workflows/create-new-workflow/veeva", name="workflow_create_new_workflow_veeva")
     */
    public function createNewWorkflowVeevaAction()
    {
        $path = $this->container->get('clm.backoffice_path_twig')->getAbsolutePath(
            'BackOfficeBundle:Workflow:createNewWorkflowVeeva.html.twig'
        );

        return $this->render(
            'BackOfficeBundle:Workflow:createNewWorkflowVeeva.html.twig',
            array(
                'twigPath' => $path,
            )
        );
    }

    /**
     * @Route("/workflows/create-new-workflow/unspecified", name="workflow_create_new_workflow_unspecified")
     */
    public function createNewWorkflowUnspecifiedAction()
    {
        $path = $this->container->get('clm.backoffice_path_twig')->getAbsolutePath(
            'BackOfficeBundle:Workflow:createNewWorkflowUnspecified.html.twig'
        );

        return $this->render(
            'BackOfficeBundle:Workflow:createNewWorkflowUnspecified.html.twig',
            array(
                'twigPath' => $path,
            )
        );
    }
}
