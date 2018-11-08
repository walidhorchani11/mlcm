<?php

namespace ArgoMCMBuilder\PresentationBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * HistoryRevision.
 * @ORM\Entity
 * @ORM\Table(name="mcm_history_revision")
 * @ORM\HasLifecycleCallbacks
 */
class HistoryRevision
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
     * @var datetime
     *
     * @ORM\Column(type="datetime", nullable = true)
     */
    private $dataCreatedAt;

    /**
     * @ORM\Column(name="changed_slides", type="json_doc", nullable=true)
     */
    private $changedSlides;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set dataCreatedAt
     *
     * @param \DateTime $dataCreatedAt
     *
     * @return HistoryRevision
     */
    public function setDataCreatedAt($dataCreatedAt)
    {
        $this->dataCreatedAt = $dataCreatedAt;

        return $this;
    }

    /**
     * Gets triggered every time on update

     * @ORM\PreUpdate
     */
    public function onPreUpdate()
    {
        $this->dataCreatedAt = new \DateTime("now");
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
     * Get dataCreatedAt
     *
     * @return \DateTime
     */
    public function getDataCreatedAt()
    {
        return $this->dataCreatedAt;
    }

    /**
     * Set changedSlides
     *
     * @param json_doc $changedSlides
     *
     * @return HistoryRevision
     */
    public function setChangedSlides($changedSlides)
    {
        $this->changedSlides = $changedSlides;

        return $this;
    }

    /**
     * Get changedSlides
     *
     * @return json_doc
     */
    public function getChangedSlides()
    {
        return $this->changedSlides;
    }
}
