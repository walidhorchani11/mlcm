<?php

namespace ArgoMCMBuilder\UserBundle\Exception;

use Symfony\Component\Security\Core\Exception\AccountStatusException;

/**
 * Class SessionException.
 */
class SessionException extends AccountStatusException
{
    /**
     * {@inheritdoc}
     */
    public function getMessageKey()
    {
        return 'User already connected !';
    }
}
