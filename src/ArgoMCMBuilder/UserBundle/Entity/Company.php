<?php

namespace ArgoMCMBuilder\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Company.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_company")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\UserBundle\Entity\CompanyRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Company
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
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="User", mappedBy="company", cascade={"persist"})
     */
    protected $users;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\ProjectBundle\Entity\Project", mappedBy="company",
     *     cascade={"persist"})
     */
    protected $projects;

    /**
     * Many Users have Many Groups.
     *
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\BackOfficeBundle\Entity\Agence", inversedBy="companies")
     * @ORM\JoinTable(name="mcm_companies_agencies")
     */
    private $agencies;

    /**
     * @ORM\OneToMany(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", mappedBy="parent")
     */
    private $children;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", inversedBy="children",
     *     cascade={"persist"})
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", nullable=true, onDelete="cascade")
     */
    private $parent;
    /**
     * @var string
     *
     * @ORM\Column(name="veevaUrl", type="string", length=255,nullable=true)
     * @Assert\Url(
     *     protocols = {"https"},
     *    message = "Please fill a correct URL “https://...”."
     * )
     */
    private $veevaUrl;
    /**
     * @var string
     *
     * @ORM\Column(name="veevaApi", type="string", length=255,nullable=true)
     */
    private $veevaApi;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
        $this->projects = new \Doctrine\Common\Collections\ArrayCollection();
        $this->agencies = new \Doctrine\Common\Collections\ArrayCollection();
        $this->children = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Company
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
     * Set VeevaUrl.
     *
     * @param string $veevaUrl
     *
     * @return VeevaUrl
     */
    public function setVeevaUrl($veevaUrl)
    {
        $this->veevaUrl = $veevaUrl;

        return $this;
    }

    /**
     * Get veevaUrl.
     *
     * @return string
     */
    public function getVeevaUrl()
    {
        return $this->veevaUrl;
    }

    /**
     * Set $veevaApi.
     *
     * @param string $veevaApi
     *
     * @return VeevaApi
     */
    public function setVeevaApi($veevaApi)
    {
        $this->veevaApi = $veevaApi;

        return $this;
    }

    /**
     * Get veevaApi.
     *
     * @return string
     */
    public function getVeevaApi()
    {
        return $this->veevaApi;
    }

    /**
     * Add user.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $user
     *
     * @return Company
     */
    public function addUser(\ArgoMCMBuilder\UserBundle\Entity\User $user)
    {
        $this->users[] = $user;

        return $this;
    }

    /**
     * Remove user.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $user
     */
    public function removeUser(\ArgoMCMBuilder\UserBundle\Entity\User $user)
    {
        $this->users->removeElement($user);
    }

    /**
     * Get users.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * Add project.
     *
     * @param \ArgoMCMBuilder\ProjectBundle\Entity\Project $project
     *
     * @return Company
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
     * Add agency.
     *
     * @param \ArgoMCMBuilder\BackOfficeBundle\Entity\Agence $agency
     *
     * @return Company
     */
    public function addAgency(\ArgoMCMBuilder\BackOfficeBundle\Entity\Agence $agency)
    {
        $this->agencies[] = $agency;

        return $this;
    }

    /**
     * Remove agency.
     *
     * @param \ArgoMCMBuilder\BackOfficeBundle\Entity\Agence $agency
     */
    public function removeAgency(\ArgoMCMBuilder\BackOfficeBundle\Entity\Agence $agency)
    {
        $this->agencies->removeElement($agency);
    }

    /**
     * Get agencies.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAgencies()
    {
        return $this->agencies;
    }

    /**
     * Add child.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $child
     *
     * @return Company
     */
    public function addChild(\ArgoMCMBuilder\UserBundle\Entity\Company $child)
    {
        $this->children[] = $child;

        return $this;
    }

    /**
     * Remove child.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $child
     */
    public function removeChild(\ArgoMCMBuilder\UserBundle\Entity\Company $child)
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
     * Set parent.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $parent
     *
     * @return Company
     */
    public function setParent(\ArgoMCMBuilder\UserBundle\Entity\Company $parent = null)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\Company
     */
    public function getParent()
    {
        return $this->parent;
    }
}
