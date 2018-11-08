<?php

namespace ArgoMCMBuilder\PresentationBundle\Repository;

use Doctrine\ORM\EntityRepository;

class LinkedRefRepository extends EntityRepository
{
    public function clearLinkedRef($ids)
    {
        $this->_em
            ->createQuery('DELETE FROM PresentationBundle:LinkedRef lk WHERE lk.id IN (:id)')
            ->setParameter('id', $ids)
            ->execute();
    }
}
