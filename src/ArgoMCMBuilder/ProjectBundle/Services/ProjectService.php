<?php

namespace ArgoMCMBuilder\ProjectBundle\Services;

use ArgoMCMBuilder\ProjectBundle\Entity\Project;
use ArgoMCMBuilder\UserBundle\Entity\User;

class ProjectService
{
    /**
     * Log interface.
     */
    private $logger;

    /**
     * Doctrine Entity Manager.
     */
    private $entityManager;

    /**
     * Translator service.
     */
    private $translatorService;

    /**
     * Constructor.
     */
    public function __construct($entityManager, $logger, $translatorService)
    {
        $this->entityManager = $entityManager;
        $this->logger = $logger;
        $this->translatorService = $translatorService;

        return $this;
    }

    /**
     * @param Project $project
     * @param User    $user
     *
     * @return Project
     */
    public function createProject(Project $project, User $user)
    {
        /* set default values */
        if ($project->getOwner() == null) {
            $project->setOwner($user);
        }
        $project->setStartDate(new \DateTime($project->getStartDate()));
        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $project;
    }

    /**
     * Save New project request.
     *
     * @param Project $project
     * @param $user
     * @param $form
     *
     * @return Project
     */
    public function saveNewProject(Project $project, User $user)
    {
        $project = $this->createProject($project, $user);

        return $project;
    }

    public function getListProjectForExport($user, $isActive)
    {
        return  $this->entityManager->getRepository('ProjectBundle:Project')->getProjectsByStatus(
                                                                array(
                                                                    'idCompany' => $user->getCompany()->getId(),
                                                                    'userRole' => $user->getRoles(),
                                                                    'status' => $isActive,
                                                                ));
    }
}
