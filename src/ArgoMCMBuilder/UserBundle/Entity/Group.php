<?php

namespace ArgoMCMBuilder\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\Group as BaseGroup;

/**
 * Groups.
 *
 * @ORM\Entity
 * @ORM\Table(name="mcm_group")
 */
class Group extends BaseGroup
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
     * @ORM\OneToMany(targetEntity="Group", mappedBy="parent")
     */
    protected $child;

    /**
     * @ORM\ManyToOne(targetEntity="Group", inversedBy="child")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $parent;

    /**
     * Add child.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Group $child
     *
     * @return Group
     */
    public function addChild(\ArgoMCMBuilder\UserBundle\Entity\Group $child)
    {
        $this->child[] = $child;

        return $this;
    }

    /**
     * Remove child.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Group $child
     */
    public function removeChild(\ArgoMCMBuilder\UserBundle\Entity\Group $child)
    {
        $this->child->removeElement($child);
    }

    /**
     * Get child.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getChild()
    {
        return $this->child;
    }

    /**
     * Set parent.
     *
     * @param \ArgoMCMBuilder\UserBundle\Entity\Group $parent
     *
     * @return Group
     */
    public function setParent(\ArgoMCMBuilder\UserBundle\Entity\Group $parent = null)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent.
     *
     * @return \ArgoMCMBuilder\UserBundle\Entity\Group
     */
    public function getParent()
    {
        return $this->parent;
    }
}
