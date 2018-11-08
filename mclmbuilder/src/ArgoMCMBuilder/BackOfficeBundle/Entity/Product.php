<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Product.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_product")
 * @ORM\Entity(repositoryClass="ArgoMCMBuilder\BackOfficeBundle\Entity\Repository\ProductRepository")
 */
class Product
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
     * @var string
     *
     * @ORM\Column(name="country", type="string", length=255)
     */
    protected $country;

    /**
     * @ORM\ManyToMany(targetEntity="ArgoMCMBuilder\PresentationBundle\Entity\Presentation", mappedBy="products",cascade={"persist"})
     * @ORM\JoinColumn(name="presentation_id", referencedColumnName="id" , onDelete="CASCADE" )
     */
    protected $presentations;

    /**
     * @ORM\ManyToOne(targetEntity="ArgoMCMBuilder\UserBundle\Entity\Company", cascade={"persist"})
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id", onDelete="CASCADE")
     **/
    protected $company;
    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=255, nullable=true)
     */
    protected $code;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->presentations = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Product
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
     * Set country.
     *
     * @param string $country
     *
     * @return Product
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
     * Add presentation.
     *
     * @param \ArgoMCMBuilder\PresentationBundle\Entity\Presentation $presentation
     *
     * @return Product
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
     * Set company.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Company $company
     *
     * @return Product
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
     * Set code
     *
     * @param string $code
     *
     * @return Product
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
    }
}
