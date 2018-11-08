<?php

namespace ArgoMCMBuilder\ProjectBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Project.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_project")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\ProjectBundle\Entity\Repository\ProjectRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Project
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
     * @ORM\Column(name="status", type="string", length=255)
     */
    protected $status;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", inversedBy="projects", cascade={"persist"}, fetch="EAGER")
     * @ORM\JoinColumn(name="owner_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $owner;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", inversedBy="projects", cascade={"persist"})
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id" , onDelete="CASCADE" )
     */
    protected $company;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", mappedBy="project",
     *     cascade={"persist"})
     */
    protected $presentations;

    /**
     * @var date
     *
     * @ORM\Column(name="start_date", type="datetime")
     */
    protected $startDate;

    /**
     * @var date
     *
     * @ORM\Column(name="end_date", type="datetime")
     */
    protected $endDate;

    /**
     * Constructor.
     */
    public function __construct($owner = null, $company = null, $name = '', $status = 'V0', $startDate = null)
    {
        $this->presentations = new \Doctrine\Common\Collections\ArrayCollection();
        $this->endDate = new \DateTime();

        if (null !== $owner) {
            $this->owner = $owner;
        }

        if (null !== $company) {
            $this->company = $company;
        }

        if (null !== $name) {
            $this->name = $name;
        }

        if ('V0' !== $status) {
            $this->status = $status;
        }

        if (null !== $startDate) {
            $this->startDate = $startDate;
        }
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
     * @return Project
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
     * Set status.
     *
     * @param string $status
     *
     * @return Project
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status.
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set owner.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $owner
     *
     * @return Project
     */
    public function setOwner(\ArgoMCMBuilder\UserBundle\Entity\User $owner = null)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * Get owner.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\User
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * Set company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     *
     * @return Project
     */
    public function setCompany(\ArgoMCMBuilder\UserBundle\Entity\Company $company = null)
    {
        $this->company = $company;

        return $this;
    }

    /**
     * Get company.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\Company
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * Add presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return Project
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

    /**
     * Set startDate.
     *
     * @param \DateTime $startDate
     *
     * @return Project
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate.
     *
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set endDate.
     *
     * @param \DateTime $endDate
     *
     * @return Project
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * Get endDate.
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * @param $presentations
     */
    public function setPresentation($presentations)
    {
        $this->presentations = $presentations;
    }
    /**
     * clearId
     */
    public function clearId()
    {
        $this->id = null;
    }
}
