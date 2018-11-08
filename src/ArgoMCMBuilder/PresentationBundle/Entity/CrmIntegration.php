<?php

namespace ArgoMCMBuilder\PresentationBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CrmIntegration.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_crm")
 */
class CrmIntegration
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
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", mappedBy="crm", cascade={"persist"})
     * @ORM\JoinColumn(name="Presentation_id", referencedColumnName="id" , onDelete="CASCADE" )
     */
    protected $presentation;

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
     * @return CrmIntegration
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
     * Set presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return CrmIntegration
     */
    public function setPresentation(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation = null)
    {
        $this->presentation = $presentation;

        return $this;
    }

    /**
     * Get presentation.
     *
     * @return \ArgoMCMBuilder\PresentationBundle\Entity\Presentation
     */
    public function getPresentation()
    {
        return $this->presentation;
    }

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->presentation = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return CrmIntegration
     */
    public function addPresentation(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation)
    {
        $this->presentation[] = $presentation;

        return $this;
    }

    /**
     * Remove presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     */
    public function removePresentation(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation)
    {
        $this->presentation->removeElement($presentation);
    }
}
