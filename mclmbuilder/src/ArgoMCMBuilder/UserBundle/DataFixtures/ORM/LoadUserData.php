<?php

namespace ArgoMCMBuilder\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use ArgoMCMBuilder\UserBundle\Entity\User;

class LoadUserData extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $userAdmin = new User();
        $userAdmin->setEmail('lifu@kitae.fr')
                ->setFirstname('Admin')
                ->setLastname('Lifu')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin);
        $manager->flush();
        $this->addReference('admin-user1', $userAdmin);

        $userAdmin2 = new User();
        $userAdmin2->setEmail('nico.smets@merckgroup.com')
                ->setFirstname('Nico')
                ->setLastname('Smets')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin2);
        $manager->flush();
        $this->addReference('admin-user2', $userAdmin2);

        $userAdmin3 = new User();
        $userAdmin3->setEmail('ym@argonautes.com')
                ->setFirstname('Yoann')
                ->setLastname('Morocutti')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin3);
        $manager->flush();
        $this->addReference('admin-user3', $userAdmin3);

        $userAdmin4 = new User();
        $userAdmin4->setEmail('tb@argonautes.com')
                ->setFirstname('Thomas')
                ->setLastname('Bianchi')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin4);
        $manager->flush();
        $this->addReference('admin-user4', $userAdmin4);

        $userAdmin5 = new User();
        $userAdmin5->setEmail('yq@argonautes.com')
                ->setFirstname('Yohan')
                ->setLastname('Quetand')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin5);
        $manager->flush();
        $this->addReference('admin-user5', $userAdmin5);

        $userAdmin6 = new User();
        $userAdmin6->setEmail('argolife@lifu.com')
                ->setFirstname('Argolife')
                ->setLastname('Argolife')
                ->setPassword('ilovelifu')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin6);
        $manager->flush();
        $this->addReference('admin-user6', $userAdmin6);

        $userAdmin7 = new User();
        $userAdmin7->setEmail('ymorocutti@argonautes.com')
                ->setFirstname('Presenter')
                ->setLastname('Lifu')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin7);
        $manager->flush();
        $this->addReference('admin-user7', $userAdmin7);

        $userAdmin8 = new User();
        $userAdmin8->setEmail('yoann.morocutti@argonautes.com')
                ->setFirstname('Reviewer')
                ->setLastname('Lifu')
                ->setPassword('0000')
                ->addRole('ROLE_ADMIN');
        $manager->persist($userAdmin8);
        $manager->flush();
        $this->addReference('admin-user8', $userAdmin8);
    }

    public function getOrder()
    {
        // the order in which fixtures will be loaded
        // the lower the number, the sooner that this fixture is loaded
        return 1;
    }
}
