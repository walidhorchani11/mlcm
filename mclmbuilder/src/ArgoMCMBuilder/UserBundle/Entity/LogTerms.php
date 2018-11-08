<?php

namespace ArgoMCMBuilder\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Company.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_log_terms")
 */
class LogTerms
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
     * @ORM\Column(name="username", type="string", length=255)
     */
    protected $username;

    /**
     * @var date
     *
     * @ORM\Column(name="creation_date", type="datetime")
     */
    protected $creationDate;

    /**
     * @var int
     *
     * @ORM\Column(name="is_enabled", type="integer")
     */
    protected $isEnabled;

    /**
     * @var string
     *
     * @ORM\Column(name="address_ip", type="string", length=255)
     */
    protected $ip;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $user;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->creationDate = new \DateTime();
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
     * Set username
     *
     * @param string $username
     *
     * @return LogTerms
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set creationDate
     *
     * @param \DateTime $creationDate
     *
     * @return LogTerms
     */
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * Get creationDate
     *
     * @return \DateTime
     */
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * Set isEnabled
     *
     * @param integer $isEnabled
     *
     * @return LogTerms
     */
    public function setIsEnabled($isEnabled)
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    /**
     * Get isEnabled
     *
     * @return integer
     */
    public function getIsEnabled()
    {
        return $this->isEnabled;
    }

    /**
     * Set ip
     *
     * @param string $ip
     *
     * @return LogTerms
     */
    public function setIp($ip)
    {
        $this->ip = $ip;

        return $this;
    }

    /**
     * Get ip
     *
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * Set user
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\User $user
     *
     * @return LogTerms
     */
    public function setUser(\ArgoMCMBuilder\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
}
