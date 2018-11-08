<?php

namespace ArgoMCMBuilder\PresentationBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * StatisticMedia.
 * @ORM\Entity
 * @ORM\Table(name="mcm_statistic_media")
 * @ORM\HasLifecycleCallbacks
 */
class StatisticMedia
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var float
     *
     * @ORM\Column(name="size_media", type="float", nullable=true)
     */
    private $sizeMedia;

    /**
     * @var float
     *
     * @ORM\Column(name="size_font", type="float", nullable=true)
     */
    private $sizeFont;

    /**
     * @var float
     *
     * @ORM\Column(name="size_data", type="float", nullable=true)
     */
    private $sizeData;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="data_updated_at", type="datetime", nullable=true)
     */
    private $dataUpdatedAt;

    /**
     * @var datetime
     *
     * @ORM\Column(type="datetime", nullable = true)
     */
    private $dataCreatedAt;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return float|null
     */
    public function getSizeMedia()
    {
        return $this->sizeMedia;
    }

    /**
     * @param float $sizeMedia
     */
    public function setSizeMedia($sizeMedia)
    {
        $this->sizeMedia = $sizeMedia;
    }

    /**
     * @return float|null
     */
    public function getSizeFont()
    {
        return $this->sizeFont;
    }

    /**
     * @param float $sizeFont
     */
    public function setSizeFont($sizeFont)
    {
        $this->sizeFont = $sizeFont;
    }

    /**
     * @return float|null
     */
    public function getSizeData()
    {
        return $this->sizeData;
    }

    /**
     * @param float $sizeData
     */
    public function setSizeData($sizeData)
    {
        $this->sizeData = $sizeData;
    }

    /**
     * @return \DateTime|null
     */
    public function getDataUpdatedAt()
    {
        return $this->dataUpdatedAt;
    }

    /**
     * Gets triggered every time on update

     * @ORM\PreUpdate
     */
    public function onPreUpdate()
    {
        $this->dataUpdatedAt = new \DateTime("now");
    }

    /**
     * Gets triggered only on insert

     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->dataCreatedAt = new \DateTime("now");
    }

    /**
     * @return dataCreatedAt
     */
    public function getDataCreatedAt()
    {
        return $this->dataCreatedAt;
    }
}
