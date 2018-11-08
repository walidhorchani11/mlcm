<?php

/**
 * Created by PhpStorm.
 * User: argo
 * Date: 08/09/16
 * Time: 02:17 م.
 */

namespace ArgoMCMBuilder\UserBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class TerritoryRepository extends EntityRepository
{
    public function findAll()
    {
        return $this->findBy(array(), array('name' => 'ASC'));
    }

    public function getListAvailableTerritories($projectId)
    {
        $subQueryBuilder = $this->getEntityManager()->createQueryBuilder();
        $subQuery = $subQueryBuilder
            ->select(['ts.id'])
            ->from('UserBundle:Territory', 'ts')
            ->innerJoin('ts.projects', 'pr')
            ->where('pr.id = :projectId')
            ->setParameter('projectId', $projectId)
            ->orderBy('ts.name', 'ASC')
            ->getQuery()
            ->getArrayResult();

        $queryBuilder = $this->getEntityManager()->createQueryBuilder();
        $query = $queryBuilder
            ->select(['t'])
            ->from('UserBundle:Territory', 't')
            ->where($queryBuilder->expr()->notIn('t.id', ':subQuery'))
            ->setParameter('subQuery', $subQuery);

        return $query;
    }

    public function getListAvailableTerritoriesByPres($presId)
    {
        $subQueryBuilder = $this->getEntityManager()->createQueryBuilder();
        $subQuery = $subQueryBuilder
            ->select(['ts.id'])
            ->from('PresentationBundle:Presentation', 'pres')
            ->innerJoin('pres.territory', 'ts')
            ->where('pres.id = :presId')
            ->setParameter('presId', $presId)
            ->getQuery()
            ->getArrayResult();
        $queryBuilder = $this->getEntityManager()->createQueryBuilder();
        $query = $queryBuilder
            ->select(['t'])
            ->from('UserBundle:Territory', 't')
            ->where($queryBuilder->expr()->notIn('t.id', ':subQuery'))
            ->setParameter('subQuery', $subQuery)
            ->orderBy('t.name', 'ASC')
            ->getQuery()
            ->getResult();

        return $query;
    }
}
