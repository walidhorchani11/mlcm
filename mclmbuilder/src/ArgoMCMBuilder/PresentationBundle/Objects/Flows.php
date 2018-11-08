<?php
/**
 * Created by PhpStorm.
 * User: argo
 * Date: 27.10.16
 * Time: 11:43.
 */

namespace ArgoMCMBuilder\PresentationBundle\Objects;

/**
 * Class Flows.
 */
class Flows
{
    private $flow1;

    /**
     * FlowContainer constructor.
     */
    public function __construct()
    {
        $this->flow1 = array();

        return $this;
    }

    /**
     * @return array
     */
    public function getAtt()
    {
        return $this->flow1;
    }

    /**
     * @param array $flow1
     */
    public function setAtt($flow1)
    {
        $this->flow1 = $flow1;
    }

    /**
     * @param object $screens
     */
    public function push($screens)
    {
        $this->flow1[] = $screens;
    }
}
