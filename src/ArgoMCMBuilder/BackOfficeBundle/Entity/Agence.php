<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Agence.
 *
 * @ORM\Table(name="mcm_agence")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\BackOfficeBundle\Entity\Repository\AgenceRepository")
 */
class Agence
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     *  @Assert\NotBlank(
     *      message = "This field is required"
     * )
     */
    private $name;

    /**
     * @var \DateTime
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $created;

    /**
     * @var \int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $status;

    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", mappedBy="agencies")
     */
    private $companies;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->companies = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Agence
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
     * Set created.
     *
     * @param \DateTime $created
     *
     * @return Agence
     */
    public function setCreated($created)
    {
        $this->created = $created;

        return $this;
    }

    /**
     * Get created.
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * Gets triggered only on insert.
     *
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->created = new \DateTime('now');
    }

    /**
     * Set status.
     *
     * @param int $status
     *
     * @return Agence
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status.
     *
     * @return int
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Add company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     *
     * @return Agence
     */
    public function addCompany(\ArgoMCMBuilder\UserBundle\Entity\Company $company)
    {
        $this->companies[] = $company;

        return $this;
    }

    /**
     * Remove company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     */
    public function removeCompany(\ArgoMCMBuilder\UserBundle\Entity\Company $company)
    {
        $this->companies->removeElement($company);
    }

    /**
     * Get companies.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCompanies()
    {
        return $this->companies;
    }
}
