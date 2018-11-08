<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\MediaBundle\Repository\PdfRepository;
use ArgoMCMBuilder\PresentationBundle\Entity\HistoryRevision;
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\PresentationBundle\Entity\StatisticMedia;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\Container;

/**
 * Class SaveSlideService.
 */
class SaveSlideService
{
    /** @var Container $container */
    private $container;
    /** @var EntityManager $em */
    private $em;
    /** @var int $idRev */
    private $idRev;
    /** @var int $idPres */
    private $idPres;
    /** @var Revision $rev */
    private $rev;
    /** @var Presentation $pres */
    private $pres;
    private $data;
    /** @var array $mediasLinked */
    private $mediasLinked;
    /** @var array $videoLinked */
    private $videoLinked;
    public $changedSlides;
    /**
     * SaveSlideService constructor.
     *
     * @param Container $container
     */
    public function __construct($container)
    {
        $this->container = $container;
        $this->em = $this->container->get('doctrine')->getManager();
        $this->changedSlides = false;
    }

    /**
     * @param string $oldMenu
     */
    public function setOldMenu(string $oldMenu)
    {
        if (!empty($oldMenu)) {
            $this->rev->setMenu($oldMenu);
        }
    }

    /**
     * @param array $references
     */
    public function setLinkedReferences(array $references): void
    {
        if (!empty($references)) {
            $this->rev->setLinkedRef($references);
        }else {
            $this->rev->setLinkedRef(null);
        }

    }

    /**
     * @param string $comment
     */
    public function setComment(string $comment): void
    {
            $this->rev->setComment($comment);
    }

    /**
     * @param array $popups
     */
    public function setPopups(array $popups): void
    {
        if (!empty($popups)) {
            $this->rev->setPopin($popups);
        }else {
            $this->rev->setPopin(null);
        }
    }

    /**
     * @param array $menu
     */
    public function setMenu(array $menu): void
    {
        if (!empty($menu)) {
            $this->rev->setMenuJson($menu);
        }
    }

    /**
     * @param array $slides
     */
    public function setSlides(array $slides): void
    {
        if (!empty($slides)) {
            $this->rev->setSlides($slides);
        }
    }

    /**
     * @param array $data
     *
     * @return void
     */
    public function decompress(array $data): void
    {
        // get the first key!
        $data = current(array_keys($data));

        exec("node js/pako/restore-data.js $data", $return, $exitCode);

        if (0 === $exitCode) {
            $this->data = json_decode($return[0]);

            return;
        }

        trigger_error("Cannot decompress object send via AJAX", E_USER_ERROR);
    }

    /**
     * @param Revision $rev
     * @param array    $linkedMedias
     */
    public function setLinkedImage($rev, $linkedMedias)
    {
        $linked       = $rev->getImage();
        $linkedMedias = (!empty($linkedMedias)) ? array_values(array_unique(array_filter($linkedMedias))) : array();
        $arrImg       = array();

        foreach ($linked as $image) {

            if (!in_array($image->getUrl(), $linkedMedias)) {
                $rev->removeImage($image);
                $otherLink = $image->getRevisionImage();
                if (1 == count($otherLink)) :
                    $image->setFlag(10);
                endif;
            } else {
                array_push($arrImg, $image->getId());
            }
        }

        $mediaRep = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Image');
        for ($i = 0; $i < count($linkedMedias); ++$i) {

            $img = $mediaRep->findOneBy(array('url' => $linkedMedias[$i]));
            if ($img) {
                if (!in_array($img->getId(), $arrImg)) :
                    $rev->addImage($img);
                    $img->setFlag(20);
                endif;
            }
        }

    }

    /**
     * @param Revision $rev
     * @param array    $linkedVideo
     */
    public function setLinkedVideo($rev, $linkedVideo)
    {
        $linked      = $rev->getVideo();
        $linkedVideo = !empty($linkedVideo) ? array_values(array_unique(array_filter($linkedVideo))) : array();
        $arrVideo    = array();

        foreach ($linked as $l) {

            if (!in_array($l->getUrl(), $linkedVideo)) {
                $rev->removeVideo($l);
                $otherLink = $l->getRevisionVideo();
                if (1 == count($otherLink)) :
                    $l->setFlag(10);
                endif;
            } else {
                array_push($arrVideo, $l->getId());
            }
        }

        $mediaRep = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Video');
        for ($i = 0; $i < count($linkedVideo); ++$i) {

            $video = $mediaRep->findOneBy(array('url' => $linkedVideo[$i]));
            if ($video) {
                if (!in_array($video->getId(), $arrVideo)) :
                    $rev->addVideo($video);
                    $video->setFlag(20);
                endif;
            }
        }

    }

    /**
     * @param Revision $rev
     * @param array    $linkedPdf
     */
    public function setLinkedPdf($rev, array $linkedPdf): void
    {
        $linked    = $rev->getPdf();
        $linkedPdf = (!empty($linkedPdf)) ? array_values(array_filter($linkedPdf)) : array();
        $arrPdf    = array();

        foreach ($linked as $l) {

            if (!in_array($l->getUrl(), $linkedPdf)) {
                $rev->removePdf($l);
                $otherLink = $l->getRevisionPdf();
                if (1 == count($otherLink)) :
                    $l->setFlag(10);
                endif;
            } else {
                array_push($arrPdf, $l->getId());
            }
        }

        $mediaRep = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Pdf');
        for ($i = 0; $i < count($linkedPdf); ++$i) {

            $pdf = $mediaRep->find($linkedPdf[$i]);
            if ($pdf) {
                if (!in_array($pdf->getId(), $arrPdf)) :
                    $rev->addPdf($pdf);
                    $pdf->setFlag(20);
                endif;
            }
        }
    }

    /**
     * @param array  $value
     * @param string $key
     */
    public function getLinkedMedias($value, $key)
    {
        switch ($key) {
            case 'parameters':
                if (property_exists($value, 'dataBgPopupImg')) {
                    $this->mediasLinked[] = $value->{'dataBgPopupImg'};
                }
                if (property_exists($value, 'dataBgPresImg')) {
                    $this->mediasLinked[] = $value->{'dataBgPresImg'};
                }
                if (property_exists($value, 'dataBgRefImg')) {
                    $this->mediasLinked[] = $value->{'dataBgRefImg'};
                }
                if (property_exists($value, 'dataBgBtnClose')) {
                    $this->mediasLinked[] = $value->{'dataBgBtnClose'};
                }
                if (property_exists($value, 'dataLogoHomeUrl')) {
                    $this->mediasLinked[] = $value->{'dataLogoHomeUrl'};
                }
                if (property_exists($value, 'dataLogoPresUrl')) {
                    $this->mediasLinked[] = $value->{'dataLogoPresUrl'};
                }
                if (property_exists($value, 'dataLogoRcpUrl')) {
                    $this->mediasLinked[] = $value->{'dataLogoRcpUrl'};
                }
                if (property_exists($value, 'dataLogoRefrsUrl')) {
                    $this->mediasLinked[] = $value->{'dataLogoRefrsUrl'};
                }

                break;
            case 'slides':
                foreach ($value as $item) {

                    if (property_exists($item->{'attributes'}, 'data-bg-screen-img')) {
                        $this->mediasLinked[] = $item->{'attributes'}->{'data-bg-screen-img'};
                    }
                    if (property_exists($item, 'blocks')) {
                        foreach ($item->blocks as $block) {
                            if ($block->type == 'image') :
                                if (property_exists($block->{'blockStyle'}->{'blockcontent'}->{'data'}, 'src')) :
                                    $this->mediasLinked[] = $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'src'};
                                endif;
                            elseif ($block->type == 'video') :
                                $this->videoLinked[] = $block->attributes->{'data-video'};
                            endif;
                        }
                    }
                    if (property_exists($item, 'children')) {
                        foreach ($item->{'children'} as $child) {
                            if (property_exists($child, 'blocks')) {
                                foreach ($child->{'blocks'} as $block) {
                                    if ($block->type == 'image') :
                                        if (property_exists($block->{'blockStyle'}->{'blockcontent'}->{'data'}, 'src')) :
                                            $this->mediasLinked[] = $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'src'};
                                        endif;
                                    elseif ($block->type == 'video') :
                                        $this->videoLinked[] = $block->attributes->{'data-video'};
                                    endif;
                                }
                            }
                        }
                    }
                }
                break;
            case 'popins':
                foreach ($value as $item) {
                    if (property_exists($item->{'style'}, 'background-image')) {
                        $this->mediasLinked[] = $item->{'style'}->{'background-image'};
                    }
                    foreach ($item->blocks as $block) {
                        if ($block->type == 'image') :
                            if (property_exists($block->{'blockStyle'}->{'blockcontent'}->{'data'}, 'src')) :
                                $this->mediasLinked[] = $block->{'blockStyle'}->{'blockcontent'}->{'data'}->{'src'};
                            endif;
                        endif;
                    }
                }
                break;

        }

    }

//    /**
//     * @param Revision $revision
//     * @param string   $popin
//     */
//    public function setPopin($revision, $popin)
//    {
//        $popin = str_replace('"', "'", $popin);
//        $revision->setDataOldPopin($popin);
//        $revision->setDataPopin($popin);
//    }

    /**
     * @param mixed $parameters
     */
    public function setParameters($parameters)
    {
        $this->rev->setPreSettings($parameters);
        $this->rev->setOldPreSettings($parameters);
    }


    public function setHistory($changedSlides)
    {
        $history = $this->rev->getHistoryRevision();
        if (!empty($history)) {
            $history->setChangedSlides($changedSlides);
        } else {
            $newHistory = new HistoryRevision();
            $newHistory->setChangedSlides($changedSlides);
            $this->rev->setHistoryRevision($newHistory);
        }
    }

    /**
     * @param array $data
     * @param int   $idPres
     *
     * @return void
     */
    public function save(array $data, int $idPres): void
    {
        $idRev = $this->em->getRepository('PresentationBundle:Revision')->getLastIdRevisionByPres($idPres);
        list($this->data, $this->idRev, $this->idPres) = [$data, $idRev, $idPres];

        $this->rev = $this->em->getRepository('PresentationBundle:Revision')->find($this->idRev);
        $this->pres = $this->em->getRepository('PresentationBundle:Presentation')->find($this->idPres);

        $this->decompress($this->data);

        foreach ($this->data as $key => $value) {
            switch ($key) {
                case 'parameters':
                    $this->setParameters($value);
                    $this->getLinkedMedias($value, $key);
                    break;
                case 'linkedPdf':
                    $this->setLinkedPdf($this->rev, $value);
                    break;
                case 'slides':
                    $this->setSlides($value);
                    $this->getLinkedMedias($value, $key);
                    break;
                case 'menuJson':
                    $this->setMenu($value);
                    break;
                case 'menu':
                    // old menu
                    $this->setOldMenu($value);
                    break;
                case 'popins':
                    $this->setPopups($value);
                    $this->getLinkedMedias($value, $key);
                    break;
                case 'references':
                    $this->setLinkedReferences($value);
                    break;
                case 'comment':
                    $this->setComment($value);
                    break;
                case 'changedSlides':
                    $this->setHistory($value);
                    $this->changedSlides = true;
                    break;
                case 'fontSize':
                    $fontsSize = $value;
                    break;
            }
        }

        $this->setLinkedImage($this->rev, $this->mediasLinked);
        $this->setLinkedVideo($this->rev, $this->videoLinked);

        if (empty($this->rev->getVisibility())) {
            $this->rev->setVisibility(20);
        }
        $this->em->flush();
        $this->updateStatisticMedia($idRev, $fontsSize);
        $this->cloneRevision($idRev, $idPres, '0');
    }

    /**
     * @param int    $idRev
     * @param int    $idPres
     * @param string $parent
     *
     * @return void
     */
    public function cloneRevision($idRev, $idPres, $parent)
    {
        /** @var Revision $oldRev */
        $repositoryRevision = $this->em->getRepository('PresentationBundle:Revision');
        $lastRevision = $repositoryRevision->getLastIdRevisionByPres($idPres);
        $lastVersion = (string) $lastRevision->getVersion();
        $pos = strpos($lastVersion, '.') ;
        $newLastVersion = substr($lastVersion, $pos + 1);
        $firstValueVersion = substr($lastVersion, 0, $pos + 1) ;
        $valueVersion = (int) $newLastVersion  ;
        $lastVersion = $firstValueVersion.($valueVersion + 1);

        $oldRev = $repositoryRevision->find($idRev);
        if ($parent == "1") {
            $oldRev->setSlides(json_decode($oldRev->getSlides()));
            $oldRev->setPreSettings(json_decode($oldRev->getPreSettings()));
            $oldRev->setOldPreSettings(json_decode($oldRev->getOldPreSettings()));
            $oldRev->setMenuJson(json_decode($oldRev->getMenuJson()));
            $oldRev->setPopin(json_decode($oldRev->getPopin()));
            $oldRev->setSurvey(json_decode($oldRev->getSurvey()));
            $oldRev->setLinkedRef(json_decode($oldRev->getLinkedRef()));
        }
        $newRev = clone $oldRev;
        $newRev->setVersion($lastVersion);
        if (!empty($oldRev->getStatisticMedia())) {
            $newStatisticMedia = clone $oldRev->getStatisticMedia();
            $newRev->setStatisticMedia($newStatisticMedia);
        } else {
            $newRev->setStatisticMedia(null);
        }

        if (!empty($oldRev->getHistoryRevision()) && $this->changedSlides) {
            $newhistoryRev = clone $oldRev->getHistoryRevision();
            $newRev->setHistoryRevision($newhistoryRev);
        } else {
            $newRev->setHistoryRevision(null);
        }


        if ($newRev->getSurvey() == "{}") {
            $newRev->setSurvey(null);
        }
        if ($newRev->getPopin() == "{}") {
            $newRev->setPopin(null);
        }
        if ($newRev->getLinkedRef() == "{}") {
            $newRev->setLinkedRef(null);
        }
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        $newRev->setUser($user);
        if ($parent == "1") {
            $newRev->setParent($oldRev->getVersion());
        }
        $this->em->persist($newRev);
        $this->em->flush();
    }

    /**
     * @param int $idRev
     * @return int
     */
    public function updateStatisticMedia($idRev, $fontsSize)
    {
        /** @var StatisticMedia  $statisticMedia  */
        $imageSize = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Image')->countSizeForImageByRevision($idRev);
        $pdfSize = $this->em->getRepository('ArgoMCMBuilderMediaBundle:PDF')->countSizeForPDFByRevision($idRev);
        $videoSize = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Video')->countSizeForVideoByRevision($idRev);
        $dataMedia = ($pdfSize + $imageSize + $videoSize)/(1024*1024);

        if ($this->rev->getStatisticMedia() == null) {
            $statisticMedia = new StatisticMedia();
            $statisticMedia->setSizeMedia($dataMedia);
            $statisticMedia->setSizeFont($fontsSize);
            $statisticMedia->setSizeData(10);
            $this->em->persist($statisticMedia);
            $this->rev->setStatisticMedia($statisticMedia);
        } else {
            $statisticMedia = $this->em->getRepository('PresentationBundle:StatisticMedia')->find($this->rev->getStatisticMedia());
            $statisticMedia->setSizeMedia($dataMedia);
            $statisticMedia->setSizeFont($fontsSize);
            $statisticMedia->setSizeData(10);
            $this->rev->setStatisticMedia($statisticMedia);
        }
        $this->em->flush();
        return $fontsSize + 10 + $dataMedia;
    }
}
