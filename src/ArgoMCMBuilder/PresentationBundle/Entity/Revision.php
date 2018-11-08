<?php

namespace ArgoMCMBuilder\PresentationBundle\Entity;

use ArgoMCMBuilder\MediaBundle\Entity\Image;
use ArgoMCMBuilder\MediaBundle\Entity\Pdf;
use ArgoMCMBuilder\MediaBundle\Entity\Video;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;

/**
 * Revision.
 *
 * @ORM\Table(name="mcm_revision")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\PresentationBundle\Repository\RevisionRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Revision
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
     * @var string|null
     *
     * @ORM\Column(name="visibility", type="string", length=255, nullable=true)
     */
    private $visibility;

    /**
     * @var string
     *
     * @ORM\Column(name="thumbnail_url", type="string", length=255, nullable=true)
     */
    private $thumbnailUrl;

    /**
     * @var float
     *
     * @ORM\Column(name="version", type="string", nullable=true)
     */
    private $version;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="data_updated_at", type="datetime", nullable=true)
     */
    private $dataUpdatedAt;

    /**
     * @var string
     *
     * @ORM\Column(name="access_token", type="string", nullable=true)
     */
    private $accessToken;

    /**
     * @ORM\Column(name="presentation_settings", type="json_doc", nullable=true)
     */
    private $preSettings;

    /**
     * @ORM\Column(name="old_presentation_settings", type="json_doc", nullable=true)
     */
    private $oldPreSettings;

    /**
     * @var string
     *
     * @ORM\Column(name="data", type="text", nullable=true)
     */
    private $data;

    /**
     * @var Presentation
     *
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", inversedBy="revisions",
     *     cascade={"persist"})
     * @ORM\JoinColumn(name="presentation_id", referencedColumnName="id")
     **/
    protected $presentation;

    /**
     * @ORM\Column(name="slides", type="json_doc", nullable=true)
     */
    private $slides;

    /**
     * @ORM\Column(name="menu_json", type="json_doc", nullable=true)
     */
    private $menuJson;

    /**
     * @ORM\Column(name="menu", type="text", nullable=true)
     */
    private $menu;

    /**
     * @ORM\Column(name="popin", type="json_doc", nullable=true)
     */
    private $popin;

    /**
     * @ORM\Column(name="survey", type="json_doc", nullable=true)
     */
    private $survey;

    /**
     * @ORM\Column(name="linked_ref", type="json_doc", nullable=true)
     */
    private $linkedRef;

    /**
     * @var ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\MediaBundle\Entity\Pdf", inversedBy="revisionPdf")
     * @ORM\JoinTable(name="mcm_pdf_revision")
     */
    private $pdf;
    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\MediaBundle\Entity\Image", inversedBy="revisionImage")
     * @ORM\JoinTable(name="mcm_image_revision")
     */
    private $image;

    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\MediaBundle\Entity\Video", inversedBy="revisionVideo")
     * @ORM\JoinTable(name="mcm_video_revision")
     */
    private $video;

    /**
     * @var string
     *
     * @ORM\Column(name="s3_folder", type="text", nullable=true)
     */
    private $dataFolderS3;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="text", nullable=true)
     */
    private $comment;

    /**
     * @var string
     *
     * @ORM\Column(name="parent", type="text", nullable=true)
     */
    private $parent;

    /**
     * @var datetime
     *
     * @ORM\Column(type="datetime", nullable = true)
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", inversedBy="presentations")
     */
    protected $user;

    /**
     * One Revision has One StatisticMedia.
     * @ORM\OneToOne(targetEntity="StatisticMedia",cascade={"persist", "remove"})
     * @ORM\JoinColumn(name="statisticMedia_id", referencedColumnName="id")
     */
    private $statisticMedia;

    /**
     * One Revision has One HistoryRevision.
     * @ORM\OneToOne(targetEntity="HistoryRevision",cascade={"persist", "remove"})
     * @ORM\JoinColumn(name="historyRevision_id", referencedColumnName="id")
     */
    private $historyRevision;

    /**
     * @var string
     *
     * @ORM\Column(name="s3_folder_veeva", type="text", nullable=true)
     */
    private $dataFolderVeevaS3;

    /**
     * Constructor.
     */
    public function __construct()
    {
    }

    /**
     * Add pdf.
     *
     * @param Pdf $pdf
     *
     * @return Revision
     */
    public function addPdf(Pdf $pdf)
    {
        $this->pdf[] = $pdf;

        return $this;
    }

    /**
     * Remove pdf.
     *
     * @param Pdf $pdf
     */
    public function removePdf(Pdf $pdf)
    {
        $this->pdf->removeElement($pdf);
    }

    /**
     * Add image.
     *
     * @param Image $image
     *
     * @return Revision
     */
    public function addImage(Image $image)
    {
        $this->image[] = $image;

        return $this;
    }

    /**
     * Remove image.
     *
     * @param Image $image
     */
    public function removeImage(Image $image)
    {
        $this->image->removeElement($image);
    }


    /**
     * Add video.
     *
     * @param Video $video
     *
     * @return Revision
     */
    public function addVideo(Video $video)
    {
        $this->video[] = $video;

        return $this;
    }

    /**
     * Remove video.
     *
     * @param Video $video
     */
    public function removeVideo(Video $video)
    {
        $this->video->removeElement($video);
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
     * @return null|string
     */
    public function getVisibility()
    {
        return $this->visibility;
    }

    /**
     * @param null|string $visibility
     */
    public function setVisibility($visibility)
    {
        $this->visibility = $visibility;
    }

    /**
     * @return mixed
     */
    public function getPdf()
    {
        return $this->pdf;
    }

    /**
     * @param mixed $pdf
     */
    public function setPdf($pdf)
    {
        $this->pdf = $pdf;
    }

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param mixed $image
     */
    public function setImage($image)
    {
        $this->image = $image;
    }

    /**
     * @return mixed
     */
    public function getVideo()
    {
        return $this->video;
    }

    /**
     * @param mixed $video
     */
    public function setVideo($video)
    {
        $this->video = $video;
    }

    /**
     * @return string|null
     */
    public function getThumbnailUrl()
    {
        return $this->thumbnailUrl;
    }

    /**
     * @param string $thumbnailUrl
     */
    public function setThumbnailUrl($thumbnailUrl)
    {
        $this->thumbnailUrl = $thumbnailUrl;
    }

    /**
     * @return string|null
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * @param string $version
     */
    public function setVersion($version)
    {
        $this->version = $version;
    }

    /**
     * @return \DateTime|null
     */
    public function getDataUpdatedAt()
    {
        return $this->dataUpdatedAt;
    }

    /**
     * @param \DateTime $dataUpdatedAt
     */
    public function setDataUpdatedAt($dataUpdatedAt)
    {
        $this->dataUpdatedAt = $dataUpdatedAt;
    }

    /**
     * @return string|null
     */
    public function getAccessToken()
    {
        return $this->accessToken;
    }

    /**
     * @param string $accessToken
     */
    public function setAccessToken($accessToken)
    {
        $this->accessToken = $accessToken;
    }

    /**
     * @return mixed
     */
    public function getPreSettings()
    {
        return $this->preSettings;
    }

    /**
     * @param mixed $preSettings
     */
    public function setPreSettings($preSettings)
    {
        $this->preSettings = $preSettings;
    }

    /**
     * @return mixed
     */
    public function getOldPreSettings()
    {
        return $this->oldPreSettings;
    }

    /**
     * @param mixed $oldPreSettings
     */
    public function setOldPreSettings($oldPreSettings)
    {
        $this->oldPreSettings = $oldPreSettings;
    }

    /**
     * @return string
     */
    public function getData(): string
    {
        return $this->data;
    }

    /**
     * @param string $data
     */
    public function setData(string $data)
    {
        $this->data = $data;
    }

    /**
     * @return Presentation
     */
    public function getPresentation(): Presentation
    {
        return $this->presentation;
    }

    /**
     * @param Presentation $presentation
     */
    public function setPresentation(Presentation $presentation)
    {
        $this->presentation = $presentation;
    }

    /**
     * @return $slides
     */
    public function getSlides()
    {
        return $this->slides;
    }


    /**
     * @param mixed $slides
     */
    public function setSlides($slides)
    {
        $this->slides = $slides;
    }

    /**
     * @return mixed
     */
    public function getMenuJson()
    {
        return $this->menuJson;
    }

    /**
     * @param mixed $menuJson
     */
    public function setMenuJson($menuJson)
    {
        $this->menuJson = $menuJson;
    }

    /**
     * @return mixed
     */
    public function getMenu()
    {
        return $this->menu;
    }

    /**
     * @param mixed $menu
     */
    public function setMenu($menu)
    {
        $this->menu = $menu;
    }

    /**
     * @return mixed
     */
    public function getPopin()
    {
        return $this->popin;
    }

    /**
     * @param mixed $popin
     */
    public function setPopin($popin)
    {
        $this->popin = $popin;
    }

    /**
     * @return mixed
     */
    public function getSurvey()
    {
        return $this->survey;
    }

    /**
     * @param mixed $survey
     */
    public function setSurvey($survey)
    {
        $this->survey = $survey;
    }

    /**
     * @return mixed
     */
    public function getLinkedRef()
    {
        return $this->linkedRef;
    }

    /**
     * @param mixed $linkedRef
     */
    public function setLinkedRef($linkedRef)
    {
        $this->linkedRef = $linkedRef;
    }

    /**
     * clearId
     */
    public function clearId()
    {
        $this->id = null;
    }

    /**
     * Set dataFolderS3
     *
     * @param string $dataFolderS3
     *
     * @return Revision
     */
    public function setDataFolderS3($dataFolderS3)
    {
        $this->dataFolderS3 = $dataFolderS3;

        return $this;
    }

    /**
     * Get dataFolderS3
     *
     * @return string
     */
    public function getDataFolderS3()
    {
        return $this->dataFolderS3;
    }

    /**
     * Set dataFolderVeevaS3
     *
     * @param string $dataFolderVeevaS3
     *
     * @return Revision
     */
    public function setDataFolderVeevaS3($dataFolderVeevaS3)
    {
        $this->dataFolderVeevaS3 = $dataFolderVeevaS3;

        return $this;
    }

    /**
     * Get dataFolderVeevaS3
     *
     * @return string
     */
    public function getDataFolderVeevaS3()
    {
        return $this->dataFolderVeevaS3;
    }

    /**
     * Set comment
     *
     * @param string $comment
     *
     * @return comment
     */
    public function setComment($comment)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment
     *
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * Set parent
     *
     * @param string parent
     *
     * @return comment
     */
    public function setParent($parent)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent
     *
     * @return string
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Gets triggered only on insert
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->createdAt = new \DateTime("now");
    }

    /**
     * @return createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set user.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $user
     *
     * @return user
     */
    public function setUser(\ArgoMCMBuilder\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set statisticMedia
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\StatisticMedia $statisticMedia
     *
     * @return StatisticMedia
     */
    public function setStatisticMedia(\ArgoMCMBuilder\PresentationBundle\Entity\StatisticMedia $statisticMedia = null)
    {
        $this->statisticMedia = $statisticMedia;

        return $this;
    }

    /**
     * Get statisticMedia
     *
     * @return \ArgoMCMBuilder\PresentationBundle\StatisticMedia
     */
    public function getStatisticMedia()
    {
        return $this->statisticMedia;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Revision
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Set historyRevision
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\HistoryRevision $historyRevision
     *
     * @return Revision
     */
    public function setHistoryRevision(\ArgoMCMBuilder\PresentationBundle\Entity\HistoryRevision $historyRevision = null)
    {
        $this->historyRevision = $historyRevision;

        return $this;
    }

    /**
     * Get historyRevision
     *
     * @return \ArgoMCMBuilder\PresentationBundle\Entity\HistoryRevision
     */
    public function getHistoryRevision()
    {
        return $this->historyRevision;
    }
}
