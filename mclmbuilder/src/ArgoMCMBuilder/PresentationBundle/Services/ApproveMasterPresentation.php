<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Service to approve localisations Presentations.
 *
 * Class ApproveMasterPresentation
 */
class ApproveMasterPresentation extends parentService
{
    /**
     * ApproveMasterPresentation constructor.
     *
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
     * Clone Presentation.
     *
     * @param Presentation $master
     * @param Presentation $child
     *
     * @return Presentation Presentation
     */
    public function copyPresentations($master, $child)
    {

        $child->setIsActive($master->getIsActive());
        $child->setLock($master->getLock());
        $child->setIsDisconnect($master->getIsDisconnect());
        $child->setDevice($master->getDevice());
        $child->setThumbnailPath($master->getThumbnailPath());
        $child->setStatus('In progress');
        $child->setVeevaThumbnailPath($master->getVeevaThumbnailPath());
        $child->setVeevaFullThumbnailPath($master->getVeevaFullThumbnailPath());
        $child->setProgress($master->getProgress());
        $child->setAdditionalText($master->getAdditionalText());
        $child->setLastUpDate(new \DateTime());
        $child->setCrm($master->getCrm());
        $child->setOwner($master->getOwner());
        $child->setAgency($master->getAgency());

        $refRep  = $this->em->getRepository('PresentationBundle:Reference');
        $refList = $refRep->findByPresentation($master);
        $this->duplicateReferences($child, $refList);

        return $child;
    }

    /**
     * Duplicate children of master presentation.
     *
     * @param Presentation $master
     * @param Presentation $child
     */
    public function copyChildren($master, $child)
    {

        $child             = $this->copyPresentations($master, $child);
        $childLastRevision = $child->getRevisions()->last();
        $revision          = $master->getRevisions()->last();
        $this->duplicateRevisions($master, $revision, $childLastRevision);

            /************ duplicate thumbs popin and thumb presentation *************/
        $revId   = $childLastRevision->getId();
        $presId  = $child->getId();
        $oldPres = $master->getId();
        $oldRev  = $master->getRevisions()->last()->getId();

        $this->duplicateThumbs($revId, $oldRev, $presId, $oldPres);
            /**************** end ************************************/

    }

    /**
     * Duplicate master presentation.
     *
     * @param int          $idMaster
     * @param Presentation $child
     */
    public function copyMaster($idMaster, $child = null)
    {
        $em     = $this->em;
        $master = $em->getRepository('PresentationBundle:Presentation')->findMaster($idMaster)[0];
        if ($child != null and $child->getStatus() != 'In progress') {
            $this->copyChildren($master, $child);
        } else {
            $master->setLastUpDate(new \DateTime());
            $master->setStatus('Approved');
            $master->setLock(20);
        }
        $em->flush();
    }
}
