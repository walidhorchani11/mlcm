<?php

namespace ArgoMCMBuilder\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Territory.
 *
 * @ORM\Table(name="mcm_territory")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\UserBundle\Entity\Repository\TerritoryRepository")
 */
class Territory
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    protected $name;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=255, nullable=true)
     */
    protected $code;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", mappedBy="territory",
     *     cascade={"persist"})
     */
    protected $presentations;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->presentations = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name.
     *
     * @param string $name
     *
     * @return Territory
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set code.
     *
     * @param string $code
     *
     * @return Territory
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code.
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Add presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return Territory
     */
    public function addPresentation(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation)
    {
        $this->presentations[] = $presentation;

        return $this;
    }

    /**
     * Remove presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     */
    public function removePresentation(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation)
    {
        $this->presentations->removeElement($presentation);
    }

    /**
     * Get presentations.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPresentations()
    {
        return $this->presentations;
    }
}
