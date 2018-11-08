<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace  ArgoMCMBuilder\UserBundle\Handler;

use ArgoMCMBuilder\UserBundle\Entity\User;
use ArgoMCMBuilder\UserBundle\Exception\SessionException;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Security\Core\Exception\CredentialsExpiredException;
use Symfony\Component\Security\Core\Exception\LockedException;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\Exception\AccountExpiredException;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * UserChecker checks the user account flags.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class UserChecker implements UserCheckerInterface
{
    /**
     * @var Container
     */
    private $container;

    /**
     * UserChecker constructor.
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    public function checkPreAuth(UserInterface $user)
    {
        if (!$user instanceof AdvancedUserInterface) {
            return;
        }

        $lockSession = $this->container->getParameter('locksession');
        $isConnected = false;
        if ($lockSession) {
            $session = $this->container->get('session');
            $prefix = $this->container->getParameter('snc_redis.session.prefix');

            $sessionId = $prefix.$session->getId();
            $redis = $this->container->get('snc_redis.session');
            $array = $redis->keys($prefix.'*');

            foreach ($array as $key) {
                try {
                    $sesionUser = str_replace('_sf2_attributes|', '', $redis->get($key));
                    $metaUser = strpos($sesionUser, '_sf2_meta|');
                    $metaUser = substr($sesionUser, $metaUser);

                    $metaUser = unserialize(str_replace('_sf2_meta|', '', $metaUser));
                    $sesionUser = unserialize($sesionUser);
                    if (!empty($sesionUser) and $key !== $sessionId) {
                        if (array_key_exists('_security_main', $sesionUser)) {
                            $userSession = unserialize($sesionUser['_security_main'])->getUser();
                            if ($user->getId() == $userSession->getId() and (time() < ($metaUser['u'] + 180))) {
                                $isConnected = true;
                            }
                        }
                    }
                } catch (\Exception $e) {
                }
            }
            if ($isConnected) {
                $session->clear();
                $ex = new SessionException('User connected');
                $ex->setUser($user);
                throw $ex;
            }
        }

        if (!$user->isAccountNonLocked()) {
            $ex = new LockedException('User account is locked.');
            $ex->setUser($user);
            throw $ex;
        }

        if (!$user->isEnabled()) {
            $ex = new DisabledException('User account is disabled.');
            $ex->setUser($user);
            throw $ex;
        }

        if (!$user->isAccountNonExpired()) {
            $ex = new AccountExpiredException('User account has expired.');
            $ex->setUser($user);
            throw $ex;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function checkPostAuth(UserInterface $user)
    {
        if (!$user instanceof AdvancedUserInterface) {
            return;
        }

        if (!$user->isCredentialsNonExpired()) {
            $ex = new CredentialsExpiredException('User credentials have expired.');
            $ex->setUser($user);
            throw $ex;
        }
    }
}
