<?php

namespace ArgoMCMBuilder\PresentationBundle\DataFixtures\ORM;

use ArgoMCMBuilder\PresentationBundle\Entity\Reference;
use Doctrine\Common\Persistence\ObjectManager;
use ArgoMCMBuilder\UserBundle\Entity\User;

class LoadReferenceData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $user = $manager->getRepository('UserBundle:User')->find(38);

        var_dump($user);

        $reference = new Reference();
        $reference->setTitle('reference 1');
        $reference->setDescription('Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500');
        $reference->setCode('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...');
        $reference->setUser($user);

        $manager->persist($reference);
        $manager->flush();
    }
}
