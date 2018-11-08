<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
//use ArgoMCMBuilder\PresentationBundle\Entity\Slider;

class PresentationService extends parentService
{
    /**
     * Log interface.
     */
    private $logger;

    /**
     * Doctrine Entity Manager.
     */
    protected $em;

    /**
     * Translator service.
     */
    private $translatorService;
    /**
     * FileSystem service.
     */
    protected $fileSystem;
    /**
     * @var
     */
    private $mainDirectory;

    /**
     * @var
     */
    private $container;

    /**
     * Constructor.
     */
    public function __construct($entityManager, $logger, $translatorService, $fileSystem, $mainDirectory, $container)
    {
        $this->em = $entityManager;
        $this->logger = $logger;
        $this->translatorService = $translatorService;
        $this->fileSystem = $fileSystem;
        $this->mainDirectory = $mainDirectory;
        $this->container = $container;

        return $this;
    }

    public function CreateNewPresentation($presentation, $form, $territories = null, $companies = null)
    {
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        if ($presentation->getType() == 'Standard') {
            $presentation->setLock(10);
            $presentation->setStatus('In progress');
            $this->em->persist($presentation);
            $this->createSliderAndRevision($presentation, $user);
            $this->em->flush();
        } else {
            $presMasterName = $presentation->getName();
            $presentation->setName($presMasterName.'_'.$presentation->getTerritory()->getName());
            $presentation->setType('Master');
            $presentation->setLock(10);
            $presentation->setStatus('In progress');
            $this->em->persist($presentation);
            $this->createSliderAndRevision($presentation, $user);

            for ($i = 0; $i < sizeof($territories); ++$i) {
                $this->createPresentationByTerritories(
                    $presentation,
                    $territories[$i],
                    $presMasterName,
                    $companies[$i],
                    $user
                );
            }
            $this->em->flush();
        }

        return $presentation->getId();
    }

    public function EditPresentationForm($presentation, $form, $territories = null, $companies = null)
    {
        if ($presentation->getType() == 'Standard') {
            if ($presentation->getChildren()) {
                $localisations = $presentation->getChildren();
                foreach ($localisations as $localisation) {
                    $this->em->remove($localisation);
                }
            }
            $this->em->flush();
        } else {
            $presMasterName = $presentation->getName();
            $aName = explode('_', $presMasterName);
            $presMasterName = str_replace('_'.end($aName), '', $presMasterName);
            $presentation->setName($presMasterName.'_'.$presentation->getTerritory()->getName());
            $oldLocalisations = $presentation->getChildren();
            $oldLocalisationsArray = array();
            if ($oldLocalisations) {
                foreach ($oldLocalisations as $ol) {
                    if (!$territories || !in_array($ol->getTerritory()->getId(), $territories)) {
                        $this->em->remove($ol);
                        $this->em->flush();
                    } else {
                        array_push($oldLocalisationsArray, $ol->getTerritory()->getId());
                    }
                }
            }

            for ($i = 0; $i < sizeof($territories); ++$i) {
                if (!in_array($territories[$i], $oldLocalisationsArray)) {
                    $this->createPresentationByTerritories(
                        $presentation,
                        $territories[$i],
                        $presMasterName,
                        $companies[$i]
                    );
                }
            }
            $this->em->flush();
        }
    }


    public function addThumbnail($idPres, $idRev, $urlPres)
    {
        $dir = $this->mainDirectory.'web/'.$this->container->getParameter(
                'presentations_thumbnails'
            ).'/'."$idPres-$idRev";
        $this->fileSystem->mkdir($dir);

        $cmd1 = 'cd '.$this->mainDirectory.'decktape;'; // ne pas supprimer les points virgules dans les commandes !
        $cmd2 = "./phantomjs decktape.js reveal --slides 1 --screenshots --screenshots-size 300x250 --screenshots-format jpg $urlPres  $dir/thumb-$idPres";
        exec($cmd1.$cmd2, $output1, $returnVar1);

        $cmd3 = "cd $dir;";
        $cmd4 = "convert thumb-$idPres -resize 300x250! thumb-$idPres.jpg ; ";
        $cmd6 = "convert  thumb-$idPres.jpg -crop  0x0+48-13 thumb-$idPres.jpg ;";
        $cmd6 .= "convert thumb-$idPres.jpg -rotate 180 thumb-$idPres.jpg ;";
        $cmd6 .= "convert thumb-$idPres.jpg -crop  0x0+48-13 thumb-$idPres.jpg ;";
        $cmd6 .= "convert thumb-$idPres.jpg -rotate 180 thumb-$idPres.jpg ;";
        $cmd6 .= "convert thumb-$idPres.jpg -resize 200x150! thumb-$idPres.jpg ; ";

        $cmd5 = "rm -f thumb-$idPres;";
        exec($cmd3.$cmd4.$cmd6.$cmd5, $output2, $returnVar2);

        if (0 == $returnVar1 && 0 == $returnVar2) {
            $pres = $this->em->getRepository('PresentationBundle:Presentation')->find($idPres);
            $pres->setThumbnailPath(
                $this->container->getParameter('presentations_thumbnails')."/$idPres-$idRev/thumb-$idPres.jpg"
            );
            $this->em->flush($pres);

            return 'MI';
        }

        return -1;
    }

    public function addVeevaThumbnail($idPres, $idRev, $urlPres)
    {
        $dir = $this->mainDirectory.'web/'.$this->container->getParameter(
                'presentations_thumbnails'
            ).'/'."$idPres-$idRev";
        $this->fileSystem->mkdir($dir);

        $cmd1 = 'cd '.$this->mainDirectory.'decktape;'; // ne pas supprimer les points virgules dans les commandes !
        $cmd2 = "./phantomjs decktape.js reveal --slides 1 --size 1124x868  $urlPres  $dir/thumb-veeva-$idPres";
        exec($cmd1.$cmd2, $output1, $returnVar1);

        $cmd3 = "cd $dir;";
        $cmd4 = "convert thumb-veeva-$idPres -resize 1124x868! thumb-veeva-full-$idPres.png;";
        $cmd5 = "convert thumb-veeva-$idPres -resize 200x150! thumb-veeva-$idRev.png;";
        $cmd6 = "rm -f thumb-veeva-$idPres;";

        exec($cmd3.$cmd4.$cmd5.$cmd6, $output2, $returnVar2);

        if (0 == $returnVar1 && 0 == $returnVar2) {
            $pres = $this->em->getRepository('PresentationBundle:Presentation')->find($idPres);
            $pres->setVeevaFullThumbnailPath(
                $this->container->getParameter(
                    'presentations_thumbnails'
                )."/$idPres-$idRev/thumb-veeva-full-$idPres.png"
            );
            $pres->setVeevaThumbnailPath(
                $this->container->getParameter('presentations_thumbnails')."/$idPres-$idRev/thumb-veeva-$idRev.png"
            );
            $this->em->flush($pres);

            return 'Veeva';
        }

        return -1;
    }

    public function getActivePres()
    {
        return $this->em->getRepository('PresentationBundle:Presentation')->findBy(
            array('isActive' => '20')
        );
    }

    public function getArchivePres()
    {
        return $this->em->getRepository('PresentationBundle:Presentation')->findBy(
            array('isActive' => '10')
        );
    }

    public function getPresListByCompany($user, $isActive)
    {
        return $this->em->getRepository('PresentationBundle:Presentation')->findAllByUserCompany(
            array(
                'idCompany' => $user->getCompany()->getId(),
                'userRole' => $user->getRoles(),
                'isActive' => $isActive,
                'idUser' => $user->getId(),
            )
        );
    }

    public function userAffect($role, $presentation, $revoke, $user)
    {
        $em = $this->em;
        if ($role == 'owner') {
            $presentation->setOwner($user);
            $presentation->removeEditor($user);
            $presentation->removeViewer($user);
            $em->persist($presentation);
        }

        if ($role == 'editor' and $revoke == 'true') {
            $presentation->removeEditor($user);
            $em->persist($presentation);
        } elseif ($role == 'editor') {
            $presentation->addEditor($user);
            $presentation->removeViewer($user);
            $em->persist($presentation);
        }

        if ($role == 'viewer' and $revoke == 'true') {
            $presentation->removeViewer($user);
            $em->persist($presentation);
        } elseif ($role == 'viewer') {
            $presentation->addViewer($user);
            $presentation->removeEditor($user);
            $em->persist($presentation);
        }
    }
/**
 * @param int $companyId
 * @return array
 */
    public function recursiveFindParent($companyId)
    {
        $company = $this->em->getRepository('UserBundle:Company')->find($companyId);

        if ($company !== null and $company->getParent() !== null) {
            $company = $this->recursiveFindParent($company->getParent()->getId());

            return $company;
        } else {
            return $company;
        }
    }
}
