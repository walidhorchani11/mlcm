<?php

namespace ArgoMCMBuilder\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\Util\SecureRandom;

/**
 * User.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_user")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\UserBundle\Entity\UserRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class User extends BaseUser
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
     * @ORM\Column(name="firstname", type="string", nullable=true)
     */
    protected $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", nullable=true)
     */
    protected $lastname;

    /**
     * @var string
     *
     * @ORM\Column(name="occupation", type="string", nullable=true)
     */
    protected $occupation;

    /**
     * @var string
     *
     * @ORM\Column(name="old_Role", type="string", nullable=true)
     */
    protected $oldRole;

    /**
     * @var string
     *
     * @ORM\Column(name="profile_picture", type="string", length=255, nullable=true)
     */
    protected $picture;

    /**
     * @Assert\File(maxSize="6000000")
     */
    public $file;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="string", nullable=true)
     */
    protected $country;

    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Group")
     * @ORM\JoinTable(name="mcm_users_groups",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="group_id", referencedColumnName="id")}
     * )
     */
    protected $groups;

    /**
     * @ORM\ManyToOne(targetEntity="Company", inversedBy="users", cascade={"persist"})
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $company;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", mappedBy="owner")
     */
    protected $presentations;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Revision", mappedBy="user")
     */
    protected $revision;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\ProjectBundle\Entity\Project", mappedBy="owner", cascade={"persist"})
     */
    protected $projects;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Reference", mappedBy="user")
     */
    private $references;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=true)
     */
    protected $lastUpdate;

    /**
     * @var int
     *
     * @ORM\Column(name="flag_pres", type="integer", nullable=true)
     */
    protected $flagPres;

    public function __construct()
    {
        parent::__construct();
        $this->groups = new ArrayCollection();
        $this->references = new ArrayCollection();
    }

    public function setEmail($email)
    {
        $email = is_null($email) ? '' : $email;
        parent::setEmail($email);
        $this->setUsername($email);

        return $this;
    }

    /**
     * Set firstname.
     *
     * @param string $firstname
     *
     * @return User
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname.
     *
     * @return string
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname.
     *
     * @param string $lastname
     *
     * @return User
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFullName()
    {
        return $this->firstname.' '.$this->lastname;
    }

    /**
     * Get lastname.
     *
     * @return string
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Get Occupation.
     *
     * @return string
     */
    public function getOccupation()
    {
        return $this->occupation;
    }

    /**
     * Set Occupation.
     *
     * @param string $occupation
     *
     * @return User
     */
    public function setOccupation($occupation)
    {
        $this->occupation = $occupation;

        return $this;
    }

    /**
     * Set picture.
     *
     * @param string $picture
     *
     * @return User
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * Get picture.
     *
     * @return string
     */
    public function getPicture()
    {
        return $this->picture;
    }

    /**
     * Set country.
     *
     * @param string $country
     *
     * @return User
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country.
     *
     * @return string
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     *
     * @return User
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
     * @param UploadedFile $file
     *
     * @return object
     */
    public function setFile(UploadedFile $file = null)
    {
        // set the value of the holder
        $this->file = $file;
        // check if we have an old image path
        if (isset($this->picture)) {
            $this->lastUpdate = new \DateTime();
            // store the old name to delete after the update
            $this->t = $this->picture;
            $this->tempPath = null;
        } else {
            $this->picture = 'initial';
        }

        return $this;
    }

    /**
     * Get the file used for profile picture uploads.
     *
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload()
    {
        if (null !== $this->getFile()) {
            // a file was uploaded
            // generate a unique filename
            $filename = $this->generateRandomProfilePictureFilename();
            $this->setPicture($filename.'.'.$this->getFile()->guessExtension());
        }
    }

    /**
     * Generates a 32 char long random filename.
     *
     * @return string
     */
    public function generateRandomProfilePictureFilename()
    {
        $count = 0;
        do {
            $generator = new SecureRandom();
            $random = $generator->nextBytes(16);
            $randomString = bin2hex($random);
            ++$count;
        } while (file_exists($this->getUploadRootDir().'/'.$randomString.'.'.$this->getFile()->guessExtension())
            && $count < 50);

        return $randomString;
    }

    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload()
    {
        if (null === $this->file) {
            return;
        }
        $this->getFile()->move($this->getUploadRootDir(), $this->getPicture());

        if (isset($this->tempPath) && file_exists($this->getUploadRootDir().'/'.$this->tempPath)) {
            unlink($this->getUploadRootDir().'/'.$this->tempPath);
            $this->tempPath = null;
        }
        $this->file = null;
    }

    /**
     * @ORM\PostRemove()
     }*/
    public function getAbsolutePath()
    {
        return null === $this->picture ? null : $this->getUploadRootDir().'/'.$this->picture;
    }

    public function getWebPath()
    {
        return null === $this->picture ? null : $this->getUploadDir().'/'.$this->id.'/'.$this->picture;
    }

    public function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    public function getUploadDir()
    {
        return 'uploads/users';
    }

    /**
     * Add project.
     *
     * @param \ArgoMCMBuilder\ProjectBundle\Entity\Project $project
     *
     * @return User
     */
    public function addProject(\ArgoMCMBuilder\ProjectBundle\Entity\Project $project)
    {
        $this->projects[] = $project;

        return $this;
    }

    /**
     * Remove project.
     *
     * @param \ArgoMCMBuilder\ProjectBundle\Entity\Project $project
     */
    public function removeProject(\ArgoMCMBuilder\ProjectBundle\Entity\Project $project)
    {
        $this->projects->removeElement($project);
    }

    /**
     * Get projects.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProjects()
    {
        return $this->projects;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getGroups()
    {
        return $this->groups;
    }

    /**
     * @param mixed $groups
     */
    public function setGroups($groups)
    {
        $this->groups = $groups;
    }

    /**
     * @return mixed
     */
    public function getReferences()
    {
        return $this->references;
    }

    /**
     * @param mixed $references
     */
    public function setReferences($references)
    {
        $this->references = $references;
    }

    /**
     * Add reference.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Reference $reference
     *
     * @return User
     */
    public function addReference(\ArgoMCMBuilder\PresentationBundle\Entity\Reference $reference)
    {
        $this->references[] = $reference;
        $reference->setUser($this);

        return $this;
    }

    /**
     * Remove reference.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Reference $reference
     */
    public function removeReference(\ArgoMCMBuilder\PresentationBundle\Entity\Reference $reference)
    {
        $this->references->removeElement($reference);
        $reference->setUser(null);
    }

    /**
     * @return \DateTime
     */
    public function getLastUpdate()
    {
        return $this->lastUpdate;
    }

    /**
     * @param \DateTime $lastUpdate
     */
    public function setLastUpdate(\DateTime $lastUpdate = null)
    {
        $this->lastUpdate = $lastUpdate;
    }

    /**
     * Add presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return User
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
     * Set flagPres.
     *
     * @param int $flagPres
     *
     * @return User
     */
    public function setFlagPres($flagPres)
    {
        $this->flagPres = $flagPres;

        return $this;
    }

    /**
     * Get flagPres.
     *
     * @return int
     */
    public function getFlagPres()
    {
        return $this->flagPres;
    }

    /**
     * Set oldRole
     *
     * @param string $oldRole
     *
     * @return User
     */
    public function setOldRole($oldRole)
    {
        $this->oldRole = $oldRole;

        return $this;
    }

    /**
     * Get oldRole
     *
     * @return string
     */
    public function getOldRole()
    {
        return $this->oldRole;
    }

    /**
     * Add revision.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Revision $revision
     *
     * @return User
     */
    public function addRevision(\ArgoMCMBuilder\PresentationBundle\Entity\Revision $revision)
    {
        $this->revisions[] = $revision;

        return $this;
    }

    /**
     * Remove revision.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Revision $revision
     */
    public function removeRevision(\ArgoMCMBuilder\PresentationBundle\Entity\Revision $revision)
    {
        $this->revisions->removeElement($revision);
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

}
