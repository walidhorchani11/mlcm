<?php

namespace ArgoMCMBuilder\UserBundle\Common\dto;

class DeleteUserDTO
{
    /**
     * @var int
     */
    public $userId;

    /**
     * @var array
     */
    public $users;

    /**
     * @var array
     */
    public $presentations;

    /**
     * @var array
     */
    public $datatables;

    /**
     * Constructor.
     */
    public function __construct()
    {
    }

    /**
     * @return the int
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param $user_id
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * @return the array
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param $name
     */
    public function setUsers($users)
    {
        $this->users = $users;

        return $this;
    }

    /**
     * @return the array
     */
    public function getPresentations()
    {
        return $this->presentations;
    }

    /**
     * @param $name
     */
    public function setPresentations($presentations)
    {
        $this->presentations = $presentations;

        return $this;
    }

    /**
     * @return the array
     */
    public function getDatatables()
    {
        return $this->datatables;
    }

    /**
     * @param $name
     */
    public function setDatatables($datatables)
    {
        $this->datatables = $datatables;

        return $this;
    }
}
