<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Service to clone Presentations.
 *
 * Class ClonePresentationService
 */
class ClonerPresentationService extends parentService
{
    private $webDirectory;

    /**
     * ClonerPresentationService constructor.
     * @param EntityManager $em
     * @param string        $webDirectory
     * @param Filesystem    $fileSystem
     * @param string        $thumbnail
     */
    public function __construct($em, $webDirectory, $fileSystem, $thumbnail)
    {
        $this->em           = $em;
        $this->webDirectory = $webDirectory;
        $this->fileSystem   = $fileSystem;
        $this->thumbnail    = $thumbnail;
    }

    /**
     * @param Presentation $clonePresentation
     */
    public function duplicatePresentations($clonePresentation)
    {
        $em        = $this->em;
        $project   = $clonePresentation->getProject();
        $clonePres = $this->duplicateElements($clonePresentation);
        $clonePres->setProject($project);
        $em->persist($clonePres);
        if (count($clonePresentation->getChildren()) > 0) {
            foreach ($clonePresentation->getChildren() as $pres) {
                $presClone = $this->duplicateElements($pres, $clonePres);
                $presClone->setProject($project);
                $em->persist($presClone);
            }
        }
    }

    /**
     * @param integer $idPresentation
     * @param null    $action
     */
    public function duplicate($idPresentation, $action = null)
    {
        $em                = $this->em;
        $clonePresentation = $em->getRepository('PresentationBundle:Presentation')->find($idPresentation);
        $this->duplicatePresentations($clonePresentation);
        $em->flush();
    }
}
