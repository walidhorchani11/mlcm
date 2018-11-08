<?php

namespace ArgoMCMBuilder\MediaBundle\Entity;

use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use ArgoMCMBuilder\UserBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Pdf.
 *
 * @ORM\Table(name="mcm_pdf")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\MediaBundle\Repository\PdfRepository")
 */
class Pdf
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    public $id;
    /**
     * @var string
     *
     * @ORM\Column(name="url", type="string", length=255, nullable=true)
     */
    public $url;

    /**
     * @var string
     *
     * @ORM\Column(name="label_media", type="string", length=255, nullable=true)
     */
    private $labelMedia;

    /**
     * @var string
     *
     * @ORM\Column(name="size", type="integer", nullable=true)
     */
    private $size;

    /**
     * @var bool
     *
     * @ORM\Column(name="inline", type="boolean", nullable=true)
     */
    private $inline;

    /**
     * @var string
     *
     * @ORM\Column(name="thumb_url", type="string", length=255, nullable=true)
     */
    private $thumbUrl;
    /**
     * @var int
     *
     * @ORM\Column(name="height", type="integer", nullable=true)
     */
    private $height;

    /**
     * @var int
     *
     * @ORM\Column(name="width", type="integer" , nullable=true)
     */
    private $width;
    /**
     * @var string
     *
     * @ORM\Column(name="content_type", type="string", length=255, nullable=true)
     */
    private $contentType;

    /**
     * @var bool
     *
     * @ORM\Column(name="master", type="boolean", nullable=true)
     */
    private $master;
    /**
     * @var bool
     *
     * @ORM\Column(name="shared", type="boolean", nullable=true)
     */
    private $shared;
    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=true)
     */
    public $title;

    /**
     * @var string
     *
     * @ORM\Column(name="legend", type="text", nullable=true)
     */
    private $legend;

    /**
     * @var \DateTime
     *
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @var \DateTime
     *
     * @ORM\Column(type="datetime", nullable = true)
     */
    protected $updated;
    /**
     * @var int
     *
     * @ORM\Column(name="flag", type="integer", nullable=true,options={"default" : 10})
     */
    protected $flag;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinColumn(name="owner_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $owner;
    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", cascade={"persist"})
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $Company;
    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Revision", mappedBy="pdf")
     * @ORM\JoinColumn(name="revision_id", referencedColumnName="id" , onDelete="CASCADE" )
     */
    protected $revisionPdf;

    /**
     * @var string
     *
     * @ORM\Column(name="bucket_name", type="string", length=255, nullable=true)
     */
    protected $bucketName;

    /**
     * @var string
     *
     * @ORM\Column(name="key_media", type="string", length=255, nullable=true)
     */
    protected $key;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->revisionPdf = new ArrayCollection();
        $this->shared = 0;
        $this->master = 0;
        $this->legend = '';
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
     * Gets triggered every time on update.
     *
     * @ORM\PreUpdate
     */
    public function onPreUpdate()
    {
        $this->updated = new \DateTime('now');
    }

    /**
     * Set owner.
     *
     * @param User $owner
     *
     * @return Pdf
     */
    public function setOwner(User $owner = null)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * Set company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     *
     * @return Pdf
     */
    public function setCompany(\ArgoMCMBuilder\UserBundle\Entity\Company $company = null)
    {
        $this->Company = $company;

        return $this;
    }

    /**
     * Get company.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\Company
     */
    public function getCompany()
    {
        return $this->Company;
    }

    /**
     * Add presentationPdf.
     *
     * @param Revision $revisionPdf
     *
     * @return Pdf
     */
    public function addRevisionPdf(Revision $revisionPdf)
    {
        $this->revisionPdf[] = $revisionPdf;

        return $this;
    }

    /**
     * Remove presentationPdf.
     *
     * @param Revision $revisionPdf
     */
    public function removePresentationPdf(Revision $revisionPdf)
    {
        $this->revisionPdf->removeElement($revisionPdf);
    }

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
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl(string $url)
    {
        $this->url = $url;
    }

    /**
     * @return string
     */
    public function getLabelMedia(): string
    {
        return $this->labelMedia;
    }

    /**
     * @param string $labelMedia
     */
    public function setLabelMedia(string $labelMedia)
    {
        $this->labelMedia = $labelMedia;
    }

    /**
     * @return string
     */
    public function getSize(): ?string
    {
        return $this->size;
    }

    /**
     * @param string $size
     */
    public function setSize(?string $size)
    {
        $this->size = $size;
    }

    /**
     * @return bool
     */
    public function isInline(): bool
    {
        return $this->inline;
    }

    /**
     * @param bool $inline
     */
    public function setInline(bool $inline)
    {
        $this->inline = $inline;
    }

    /**
     * @return string
     */
    public function getThumbUrl(): string
    {
        return $this->thumbUrl;
    }

    /**
     * @param string $thumbUrl
     */
    public function setThumbUrl(string $thumbUrl)
    {
        $this->thumbUrl = $thumbUrl;
    }

    /**
     * @return int|null
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @param int $height
     */
    public function setHeight(int $height)
    {
        $this->height = $height;
    }

    /**
     * @return int|null
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param int $width
     */
    public function setWidth(int $width)
    {
        $this->width = $width;
    }

    /**
     * @return string
     */
    public function getContentType(): string
    {
        return $this->contentType;
    }

    /**
     * @param string $contentType
     */
    public function setContentType(string $contentType)
    {
        $this->contentType = $contentType;
    }

    /**
     * @return bool
     */
    public function isMaster(): bool
    {
        return $this->master;
    }

    /**
     * @param bool $master
     */
    public function setMaster(bool $master)
    {
        $this->master = $master;
    }

    /**
     * @return bool
     */
    public function isShared(): bool
    {
        return $this->shared;
    }

    /**
     * @param bool $shared
     */
    public function setShared(bool $shared)
    {
        $this->shared = $shared;
    }

    /**
     * @return string
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(?string $title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getLegend(): string
    {
        return $this->legend;
    }

    /**
     * @param string $legend
     */
    public function setLegend(string $legend)
    {
        $this->legend = $legend;
    }

    /**
     * @return \DateTime
     */
    public function getCreated(): \DateTime
    {
        return $this->created;
    }

    /**
     * @param \DateTime $created
     */
    public function setCreated(\DateTime $created)
    {
        $this->created = $created;
    }

    /**
     * @return \DateTime
     */
    public function getUpdated(): \DateTime
    {
        return $this->updated;
    }

    /**
     * @param \DateTime $updated
     */
    public function setUpdated(\DateTime $updated)
    {
        $this->updated = $updated;
    }

    /**
     * @return int
     */
    public function getFlag(): int
    {
        return $this->flag;
    }

    /**
     * @param int $flag
     */
    public function setFlag(int $flag)
    {
        $this->flag = $flag;
    }

    /**
     * @return mixed
     */
    public function getRevisionPdf()
    {
        return $this->revisionPdf;
    }

    /**
     * @param mixed $revisionPdf
     */
    public function setRevisionPdf($revisionPdf)
    {
        $this->revisionPdf = $revisionPdf;
    }

    /**
     * @return string|null
     */
    public function getBucketName()
    {
        return $this->bucketName;
    }

    /**
     * @param string $bucketName
     */
    public function setBucketName(string $bucketName)
    {
        $this->bucketName = $bucketName;
    }

    /**
     * @return string|null
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param string $key
     */
    public function setKey(string $key)
    {
        $this->key = $key;
    }
}
