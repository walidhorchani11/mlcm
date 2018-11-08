<?php

namespace ArgoMCMBuilder\MediaBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

class Media
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
    private $url;

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
    private $title;

    /**
     * @var text
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
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Set url.
     *
     * @param string $url
     *
     * @return Media
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url.
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set labelMedia.
     *
     * @param string $labelMedia
     *
     * @return Media
     */
    public function setLabelMedia($labelMedia)
    {
        $this->labelMedia = $labelMedia;

        return $this;
    }

    /**
     * Get labelMedia.
     *
     * @return string
     */
    public function getLabelMedia()
    {
        return $this->labelMedia;
    }

    /**
     * Set height.
     *
     * @param int $height
     *
     * @return Media
     */
    public function setHeight($height)
    {
        $this->height = $height;

        return $this;
    }

    /**
     * Get height.
     *
     * @return int
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * Set width.
     *
     * @param int $width
     *
     * @return Media
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }

    /**
     * Get width.
     *
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set size.
     *
     * @param int $size
     *
     * @return Media
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * Get size.
     *
     * @return int
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set inline.
     *
     * @param bool $inline
     *
     * @return Media
     */
    public function setInline($inline)
    {
        $this->inline = $inline;

        return $this;
    }

    /**
     * Get inline.
     *
     * @return bool
     */
    public function getInline()
    {
        return $this->inline;
    }

    /**
     * Set thumbUrl.
     *
     * @param string $thumbUrl
     *
     * @return Media
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumbUrl = $thumbUrl;

        return $this;
    }

    /**
     * Get thumbUrl.
     *
     * @return string
     */
    public function getThumbUrl()
    {
        return $this->thumbUrl;
    }

    /**
     * Set contentType.
     *
     * @param string $contentType
     *
     * @return Media
     */
    public function setContentType($contentType)
    {
        $this->contentType = $contentType;

        return $this;
    }

    /**
     * Get contentType.
     *
     * @return string
     */
    public function getContentType()
    {
        return $this->contentType;
    }

    /**
     * Set master.
     *
     * @param bool $master
     *
     * @return Media
     */
    public function setMaster($master)
    {
        $this->master = $master;

        return $this;
    }

    /**
     * Get master.
     *
     * @return bool
     */
    public function getMaster()
    {
        return $this->master;
    }

    /**
     * Set shared.
     *
     * @param bool $shared
     *
     * @return Media
     */
    public function setShared($shared)
    {
        $this->shared = $shared;

        return $this;
    }

    /**
     * Get shared.
     *
     * @return bool
     */
    public function getShared()
    {
        return $this->shared;
    }

    /**
     * Set title.
     *
     * @param string $title
     *
     * @return Media
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set legend.
     *
     * @param string $legend
     *
     * @return Media
     */
    public function setLegend($legend)
    {
        $this->legend = $legend;

        return $this;
    }

    /**
     * Get legend.
     *
     * @return string
     */
    public function getLegend()
    {
        return $this->legend;
    }

    /**
     * Set created.
     *
     * @param \DateTime $created
     *
     * @return Media
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
     * Set updated.
     *
     * @param \DateTime $updated
     *
     * @return Media
     */
    public function setUpdated($updated)
    {
        $this->updated = $updated;

        return $this;
    }

    /**
     * Get updated.
     *
     * @return \DateTime
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * Set flag.
     *
     * @param int $flag
     *
     * @return Media
     */
    public function setFlag($flag)
    {
        $this->flag = $flag;

        return $this;
    }

    /**
     * Get flag.
     *
     * @return int
     */
    public function getFlag()
    {
        return $this->flag;
    }
}
