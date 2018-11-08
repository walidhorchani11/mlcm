<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Newsletter.
 *
 * @ORM\Table(name="mcm_newsletter")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\BackOfficeBundle\Entity\Repository\NewsletterRepository")
 */
class Newsletter
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
     * @ORM\Column(name="subject", type="string", length=255)
     */
    private $subject;

    /**
     * @var string
     *
     * @ORM\Column(name="text_message", type="text")
     */
    private $textMessage;

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
     * Set subject.
     *
     * @param string $subject
     *
     * @return Newsletter
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;

        return $this;
    }

    /**
     * Get subject.
     *
     * @return string
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * Set textMessage.
     *
     * @param string $textMessage
     *
     * @return Newsletter
     */
    public function setTextMessage($textMessage)
    {
        $this->textMessage = $textMessage;

        return $this;
    }

    /**
     * Get textMessage.
     *
     * @return string
     */
    public function getTextMessage()
    {
        return $this->textMessage;
    }
}
