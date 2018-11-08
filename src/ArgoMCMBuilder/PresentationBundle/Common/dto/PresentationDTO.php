<?php

namespace ArgoMCMBuilder\PresentationBundle\Common\dto;

class PresentationDTO
{
    /**
     * @var int
     */
    public $id;

    /**
     * @var string
     */
    public $name;

    /**
     * @var string
     */
    public $type;

    /**
     * @var string
     */
    public $status;
    /**
     * @var string
     */
    public $version;

    /**
     * @var string
     */
    public $language;

    /**
     * @var string
     */
    public $progress;

    /**
     * @var int
     */
    public $lock;

    /**
     * @var int
     */
    public $isDisconnect;

    /**
     * @var Date
     */
    public $lastUpdate;

    /*
     * @var string
     */
    public $thumbnailPath;

    /**
     * @var string
     */
    public $productsList;

    /**
     * @var array
     */
    public $revisionList;

    /**
     * @var string
     */
    public $owner;

    /**
     * @var string
     */
    public $project;
    /**
     * @var string
     */
    public $territory;

    /**
     * @return the int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param $id
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return the string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param $name
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return the string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param $type
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return the string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param $status
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return the string
     */
    public function getVersion()
    {
        return $this->status;
    }

    /**
     * @param $status
     */
    public function setVersion($version)
    {
        $this->version = $version;

        return $this;
    }

    /**
     * @return the string
     */
    public function getLanguage()
    {
        return $this->language;
    }

    /**
     * @param $language
     */
    public function setLanguage($language)
    {
        $this->language = $language;

        return $this;
    }

    /**
     * @return the string
     */
    public function getProgress()
    {
        return $this->progress;
    }

    /**
     * @param $progress
     */
    public function setProgress($progress)
    {
        $this->progress = $progress;

        return $this;
    }

    /**
     * @return the integer
     */
    public function getLock()
    {
        return $this->lock;
    }

    /**
     * @param $lock
     */
    public function setLock($lock)
    {
        $this->lock = $lock;

        return $this;
    }

    /**
     * @return the integer
     */
    public function getIsDisconnect()
    {
        return $this->isDisconnect;
    }

    /**
     * @param $isDisconnect
     */
    public function setIsDisconnect($isDisconnect)
    {
        $this->isDisconnect = $isDisconnect;

        return $this;
    }

    /**
     * @return the Date
     */
    public function getLastUpdate()
    {
        return $this->lastUpdate;
    }

    /**
     * @param $status
     */
    public function setLastUpdate($lastupdate)
    {
        $this->lastUpdate = $lastupdate;

        return $this;
    }

    /**
     * @return the string
     */
    public function getProductList()
    {
        return $this->productsList;
    }

    /**
     * @param $productList
     */
    public function setProductList($productList)
    {
        $this->productsList = $productList;

        return $this;
    }

    /**
     * @return the string
     */
    public function getThumbnailPath()
    {
        return $this->thumbnailPath;
    }

    /**
     * @param $thumbnailPath
     */
    public function setThumbnailPath($thumbnailPath)
    {
        $this->thumbnailPath = $thumbnailPath;

        return $this;
    }

    /**
     * @return the Array
     */
    public function getRevisionList()
    {
        return $this->revisionList;
    }

    /**
     * @param $revisionList
     */
    public function setRevisionList($revisionList)
    {
        $this->revisionList = $revisionList;

        return $this;
    }

    /**
     * @return the string
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * @param $owner
     */
    public function setOwner($owner)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * @return the string
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * @param $project
     */
    public function setProject($project)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return the string
     */
    public function getTerritory()
    {
        return $this->territory;
    }

    /**
     * @param $territory
     */
    public function setTerritory($territory)
    {
        $this->territory = $territory;

        return $this;
    }
}
