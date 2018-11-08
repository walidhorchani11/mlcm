<?php

namespace ArgoMCMBuilder\UserBundle\Services;

/**
 * Roles helper displays roles set in config.
 */
class RolesHelper
{
    private $rolesHierarchy;

    public function __construct($rolesHierarchy)
    {
        $this->rolesHierarchy = $rolesHierarchy;
    }

    /**
     * Return roles.
     *
     * @return array
     */
    public function getRoles()
    {
        $roles = array();

        foreach (array_keys($this->rolesHierarchy) as $key) {
            $roles[$key] = $key;
            array_walk_recursive($this->rolesHierarchy[$key], function ($val) use (&$roles) {
                $roles[$val] = $val;
            });
        }

        return array_unique($roles);
    }
}
