<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

class SlideJs
{
    private $chapter;
    private $section;

    /**
     * SlideJs constructor.
     *
     * @param $chapter
     * @param $section
     */
    public function __construct($chapter, $section)
    {
        $this->chapter = $chapter;
        $this->section = $section;
    }

    /**
     * @return mixed
     */
    public function getChapter()
    {
        return $this->chapter;
    }

    /**
     * @param mixed $chapter
     */
    public function setChapter($chapter)
    {
        $this->chapter = $chapter;
    }

    /**
     * @return mixed
     */
    public function getSection()
    {
        return $this->section;
    }

    /**
     * @param mixed $section
     */
    public function setSection($section)
    {
        $this->section = $section;
    }
}
