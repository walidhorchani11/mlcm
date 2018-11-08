<?php
/**
 * PHP version 5.6 & Symfony 2.8.
 * LICENSE: This source file is subject to version 3.01 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_01.txt.
 *
 * @category   MCMBuilder
 *
 * @author     [DT] Beyrem Chouaieb  <beyrem.chouaieb@argolife.fr>
 * @author     [DEV] Mehrez Bouchaala <Mehrez.bouchaala@argolife.fr>
 * @author     [DEV] Ali Benmacha     <ali.benmacha@argolife.fr>
 * @copyright  Ⓒ 2016 Argolife
 *
 * @see       http://argolife.mcm-builder.com/
 */

namespace ArgoMCMBuilder\ProjectBundle\Controller;

use ArgoMCMBuilder\ProjectBundle\Entity\Project;
use ArgoMCMBuilder\ProjectBundle\Form\Type\CreateProjectFormType;
use ArgoMCMBuilder\UserBundle\Entity\LogTerms;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Elastica\Exception\NotFoundException;

/**
 * Project Controller.
 *
 * @category   MCMBuilder
 *
 * @author     [DT] Beyrem Chouaieb  <beyrem.chouaieb@argolife.fr>
 * @author     [DEV] Mehrez Bouchaala <Mehrez.bouchaala@argolife.fr>
 * @author     [DEV] Ali Benmacha     <ali.benmacha@argolife.fr>
 *
 * @version    GIT: $Id$ In development. Very unstable.
 *
 * @copyright  Ⓒ 2016 Argolife
 *
 * @see       http://argolife.mcm-builder.com/
 */
class ProjectController extends Controller
{
    /**
     * @const ACTIVE Status constant value 20
     */
    const ACTIVE = 20;
    /**
     * @const ARCHIVED Status constant value 10
     */
    const ARCHIVED = 10;

    /**
     * create new project.
     *
     * @param Request $request
     *
     * @return RedirectResponse|Response
     * @Route("/projects/create-new-project", name="projects_create_new_project")
     */
    public function createNewProjectAction(Request $request)
    {
        $user = $this->getUser();
        $project = new Project();
        $form = $this->createForm(
            new CreateProjectFormType($user->getCompany()->getId(), false, null, $user->getRoles()),
            $project
        );
        $session = $request->getSession();

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $projectService = $this->container->get('service.argomcmbuilder_project.project');
                try {
                    $project = $form->getData();
                    $result = $projectService->saveNewProject($project, $user);
                    // TODO translation
                    $session->getFlashBag()->add(
                        'success',
                        $this->get('translator')->trans('project.success.create', array(), 'project')
                    );

                    return new RedirectResponse($this->generateUrl('projects_view', array('id' => $result->getId())));
                } catch (BusinessException $be) {
                    $session->getFlashBag()->add($be->getLevel(), $be->getMessage());
                }
            }
        }

        return $this->render(
            'ProjectBundle:Project:createNewProject.html.twig',
            array(
                'projectForm' => $form->createView(),
            )
        );
    }

    /**
     * delete project.
     *
     * @param Request $request
     * @param int     $id
     * @param string  $fromWhere
     * @Route("/projects/delete-project/{id}/{fromWhere}", defaults={"fromWhere"=""}, name="projects_delete_project")
     *
     * @return RedirectResponse
     */
    public function deleteProjectAction(Request $request, $id, $fromWhere)
    {
        $em = $this->getDoctrine()->getManager();
        $oProject = $em->getRepository('ProjectBundle:Project')->find($id);

        if ($oProject) {
            $em->remove($oProject);
            $em->flush();
            $session = $request->getSession();
            $session->getFlashBag()->add(
                'success',
                $this->get('translator')->trans('project.success.delete', array(), 'project')
            );
        }

        if ('active' === $fromWhere) {
            return $this->redirectToRoute('projects_actives_projects_list');
        } else {
            return $this->redirectToRoute('projects_archives_projects_list');
        }
    }

    /**
     * project Details.
     *
     * @param int $id
     * @Route("/projects/view/{id}" , name="projects_view")
     *
     * @return Response
     */
    public function projectDetailsAction($id)
    {
        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();
        $oProject = $em->getRepository('ProjectBundle:Project')->find($id);
        if ($oProject === null) {
            throw $this->createNotFoundException('Project does not exist');
        }
        $oMasterPresentations = $em->getRepository('PresentationBundle:Presentation')->getPresentationsByType(
            $id,
            'Master',
            $user
        );
        $oStandardPresentations = $em->getRepository('PresentationBundle:Presentation')->getPresentationsByType(
            $id,
            'Standard',
            $user
        );
        $territories = $em->getRepository('UserBundle:Territory')->findAll();
        $listCompId = $em->getRepository('UserBundle:Company')->getAllChildrenRecursive(
            $user->getCompany()->getId()
        );

        return $this->render(
            'ProjectBundle:Project:project_view.html.twig',
            array(
                'project' => $oProject,
                'listMasterPres' => $oMasterPresentations,
                'listStandardPres' => $oStandardPresentations,
                'territories' => $territories,
                'listCompId' => $listCompId,
            )
        );
    }

    /**
     * get Old Data.
     *
     * @param object $entity
     *
     * @return string
     */
    public function getOldData($entity)
    {
        $sIds = '';
        $iCpt = 1;
        foreach ($entity as $items) {
            if (count($entity) > 1) {
                if (1 == $iCpt) {
                    ++$iCpt;
                    $sIds = $sIds.$items->getId();
                } else {
                    $sIds = $sIds.', '.$items->getId();
                }
            } else {
                $sIds = $items->getId();
            }
        }

        return $sIds;
    }

    /**
     * edit Project Action.
     *
     * @param Request $request
     * @param int     $id
     * @Route("/projects/create-edit-project/{id}", name="projects_create_edit_project")
     *
     * @return RedirectResponse|Response
     */
    public function editProjectAction(Request $request, $id)
    {
        if ($request->getMethod() != 'POST' && $request->headers->get('referer') != null) {
            $request->getSession()->set('lastUrl', $request->headers->get('referer'));
        }
        $em = $this->getDoctrine()->getManager();
        $oProject = $em->getRepository('ProjectBundle:Project')->find($id);
        if ($oProject === null) {
            throw $this->createNotFoundException('Project does not exist');
        } else {
            $request = $this->get('request');
            $form = $this->createForm(
                new CreateProjectFormType($oProject->getCompany()->getId(), true, $id),
                $oProject
            );
            $session = $request->getSession();
            if ($request->getMethod() == 'POST') {
                $form->handleRequest($request);

                if ($form->isValid()) {
                    try {
                        $oProject = $form->getData();
                        if ($oProject->getOwner() == null) {
                            $oProject->setOwner($this->getUser());
                        }
                        $em->flush();

                        $session->getFlashBag()->add(
                            'success',
                            $this->get('translator')->trans('project.success.edit', array(), 'project')
                        );

                        return new RedirectResponse($request->getSession()->get('lastUrl'));
                    } catch (BusinessException $be) {
                        $session->getFlashBag()->add($be->getLevel(), $be->getMessage());
                    }
                }
            }
        }

        return $this->render(
            'ProjectBundle:Project:editProject.html.twig',
            array(
                'projectForm' => $form->createView(),
                'project' => $oProject,
                'lastUrl' => $request->getSession()->get('lastUrl'),
            )
        );
    }

    public function get_client_ip() {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    /**
     * @param Request $request
     * @Route("/terms/enable/{flag}", name="terms_enable")
     * @return Response
     */
    public function enableAccess($flag) {
        $em = $this->getDoctrine()->getManager();
        $log = new LogTerms();
        $user = $this->getDoctrine()->getRepository('UserBundle:User')->find($this->getUser()->getId());

        $role = array('ROLE_NO_NAVIGATION');
        if ($flag == 20) {
            $log->setUser($this->getUser());
            $log->setUsername($this->getUser()->getUsername());
            $log->setIp($this->get_client_ip());
            $log->setIsEnabled($flag);
            $em->persist($log);
            foreach ($user->getRoles() as $elt) {
                if ($elt === "ROLE_NO_NAVIGATION") {
                    $oldRoles = array(str_replace(',ROLE_USER,', "", $user->getOldRole()));
                    $user->setRoles($oldRoles);
                    $em->persist($user);
                }
            }

            $em->flush();
            $token = new \Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken(
                $user,
                null,
                'main',
                $user->getRoles()
            );

            $this->container->get('security.context')->setToken($token);

            return new RedirectResponse($this->generateUrl('projects_actives_projects_list'));
        } else {
            $log->setUser($this->getUser());
            $log->setUsername($this->getUser()->getUsername());
            $log->setIp($this->get_client_ip());
            $log->setIsEnabled($flag);
            $em->persist($log);
            $roles = "";
            foreach ($user->getRoles() as $item) {
                  $roles .= $item.",";
            }

        if (strpos($roles, "ROLE_NO_NAVIGATION") === false) {
            $user->setOldRole($roles);
        }
            $user->setRoles($role);
            $em->flush();

            return new RedirectResponse($this->generateUrl('fos_user_security_logout'));
        }

    }

    /**
     * @param Request $request
     * @Route("/terms", name="terms_conditions")
     * @return Response
     */
    public function verifTerms(Request $request) {
        $currentUrl = $request->getSchemeAndHttpHost();
        $enableAccess = false;
        if (!strpos($currentUrl, 'merck')) {
            $enableAccess = true;
        }
        if ($enableAccess) {
            $idCompany = $this->getUser()->getCompany()->getId();
            $em = $this->getDoctrine()->getManager();
            $companiesIds = $em->getRepository('UserBundle:Company')->getAllChildrenRecursive(40);
            if (in_array($idCompany, $companiesIds)) {
                $isEnabled = $em->getRepository('UserBundle:LogTerms')->findOneBy(array('user' => $this->getUser()
                    ->getId()) , array('creationDate' => 'DESC')
                );
                $path = $this->container->getParameter('web_directory');
                $content = file_get_contents("$path/cookies/Pfizer-cgu.html");
                if ($isEnabled) {
                   if ($isEnabled->getIsEnabled() != 20) {
                       return $this->render('FOSUserBundle:Security:terms.html.twig',
                           array(
                               'content' => $content
                           )
                       );
                   }
                } else {
                    return $this->render('FOSUserBundle:Security:terms.html.twig',
                        array(
                            'content' => $content
                        )
                    );
                }
            } else {
                return new RedirectResponse($this->generateUrl('projects_actives_projects_list'));
            }
        }

            return new RedirectResponse($this->generateUrl('projects_actives_projects_list'));
    }

    /**
     * list Actives Projects.
     *
     * @param Request $request
     * @Route("/projects/actives", name="projects_actives_projects_list")
     *
     * @return Response
     */
    public function listActivesProjectsAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {
            $json = $this->getListProjectAjax($request, self::ACTIVE);

            return new Response($json, 200, ['Content-Type' => 'application/json']);
        }

        return $this->render('ProjectBundle:Project:activesProjects.html.twig');
    }

    /**
     * list Archives Projects.
     *
     * @param Request $request
     * @Route("/projects/archives", name="projects_archives_projects_list")
     *
     * @return Response
     */
    public function listArchivesProjectsAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {
            $json = $this->getListProjectAjax($request, self::ARCHIVED);

            return new Response($json, 200, ['Content-Type' => 'application/json']);
        }

        return $this->render('ProjectBundle:Project:archivesProjects.html.twig');
    }

    /**
     * export.
     *
     * @param bool $isActive
     * @Route("/projects/export/list/{isActive}" , name="project_export_list")
     *
     * @return Response
     */
    public function exportAction($isActive)
    {
        $user = $this->getUser();
        $projectRep = $this->getDoctrine()->getRepository('ProjectBundle:Project');
        $data['status'] = '20'; // 20 is Active, 10 is not
        $data['idOwner'] = $this->getUser()->getId();
        $data['idCompany'] = $this->getUser()->getCompany()->getId();
        $data['userRole'] = $user->getRoles();
        $oProjectList = $projectRep->getProjectsByStatus($data, 0, false);

        $handle = fopen('php://memory', 'r+');
        fputcsv($handle, array('Project Name', 'Company', 'Owner', 'start date', 'end date'));

        foreach ($oProjectList as $item) {
            $tab = array(
                $item['name'],
                $item['companyName'],
                $item['ownerFirstName'].' '.$item['ownerLastName'],
                $item['startDate']->format('y/m/d'),
                $item['endDate']->format('y/m/d'),
            );
            fputcsv($handle, $tab);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);
        $name = 'export_projects_'.date('Y-m-d-H:i:s').'.csv';

        return new Response(
            $content,
            200,
            array(
                'Content-Type' => 'application/force-download',
                'Content-Disposition' => 'attachment; filename="'.$name.'"',
            )
        );
    }

    /**
     * user Role.
     *
     * @Route("/projects/{id}/users-role", name="projects_users_role")
     *
     * @param int $id
     *
     * @return Response
     */
    public function userRoleAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($id);
        $listUsers = $em->getRepository('UserBundle:User')->findByCompanyAndRole(
            $presentation->getCompany()->getId(),
            'ROLE_BASIC_USER',
            'ROLE_MANAGER',
            'ROLE_ADMIN'
        )->getQuery()->execute();
        $owner = $presentation->getOwner();
        if (!in_array($owner, $listUsers)) {
            array_push($listUsers, $owner);
        }
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($id);

        return $this->render(
            'ProjectBundle:Project:user_role.html.twig',
            array(
                'users' => $listUsers,
                'presentation' => $presentation,
            )
        );
    }

    /**
     * is Unique Title.
     *
     * @Method("GET")
     *
     * @param Request $request
     * @Route("/project/isUnique", name="is_unique_title")
     *
     * @return JsonResponse
     */
    public function isUniqueTitleAction(Request $request)
    {
        $name = $request->query->get('name');
        $project = $this->getDoctrine()->getRepository('ProjectBundle:Project')->findOneByName($name);
        if ($project) {
            return new JsonResponse(array('success' => false));
        } else {
            return new JsonResponse(array('success' => true));
        }
    }

    /**
     * user Role Affect.
     *
     * @Method("POST")
     *
     * @param Request $request
     * @Route("/projects/users-affect", name="projects_users_affect")
     *
     * @return JsonResponse
     */
    public function userRoleAffectAction(Request $request)
    {
        $role = $request->request->get('role');
        $uid = $request->request->get('uid');
        $pid = $request->request->get('pid');
        $revoke = $request->request->get('revoke');

        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('UserBundle:User')->find($uid);
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($pid);
        $presentationService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        if ($presentation->getStatus() != 'Approved' and $presentation->getType() == 'Master') {
            foreach ($presentation->getChildren() as $presentationChildren) {
                $presentationService->userAffect($role, $presentationChildren, $revoke, $user);
            }
        }
        $presentationService->userAffect($role, $presentation, $revoke, $user);
        $em->flush();

        return new JsonResponse(array('revoke' => $revoke, 'role' => $role, 'uid' => $uid, 'pid' => $pid));
    }

    /**
     * duplicate Project.
     *
     * @param int     $idProject
     * @param Request $request
     * @Route("/projects/duplicate-project/{idProject}", name="projects_duplicate_project")
     *
     * @return RedirectResponse
     */
    public function duplicateProjectAction($idProject, Request $request)
    {
        $session = $request->getSession();
        $projectToClone = $this->container->get('mcm.cloner_project');
        $result = $projectToClone->duplicate($idProject);
        if ($result) {
            $session->getFlashBag()->add('notice', 'This project cannot be duplicated cause of pres "'.$result.'"');
        } else {
            $session->getFlashBag()->add(
                'success',
                $this->get('translator')->trans('project.success.duplicate', array(), 'project')
            );
        }

        return $this->redirectToRoute('projects_actives_projects_list');
    }

    /**
     * change State.
     *
     * @todo Short Descriptions must be added for all MCM functions
     *
     * @param int $id
     * @param int $activeOrArchive
     *
     * @throws NotFoundException if Project was not Found
     * @Route("projects/change-state/{id}/{activeOrArchive}", name="projects_change_state")
     *
     * @return RedirectResponse
     */
    public function changeStateAction($id, $activeOrArchive)
    {
        $em = $this->getDoctrine()->getManager();
        $project = $em->getRepository('ProjectBundle:Project')->find($id);

        if (null !== $project) {
            if ('archive' === $activeOrArchive) {
                $project->setStatus(self::ACTIVE);
                $aPresentations = $project->getPresentations();
                foreach ($aPresentations as $presentation) {
                    $presentation->setIsActive(self::ACTIVE);
                }
                $em->flush();

                return new RedirectResponse($this->generateUrl('projects_archives_projects_list'));
            } elseif ('active' === $activeOrArchive) {
                $project->setStatus(self::ARCHIVED);
                $aPresentations = $project->getPresentations();
                foreach ($aPresentations as $presentation) {
                    $presentation->setIsActive(self::ARCHIVED);
                }
                $em->flush();

                return new RedirectResponse($this->generateUrl('projects_actives_projects_list'));
            }
        }

        throw $this->createNotFoundException('Project was not Found');
    }

    /**
     * get List Project Ajax.
     *
     * @param Request $request
     * @param int     $status
     *
     * @return string
     */
    public function getListProjectAjax(Request $request, $status)
    {
        // Param for pagination
        $user = $this->getUser();
        $length = $request->get('length');
        $length = $length && ($length != -1) ? $length : 0;
        $start = $request->get('start');
        $start = $length ? ($start && ($start != -1) ? $start : 0) / $length : 0;

        $search = $request->get('search');
        $order = $request->get('order');
        $data = ['query' => @$search['value']];

        $data['status'] = $status; // 20 is Active, 10 is not
        $data['idOwner'] = $this->getUser()->getId();
        $data['idCompany'] = $this->getUser()->getCompany()->getId();
        $data['order'] = $order[0];
        $data['company'] = $request->get('companyName');
        $data['owner'] = $request->get('ownerName');
        $data['startDate'] = $request->get('startDate');
        $data['userRole'] = $user->getRoles();

        $em = $this->getDoctrine()->getManager();
        $projectRep = $em->getRepository('ProjectBundle:Project');
        $filteredProjects = $projectRep->getProjectsByStatus($data, $start, $length, true);
        $allProjects = $projectRep->getProjectsByStatus($data, 0, false);
        $listCompUser = $em->getRepository('UserBundle:Company')->getAllChildrenRecursive($user->getCompany()->getId());
        $output = array(
            'data' => array(),
            'recordsFiltered' => count($allProjects), // $filters, 0, false
            'recordsTotal' => count($allProjects),
            'userRole' => $user->getRoles(),
            'userId' => $user->getId(),
            'filter' => array(),
            'listCompUser' => $listCompUser,
        );
        foreach ($allProjects as $one) {
            $output['filter'][] = [
                'companyName' => $one['companyName'],
            ];
        }
        $activeOrArchive = $request->get('twigParent');
        $cpt = 0;
        foreach ($filteredProjects as $project) {
            $basicUsersPres[$cpt] = array();
            $oProject = $this->getDoctrine()->getRepository('ProjectBundle:Project')->find($project['idProject']);
            foreach ($oProject->getPresentations() as $presentation) {
                if ($presentation->getOwner()) {
                    array_push($basicUsersPres[$cpt], $presentation->getOwner()->getId());
                }
                if ($presentation->getEditors()) {
                    foreach ($presentation->getEditors() as $editor) {
                        array_push($basicUsersPres[$cpt], $editor->getId());
                    }
                }
                if ($presentation->getViewers()) {
                    foreach ($presentation->getViewers() as $viewer) {
                        array_push($basicUsersPres[$cpt], $viewer->getId());
                    }
                }
            }
            array_push($basicUsersPres[$cpt], $project['idOwner']);
            $basicUsersPres[$cpt] = array_values(array_unique($basicUsersPres[$cpt]));
            if ($user->hasRole('ROLE_MANAGER') || $user->hasRole('ROLE_ADMIN') || $user->hasRole('ROLE_SUPER_ADMIN')
                || in_array($user->getId(), $basicUsersPres[$cpt])
            ) {
                $url = $this->generateUrl(
                    'projects_change_state',
                    array(
                        'id' => $project['idProject'],
                        'activeOrArchive' => $activeOrArchive,
                    )
                );
                $deleteUrl = $this->generateUrl(
                    'projects_delete_project',
                    array(
                        'id' => $project['idProject'],
                        'fromWhere' => $activeOrArchive,
                    )
                );
                $editUrl = $this->generateUrl('projects_create_edit_project', array('id' => $project['idProject']));
                $viewUrl = $this->generateUrl('projects_view', array('id' => $project['idProject']));
                $duplicateUrl = $this->generateUrl(
                    'projects_duplicate_project',
                    array('idProject' => $project['idProject'])
                );
                $title = ($activeOrArchive == "active") ? $this->get('translator')->trans('project.archive.title', array(), 'project') : $this->get('translator')->trans('project.active.title', array(), 'project');
                $output['data'][] = [
                    'projectName' => $project['name'],
                    'company' => $project['companyName'],
                    'owner' => $project['ownerFirstName'].' '.$project['ownerLastName'],
                    'ownerId' => $project['ownerId'],
                    'startDate' => $project['startDate']->format('Y-m-d'),
                    'actions' => "<a href=\"#\" class=\"$activeOrArchive-project actions\"
                                     data-href=\"$url\" title =\"$title\" data-toggle=\"tooltip\"><span></span></a>",
                    'editUrl' => $editUrl,
                    'urlDuplicate' => $duplicateUrl,
                    'viewUrl' => $viewUrl,
                    'deleteUrl' => $deleteUrl,
                    'location' => $activeOrArchive,
                    'basicUsersPres' => $basicUsersPres[$cpt],
                    'companyId' => $project['idCompany'],
                ];
            } else {
                $output['recordsFiltered'] = $output['recordsFiltered'] - 1;
                $output['recordsTotal'] = $output['recordsTotal'] - 1;
            }
            ++$cpt;
        }

        return json_encode($output);
    }
}
