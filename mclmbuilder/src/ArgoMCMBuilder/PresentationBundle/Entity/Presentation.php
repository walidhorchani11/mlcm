<?php

namespace ArgoMCMBuilder\PresentationBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Presentation.
 *
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\PresentationBundle\Repository\PresentationRepository")
 * @ORM\Table(name="mcm_presentation")
 */
class Presentation
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
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Territory", inversedBy="presentations",cascade={"persist"})
     * @ORM\JoinColumn(name="territory_id", referencedColumnName="id" , onDelete="CASCADE")
     */
    protected $territory;

    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\BackOfficeBundle\Entity\Product", inversedBy="presentations",cascade={"persist"})
     * @ORM\JoinColumn(name="Product_id", referencedColumnName="id" , onDelete="CASCADE" )
     * @ORM\JoinTable(name="mcm_product_presentation")
     */
    protected $products;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\CrmIntegration", inversedBy="presentation",cascade={"persist"})
     * @ORM\JoinColumn(name="crm_id", referencedColumnName="id" , onDelete="CASCADE" )
     */
    protected $crm;
    /**
     * @var int
     *
     * @ORM\Column(name="is_active", type="integer")
     */
    protected $isActive;

    /**
     * @var string
     *
     * @ORM\Column(name="version", type="string", length=255)
     */
    protected $version;

    /**
     * @var int
     *
     * @ORM\Column(name="is_lock", type="integer")
     */
    protected $lock;

    /**
     * @var int
     *
     * @ORM\Column(name="is_disconnect", type="integer")
     */
    protected $isDisconnect;

    /**
     * @var string
     *
     * @ORM\Column(name="device", type="string", length=255)
     */
    protected $device;

    /**
     * @var string
     *
     * @ORM\Column(name="type_presentation", type="string", length=255)
     */
    protected $type;

    /**
     * @var string
     *
     * @ORM\Column(name="thumbnail_path", type="string", length=255, nullable=true)
     */
    protected $thumbnailPath;

    /**
     * @var string
     *
     * @ORM\Column(name="veeva_thumbnail_path", type="string", length=255, nullable=true)
     */
    protected $veevaThumbnailPath;

    /**
     * @var string
     *
     * @ORM\Column(name="veeva_full_thumbnail_path", type="string", length=255, nullable=true)
     */
    protected $veevaFullThumbnailPath;

    /**
     * @var string
     *
     * @ORM\Column(name="progress", type="string", length=255, nullable=true)
     */
    protected $progress;

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=255)
     */
    protected $status;
    /**
     * @var string
     *
     * @ORM\Column(name="additional_text", type="string", length=255, nullable=true)
     */
    protected $additionalText;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="creation_date", type="datetime")
     */
    protected $creationDate;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="last_update", type="datetime")
     */
    protected $lastUpDate;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\ProjectBundle\Entity\Project", inversedBy="presentations",
     *     cascade={"persist"})
     * @ORM\JoinColumn(name="project_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $project;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", cascade={"persist"})
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $company;
    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\BackOfficeBundle\Entity\Agence", cascade={"persist"})
     * @ORM\JoinColumn(name="agence_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $agency;
    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", inversedBy="presentations")
     */
    protected $owner;
    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinTable(name="mcm_presentation_editor")
     */
    protected $editors;
    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinTable(name="mcm_presentation_viewer")
     */
    protected $viewers;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Revision", mappedBy="presentation",
     *      cascade={"persist", "remove"})
     */
    protected $revisions;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", inversedBy="children",
     *     cascade={"persist"})
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $parent;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation",mappedBy="parent", cascade={"persist"})
     **/
    protected $children;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="last_used", type="datetime", nullable=true)
     */
    protected $lastUsed;

    /**
     * @var int
     *
     * @ORM\Column(name="mode_edit", type="integer")
     */
    protected $modeEdit;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="used_by", referencedColumnName="id", onDelete="SET NULL", nullable=true)
     */
    protected $usedBy;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva", mappedBy="presentation", cascade={"persist"})
     */
    protected $veevas;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Reference",
     *      mappedBy="presentation", cascade={"persist", "remove"})
     */
    private $references;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->isActive = 20;
        $this->version = 'V0';
        $this->lock = 10;
        $this->modeEdit = 10;
        $this->isDisconnect = 10;
        $this->creationDate = new \DateTime();
        $this->lastUpDate = new \DateTime();
        $this->revisions = new ArrayCollection();
        $this->references = new ArrayCollection();
    }

    /**
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->creationDate = new \DateTime();
    }

    /**
     * @return Presentation
     */
    public function duplicatePresentation($clonePres = null)
    {
        $presClone = new self();
        if (null != $clonePres) {
            $presClone->setParent($clonePres);
        }
        $presClone->setName($this->getName().'_duplicated');
        $presClone->setIsActive($this->getIsActive());
        $presClone->setVersion($this->getVersion());
        $presClone->setLock($this->getLock());
        $presClone->setIsDisconnect($this->getIsDisconnect());
        $presClone->setDevice($this->getDevice());
        $presClone->setType($this->getType());
        //$presClone->setThumbnailPath($this->getThumbnailPath());
        $presClone->setVeevaThumbnailPath($this->getVeevaThumbnailPath());
        $presClone->setVeevaFullThumbnailPath($this->getVeevaFullThumbnailPath());
        $presClone->setProgress($this->getProgress());
        $presClone->setStatus($this->getStatus());
        $presClone->setAdditionalText($this->getAdditionalText());
        $presClone->setCreationDate(new \DateTime());
        $presClone->setLastUpDate(new \DateTime());
        $presClone->setCrm($this->getCrm());
        $presClone->setTerritory($this->getTerritory());
        $presClone->setOwner($this->getOwner());
        $presClone->setCompany($this->getCompany());
        $presClone->setAgency($this->getAgency());

        return $presClone;
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
     * @return Presentation
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
     * Set isActive.
     *
     * @param int $isActive
     *
     * @return Presentation
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive.
     *
     * @return int
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set version.
     *
     * @param string $version
     *
     * @return Presentation
     */
    public function setVersion($version)
    {
        $this->version = $version;

        return $this;
    }

    /**
     * Get version.
     *
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Set lock.
     *
     * @param int $lock
     *
     * @return Presentation
     */
    public function setLock($lock)
    {
        $this->lock = $lock;

        return $this;
    }

    /**
     * Get lock.
     *
     * @return int
     */
    public function getLock()
    {
        return $this->lock;
    }

    /**
     * Set isDisconnect.
     *
     * @param int $isDisconnect
     *
     * @return Presentation
     */
    public function setIsDisconnect($isDisconnect)
    {
        $this->isDisconnect = $isDisconnect;

        return $this;
    }

    /**
     * Get isDisconnect.
     *
     * @return int
     */
    public function getIsDisconnect()
    {
        return $this->isDisconnect;
    }

    /**
     * Set device.
     *
     * @param string $device
     *
     * @return Presentation
     */
    public function setDevice($device)
    {
        $this->device = $device;

        return $this;
    }

    /**
     * Get device.
     *
     * @return string
     */
    public function getDevice()
    {
        return $this->device;
    }

    /**
     * Set type.
     *
     * @param string $type
     *
     * @return Presentation
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set thumbnailPath.
     *
     * @param string $thumbnailPath
     *
     * @return Presentation
     */
    public function setThumbnailPath($thumbnailPath)
    {
        $this->thumbnailPath = $thumbnailPath;

        return $this;
    }

    /**
     * Get thumbnailPath.
     *
     * @return string
     */
    public function getThumbnailPath()
    {
        return $this->thumbnailPath;
    }

    /**
     * Set veevaThumbnailPath.
     *
     * @param string $veevaThumbnailPath
     *
     * @return Presentation
     */
    public function setVeevaThumbnailPath($veevaThumbnailPath)
    {
        $this->veevaThumbnailPath = $veevaThumbnailPath;

        return $this;
    }

    /**
     * Get veevaThumbnailPath.
     *
     * @return string
     */
    public function getVeevaThumbnailPath()
    {
        return $this->veevaThumbnailPath;
    }

    /**
     * Set veevaFullThumbnailPath.
     *
     * @param string $veevaFullThumbnailPath
     *
     * @return Presentation
     */
    public function setVeevaFullThumbnailPath($veevaFullThumbnailPath)
    {
        $this->veevaFullThumbnailPath = $veevaFullThumbnailPath;

        return $this;
    }

    /**
     * Get veevaFullThumbnailPath.
     *
     * @return string
     */
    public function getVeevaFullThumbnailPath()
    {
        return $this->veevaFullThumbnailPath;
    }

    /**
     * Set progress.
     *
     * @param string $progress
     *
     * @return Presentation
     */
    public function setProgress($progress)
    {
        $this->progress = $progress;

        return $this;
    }

    /**
     * Get progress.
     *
     * @return string
     */
    public function getProgress()
    {
        return $this->progress;
    }

    /**
     * Set status.
     *
     * @param string $status
     *
     * @return Presentation
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
     * Set additionalText.
     *
     * @param string $additionalText
     *
     * @return Presentation
     */
    public function setAdditionalText($additionalText)
    {
        $this->additionalText = $additionalText;

        return $this;
    }

    /**
     * Get additionalText.
     *
     * @return string
     */
    public function getAdditionalText()
    {
        return $this->additionalText;
    }

    /**
     * Set creationDate.
     *
     * @param \DateTime $creationDate
     *
     * @return Presentation
     */
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * Get creationDate.
     *
     * @return \DateTime
     */
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * Set lastUpDate.
     *
     * @param \DateTime $lastUpDate
     *
     * @return Presentation
     */
    public function setLastUpDate($lastUpDate)
    {
        $this->lastUpDate = $lastUpDate;

        return $this;
    }

    /**
     * Get lastUpDate.
     *
     * @return \DateTime
     */
    public function getLastUpDate()
    {
        return $this->lastUpDate;
    }

    /**
     * Set territory.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Territory $territory
     *
     * @return Presentation
     */
    public function setTerritory(\ArgoMCMBuilder\UserBundle\Entity\Territory $territory = null)
    {
        $this->territory = $territory;

        return $this;
    }

    /**
     * Get territory.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\Territory
     */
    public function getTerritory()
    {
        return $this->territory;
    }

    /**
     * Add product.
     *
     * @param \ArgoMCMBuilder\BackOfficeBundle\Entity\Product $product
     *
     * @return Presentation
     */
    public function addProduct(\ArgoMCMBuilder\BackOfficeBundle\Entity\Product $product)
    {
        $this->products[] = $product;

        return $this;
    }

    /**
     * Remove product.
     *
     * @param \ArgoMCMBuilder\BackOfficeBundle\Entity\Product $product
     */
    public function removeProduct(\ArgoMCMBuilder\BackOfficeBundle\Entity\Product $product)
    {
        $this->products->removeElement($product);
    }

    /**
     * Get products.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProducts()
    {
        return $this->products;
    }

    /**
     * Set crm.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\CrmIntegration $crm
     *
     * @return Presentation
     */
    public function setCrm(\ArgoMCMBuilder\PresentationBundle\Entity\CrmIntegration $crm = null)
    {
        $this->crm = $crm;

        return $this;
    }

    /**
     * Get crm.
     *
     * @return \ArgoMCMBuilder\PresentationBundle\Entity\CrmIntegration
     */
    public function getCrm()
    {
        return $this->crm;
    }

    /**
     * Set project.
     *
     * @param \ArgoMCMBuilder\ProjectBundle\Entity\Project $project
     *
     * @return Presentation
     */
    public function setProject(\ArgoMCMBuilder\ProjectBundle\Entity\Project $project = null)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Get project.
     *
     * @return \ArgoMCMBuilder\ProjectBundle\Entity\Project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Set company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     *
     * @return Presentation
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
     * Set agency.
     *
     * @param \ArgoMCMBuilder\BackOfficeBundle\Entity\Agence $agency
     *
     * @return Presentation
     */
    public function setAgency(\ArgoMCMBuilder\BackOfficeBundle\Entity\Agence $agency = null)
    {
        $this->agency = $agency;

        return $this;
    }

    /**
     * Get agency.
     *
     * @return \ArgoMCMBuilder\BackOfficeBundle\Entity\Agence
     */
    public function getAgency()
    {
        return $this->agency;
    }

    /**
     * Set owner.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $owner
     *
     * @return Presentation
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
     * Add editor.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $editor
     *
     * @return Presentation
     */
    public function addEditor(\ArgoMCMBuilder\UserBundle\Entity\User $editor)
    {
        $this->editors[] = $editor;

        return $this;
    }

    /**
     * Remove editor.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $editor
     */
    public function removeEditor(\ArgoMCMBuilder\UserBundle\Entity\User $editor)
    {
        $this->editors->removeElement($editor);
    }

    /**
     * Get editors.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEditors()
    {
        return $this->editors;
    }

    /**
     * Add viewer.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $viewer
     *
     * @return Presentation
     */
    public function addViewer(\ArgoMCMBuilder\UserBundle\Entity\User $viewer)
    {
        $this->viewers[] = $viewer;

        return $this;
    }

    /**
     * Remove viewer.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $viewer
     */
    public function removeViewer(\ArgoMCMBuilder\UserBundle\Entity\User $viewer)
    {
        $this->viewers->removeElement($viewer);
    }

    /**
     * Get viewers.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getViewers()
    {
        return $this->viewers;
    }

    /**
     * @param Revision $revision
     *
     * @return Presentation
     */
    public function addRevision(Revision $revision)
    {
        $this->revisions[] = $revision;

        return $this;
    }

    /**
     * @param Revision $revision
     */
    public function removeRevision(Revision $revision)
    {
        $this->revisions->removeElement($revision);
    }

    /**
     * @param Reference $reference
     */
    public function addReference(Reference $reference)
    {
        $this->references[] = $reference;

        return $this;
    }

    /**
     * @param Reference $reference
     */
    public function removeReference(Reference $reference)
    {
        $this->references->removeElement($reference);
    }

    /**
     * Get revisions.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getRevisions()
    {
        return $this->revisions;
    }

    /**
     * Set parent.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $parent
     *
     * @return Presentation
     */
    public function setParent(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $parent = null)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent.
     *
     * @return \ArgoMCMBuilder\PresentationBundle\Entity\Presentation
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Add child.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $child
     *
     * @return Presentation
     */
    public function addChild(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $child)
    {
        $this->children[] = $child;

        return $this;
    }

    /**
     * Remove child.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $child
     */
    public function removeChild(\ArgoMCMBuilder\PresentationBundle\Entity\Presentation $child)
    {
        $this->children->removeElement($child);
    }

    /**
     * Get children.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * Set lastUsed.
     *
     * @param \DateTime $lastUsed
     *
     * @return Presentation
     */
    public function setLastUsed($lastUsed)
    {
        $this->lastUsed = $lastUsed;

        return $this;
    }

    /**
     * Get lastUsed.
     *
     * @return \DateTime
     */
    public function getLastUsed()
    {
        return $this->lastUsed;
    }

    /**
     * Set modeEdit.
     *
     * @param int $modeEdit
     *
     * @return Presentation
     */
    public function setModeEdit($modeEdit)
    {
        $this->modeEdit = $modeEdit;

        return $this;
    }

    /**
     * Get modeEdit.
     *
     * @return int
     */
    public function getModeEdit()
    {
        return $this->modeEdit;
    }

    /**
     * param $idRev.
     *
     * @return bool
     */
    public function getUrlExists($idRev)
    {
        $url = 'slides-pdf/'.$idRev.'/'.$idRev.'.pdf';
        if (file_exists($url)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Set usedBy.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $usedBy
     *
     * @return Presentation
     */
    public function setUsedBy(\ArgoMCMBuilder\UserBundle\Entity\User $usedBy = null)
    {
        $this->usedBy = $usedBy;

        return $this;
    }

    /**
     * Get usedBy.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\User
     */
    public function getUsedBy()
    {
        return $this->usedBy;
    }


    /**
     * Add veeva
     *
     * @param \ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva $veeva
     *
     * @return Presentation
     */
    public function addVeeva(\ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva $veeva)
    {
        $this->veevas[] = $veeva;

        return $this;
    }

    /**
     * Remove veeva
     *
     * @param \ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva $veeva
     */
    public function removeVeeva(\ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva $veeva)
    {
        $this->veevas->removeElement($veeva);
    }

    /**
     * Get veevas
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getVeevas()
    {
        return $this->veevas;
    }

    /**
     * clearId
     */
    public function clearId()
    {
        $this->id = null;
    }

}
