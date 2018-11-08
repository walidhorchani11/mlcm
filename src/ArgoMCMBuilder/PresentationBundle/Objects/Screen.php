<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

/**
 * Class Screen.
 */
class Screen
{
    private $id;
    private $description;
    private $chapter;
    private $ref;
    private $theme;
    private $doc;

    /**
     * Screen constructor.
     *
     * @param int         $id
     * @param string      $description
     * @param string      $chapter
     * @param string      $ref
     * @param string|null $theme
     * @param string|null $doc
     */
    public function __construct($id, $description, $chapter, $ref, $theme = null, $doc = null)
    {
        $this->id = $id;
        $this->description = $description;
        $this->chapter = $chapter;
        $this->ref = $ref;

        if (null != $theme) {
            $this->theme = $theme;
        }

        if (null !== $doc) {
            $this->doc = $doc;
        }

        return $this;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getChapter()
    {
        return $this->chapter;
    }

    /**
     * @param string $chapter
     */
    public function setChapter($chapter)
    {
        $this->chapter = $chapter;
    }

    /**
     * @return string
     */
    public function getRef()
    {
        return $this->ref;
    }

    /**
     * @param string $ref
     */
    public function setRef($ref)
    {
        $this->ref = $ref;
    }

    /**
     * @return string
     */
    public function getTheme()
    {
        return $this->theme;
    }

    /**
     * @param string $theme
     */
    public function setTheme($theme)
    {
        $this->theme = $theme;
    }

    /**
     * @return string
     */
    public function getDoc()
    {
        return $this->doc;
    }

    /**
     * @param string $doc
     */
    public function setDoc($doc)
    {
        $this->doc = $doc;
    }
}
