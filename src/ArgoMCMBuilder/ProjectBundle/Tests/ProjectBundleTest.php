<?php

namespace ArgoMCMBuilder\ProjectBundle\Tests;

use ArgoMCMBuilder\ProjectBundle\Controller\ProjectController;

class ProjectBundleTest extends \PHPUnit_Framework_TestCase
{
    public function testFullProjectTestAction()
    {
        $result = static::createResult();
        // TODO-BAC-Test: Implement __call() method.
        //echo "\n";
        echo '================== Begin Project Bundle Full unit test ==================';

        //$request = new Request();
        //$request->setMethod('GET');

        $x = new ProjectController();
        $x->indexAction();

        //$x->getOldData(60);

        //print_r($x);

        echo "\n----->  Start indexAction \n";
        echo "\n----->  Start settingsAction \n";
        echo "\n----->  Start createNewProjectAction \n";
        echo "\n----->  Start projectDetailsAction \n";
        echo "\n----->  Start getOldData \n";
        echo "\n----->  Start EditProjectAction \n";
        echo "\n----->  Start archiveProjectAction \n";
        echo "\n----->  Start activeProjectAction \n";
        echo "\n----->  Start disconnectPresentationAction \n";
        echo "\n----->  Start approvedPresentationAction \n";
        echo "\n----->  Start deletePresentationAction \n";
        echo "\n----->  Start addLocalisationAction \n";
        echo "\n----->  Start exportAction \n";

        echo "\n================== END Project Bundle Full unit test ==================\n";
    }
}
