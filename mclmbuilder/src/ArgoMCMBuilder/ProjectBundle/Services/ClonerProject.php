<?php
/**
 * Created by PhpStorm.
 * User: argo
 * Date: 16.01.17
 * Time: 16:18.
 */

namespace ArgoMCMBuilder\ProjectBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Services\parentService;
use ArgoMCMBuilder\ProjectBundle\Entity\Project;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class ClonerProject
 * @package ArgoMCMBuilder\ProjectBundle\Services
 */
class ClonerProject extends parentService
{

    /**
     * ClonerProject constructor.
     * @param EntityManager $em
     * @param Filesystem    $fileSystem
     * @param string        $thumbnail
     */
    public function __construct($em, $fileSystem, $thumbnail)
    {
        $this->em         = $em;
        $this->fileSystem = $fileSystem;
        $this->thumbnail  = $thumbnail;
    }

    /**
     * @param Project      $projectClone
     * @param Presentation $clonePresentation
     * @return mixed
     */
    public function duplicatePresentations($projectClone, $clonePresentation)
    {
        $em = $this->em;
        foreach ($clonePresentation as $item) {
            if ($item->getCompany() == null) {
                return $item->getName();
                break;
            }
            $clonePres = $this->duplicateElements($item, null, $projectClone);
            $clonePres->setProject($projectClone);
            $em->persist($clonePres);
            if (count($item->getChildren()) > 0) {
                foreach ($item->getChildren() as $pres) {
                    $presClone = $this->duplicateElements($pres, $clonePres, $projectClone);
                    $presClone->setProject($projectClone);
                    $em->persist($presClone);
                }
            }
        }
    }

    /**
     * @param integer $idProject
     * @return mixed
     */
    public function duplicate($idProject)
    {
        $em           = $this->em;
        $projectRep   = $em->getRepository('ProjectBundle:Project');
        $project      = $projectRep->find($idProject);
        $projectClone = clone($project);
        $projectClone->setName($projectClone->getName().'_duplicated');
        $projectClone->clearId();
        $presRep      = $em->getRepository('PresentationBundle:Presentation');
        $masterPres   = $presRep->findBy(array(
            'project' => $project,
            'type'    => 'Master',
        ));
        $standardPres = $presRep->findBy(array(
            'project' => $project,
            'type'    => 'Standard',
        ));
        $presentations = array_merge($masterPres, $standardPres);
        $result        = $this->duplicatePresentations($projectClone, $presentations);
        if ($result) {
            return $result;
        } else {
            $countDuplicated = count($projectRep->countDuplicatedProject($projectClone->getName()));
            $projectClone->setName($projectClone->getName().$countDuplicated);
            $em->persist($projectClone);
            $em->flush();
        }
    }
}
