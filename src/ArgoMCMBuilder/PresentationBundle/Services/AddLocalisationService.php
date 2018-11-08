<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\UserBundle\Entity\Company;
use ArgoMCMBuilder\UserBundle\Entity\Territory;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Service to add localisations to a Master Presentations.
 *
 * Class AddLocalisationService
 */
class AddLocalisationService extends parentService
{


    /**
     * Doctrine Entity Manager.
     */
    protected $em;

    /**
     * FileSystem service.
     */
    protected $fileSystem;

    /**
     * Container
     */
    protected $container;

    /**
     * AddLocalisationService constructor.
     *
     * @param EntityManager $em
     * @param Filesystem    $fileSystem
     * @param string        $thumbnail
     * @param Container     $container
     */
    public function __construct($em, $fileSystem, $thumbnail, $container)
    {
        $this->em         = $em;
        $this->fileSystem = $fileSystem;
        $this->thumbnail  = $thumbnail;
        $this->container  = $container;
    }

    /**
     * duplicatePresentation
     *
     * @param Presentation $clonePres
     * @param Territory    $territory
     * @param Company      $company
     * @return Presentation
     */
    public function duplicatePresentation($clonePres, $territory, $company)
    {
        $presClone = clone($clonePres);
        $presClone->clearId();
        $presClone->setName(
            str_replace($clonePres->getTerritory()->getName(), $territory->getName(), $clonePres->getName())
        );
        $presClone->setParent($clonePres);
        $presClone->setType('Localisation');
        $presClone->setStatus('In progress');
        $presClone->setLock(10);
        $presClone->setIsDisconnect(10);
        $presClone->setTerritory($territory);
        $presClone->setCreationDate(new \DateTime());
        $presClone->setLastUpDate(new \DateTime());

        if ($company) {
            $company = $this->em->getRepository('UserBundle:Company')->find($company);
            $presClone->setCompany($company);
        } else {
            $presClone->setCompany($clonePres->getCompany());
        }
        $refRep  = $this->em->getRepository('PresentationBundle:Reference');
        $refList = $refRep->findByPresentation($clonePres);
        $this->em->persist($presClone);
        $this->duplicateReferences($presClone, $refList);

        return $presClone;
    }


    /**
     * @param Presentation   $pres
     * @param Territory|null $territory
     * @param Company        $company
     */
    public function duplicatePresentations($pres, $territory = null, $company = null)
    {
        $em           = $this->em;
        $project      = $pres->getProject();
        $presClone    = $this->duplicatePresentation($pres, $territory, $company);
        $em->persist($presClone);
        //$em->flush($presClone);
        $revision     = $pres->getRevisions()->last();
        $revId        = $this->duplicateRevisions($presClone, $revision);
        $presId       = $presClone->getId();
        $oldRev       = $pres->getRevisions()->last()->getId();
        $oldPres      = $pres->getId();
        $this->duplicateThumbs($revId, $oldRev, $presId, $oldPres);
        $presClone->setProject($project);
        $em->persist($presClone);
    }

    /**
     * @param int       $idPresentation
     * @param Territory $territory
     * @param Company   $company
     */
    public function addLocalisation($idPresentation, $territory, $company)
    {
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        $em                = $this->em;
        $oTerritory        = $this->em->getRepository('UserBundle:Territory')->find($territory);
        $clonePresentation = $em->getRepository('PresentationBundle:Presentation')->find($idPresentation);
        $company = ($company != null || $company !== "") ? $company : $clonePresentation->getCompany()->getId();
        if ($clonePresentation->getStatus() == 'Approved') {
            $this->duplicatePresentations($clonePresentation, $oTerritory, $company);
        } else {
            $this->createPresentationByTerritories(
                $clonePresentation,
                $oTerritory,
                $clonePresentation->getName(),
                $company,
                $user
            );
        }
        $em->flush();
    }

}
