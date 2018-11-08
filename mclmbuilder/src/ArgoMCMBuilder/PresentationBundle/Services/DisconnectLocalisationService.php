<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Service to disconnect localisations Presentations.
 *
 * Class DisconnectLocalisationService
 */
class DisconnectLocalisationService extends parentService
{
    /**
     * DisconnectLocalisationService constructor.
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
     * duplicatePresentation .
     *
     * @param Presentation $masterPres
     * @param Presentation $localPres
     */
    public function duplicatePresentation($masterPres, $localPres)
    {
        $em = $this->em;
        $localPres->setParent(null);
        $localPres->setIsActive($masterPres->getIsActive());
        $localPres->setType('Standard');
        $localPres->setStatus('In progress');
        $localPres->setLock(10);
        $localPres->setThumbnailPath($masterPres->getThumbnailPath());
        $localPres->setVeevaThumbnailPath($masterPres->getVeevaThumbnailPath());
        $localPres->setVeevaFullThumbnailPath($masterPres->getVeevaFullThumbnailPath());
        $localPres->setIsDisconnect(20);
        $localPres->setDevice($masterPres->getDevice());
        $localPres->setProgress($masterPres->getProgress());
        $localPres->setAdditionalText($masterPres->getAdditionalText());
        $localPres->setLastUpDate(new \DateTime());
        $localPres->setCrm($masterPres->getCrm());
        $localPres->setOwner($masterPres->getOwner());
        $localPres->setAgency($masterPres->getAgency());
        $em->flush();
        $refList = $em->getRepository('PresentationBundle:Reference')->findByPresentation($masterPres);
        $this->duplicateReferences($localPres, $refList);

    }

    /**
     * disconnectLocalisation .
     *
     * @param Presentation $masterPres
     * @param Presentation $localPres
     */
    public function disconnectLocalisation($masterPres, $localPres)
    {
        $em             = $this->em;
        $this->duplicatePresentation($masterPres, $localPres);
        $revision       = $masterPres->getRevisions()->last();
        $revDisconnect  = $localPres->getRevisions()->last();
        $this->duplicateRevisions($masterPres, $revision, $revDisconnect);

        /************ duplicate thumbs popin and thumb presentation *************/
        $revId   = $localPres->getRevisions()->last()->getId();
        $oldPres = $masterPres->getId();
        $oldRev  = $masterPres->getRevisions()->last()->getId();
        $presId  = $localPres->getId();

        $this->duplicateThumbs($revId, $oldRev, $presId, $oldPres);
        /*************** end *******************************/

        $em->flush();
    }
}
