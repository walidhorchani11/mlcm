<?php

namespace ArgoMCMBuilder\PresentationBundle\Entity;

use ArgoMCMBuilder\UserBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * Component.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_reference")
 */
class Reference
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
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="code_reference", type="string", length=255, nullable=true)
     */
    private $code;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\User", inversedBy="references")
     * @ORM\JoinColumn(nullable=true)
     */
    private $user;

    /**
     * @var Presentation
     *
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", inversedBy="references")
     * @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     */
    private $presentation;

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
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @param string $code
     */
    public function setCode(string $code)
    {
        $this->code = $code;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
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
     * clearId
     */
    public function clearId()
    {
        $this->id = null;
    }
}
