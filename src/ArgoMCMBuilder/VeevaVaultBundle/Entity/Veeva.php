<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Veeva.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_veeva")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\VeevaVaultBundle\Entity\Repository\VeevaRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Veeva
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
     * @ORM\Column(name="name", type="string", length=255, nullable=true)
     */
    protected $name;

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=255,nullable=true)
     */
    protected $status;
    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=255)
     */
    protected $type;

    /**
     * @var string
     *
     * @ORM\Column(name="veeva_owner", type="string", length=255, nullable=true)
     */
    protected $veevaOwner;

    /**
     * @var date
     *
     * @ORM\Column(name="start_date", type="datetime")
     */
    protected $startDate;
    /**
     * @var string
     *
     * @ORM\Column(name="version", type="string", length=255)
     */
    protected $version;
    /**
     * @var string
     *
     * @ORM\Column(name="veeva_version", type="string", length=255)
     */
    protected $veevaVersion;
    /**
     * @var int
     *
     * @ORM\Column(name="binder_id", type="integer")
     */
    private $binderId;
    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", inversedBy="veevas",
     *     cascade={"persist"})
     * @ORM\JoinColumn(name="presentation_id", referencedColumnName="id", onDelete="CASCADE", nullable=true))
     **/
    protected $presentation;

    /**
     * @ORM\Column(name="veeva_docs", type="json_doc", nullable=true)
     */
    private $veevaDocuments;
    /**
     * @ORM\Column(name="vault_company_id", type="integer", nullable=true)
     */
    private $idCompanyVault;
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->presentations = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * Set name
     *
     * @param string $name
     *
     * @return Veeva
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set status
     *
     * @param string $status
     *
     * @return Veeva
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set veevaOwner
     *
     * @param string $veevaOwner
     *
     * @return Veeva
     */
    public function setVeevaOwner($veevaOwner)
    {
        $this->veevaOwner = $veevaOwner;

        return $this;
    }

    /**
     * Get veevaOwner
     *
     * @return string
     */
    public function getVeevaOwner()
    {
        return $this->veevaOwner;
    }

    /**
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return Veeva
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set binderId
     *
     * @param integer $binderId
     *
     * @return Veeva
     */
    public function setBinderId($binderId)
    {
        $this->binderId = $binderId;

        return $this;
    }

    /**
     * Get binderId
     *
     * @return integer
     */
    public function getBinderId()
    {
        return $this->binderId;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Veeva
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set version
     *
     * @param string $version
     *
     * @return Veeva
     */
    public function setVersion($version)
    {
        $this->version = $version;

        return $this;
    }

    /**
     * Get version
     *
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Set presentation
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return Veeva
     */
    public function setPresentation(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation = null)
    {
        $this->presentation = $presentation;

        return $this;
    }

    /**
     * Get presentation
     *
     * @return \ArgoMCMBuilder\PresentationBundle\Entity\Presentation
     */
    public function getPresentation()
    {
        return $this->presentation;
    }

    /**
     * Set veevaVersion
     *
     * @param string $veevaVersion
     *
     * @return Veeva
     */
    public function setVeevaVersion($veevaVersion)
    {
        $this->veevaVersion = $veevaVersion;

        return $this;
    }

    /**
     * Get veevaVersion
     *
     * @return string
     */
    public function getVeevaVersion()
    {
        return $this->veevaVersion;
    }

    /**
     * Set veevaDocuments
     *
     * @param json_doc $veevaDocuments
     *
     * @return Veeva
     */
    public function setVeevaDocuments($veevaDocuments)
    {
        $this->veevaDocuments = $veevaDocuments;

        return $this;
    }

    /**
     * Get veevaDocuments
     *
     * @return json_doc
     */
    public function getVeevaDocuments()
    {
        return $this->veevaDocuments;
    }

    /**
     * Set idCompanyVault
     *
     * @param integer $idCompanyVault
     *
     * @return Veeva
     */
    public function setIdCompanyVault($idCompanyVault)
    {
        $this->idCompanyVault = $idCompanyVault;

        return $this;
    }

    /**
     * Get idCompanyVault
     *
     * @return integer
     */
    public function getIdCompanyVault()
    {
        return $this->idCompanyVault;
    }
}
