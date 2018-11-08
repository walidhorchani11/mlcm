<?php

/**
 * Created by PhpStorm.
 * User: argo
 * Date: 08/09/16
 * Time: 02:17 م.
 */

namespace ArgoMCMBuilder\BackOfficeBundle\Entity\Repository;

use ArgoMCMBuilder\BackOfficeBundle\Entity\Product;
use Doctrine\ORM\EntityRepository;

class ProductRepository extends EntityRepository
{
    public function getListAvailableProducts($projectId)
    {
        $subQueryBuilder = $this->getEntityManager()->createQueryBuilder();
        $subQuery = $subQueryBuilder
            ->select(['ps.id'])
            ->from('BackOfficeBundle:Product', 'ps')
            ->innerJoin('ps.projects', 'pr')
            ->where('pr.id = :projectId')
            ->setParameter('projectId', $projectId)
            ->getQuery()
            ->getArrayResult()
        ;

        $queryBuilder = $this->getEntityManager()->createQueryBuilder();
        $query = $queryBuilder
            ->select(['p'])
            ->from('BackOfficeBundle:Product', 'p')
            ->where($queryBuilder->expr()->notIn('p.id', ':subQuery'))
            ->setParameter('subQuery', $subQuery)
        ;

        return $query;
    }

    public function findProductsByCompany($companyId)
    {
        $em = $this->getEntityManager();
        $companyRep = $em->getRepository('UserBundle:Company');
        $listCompId = $companyRep->getAllChildrenRecursive($companyId);
        $query = $this->createQueryBuilder('p')
            ->select(['p.id,p.name'])
            ->where('p.company IN (:companyIds)')
            ->setParameter('companyIds', $listCompId);

        return $query->getQuery()->getResult();
    }

    public function getListAvailableProduct($companyId)
    {
        $companyRep = $this->getEntityManager()->getRepository('UserBundle:Company');
        $listCompId = $companyRep->getAllChildrenRecursive($companyId);
        $subQueryBuilder = $this->getEntityManager()->createQueryBuilder();
        $subQuery = $subQueryBuilder
            ->select(['p'])
            ->from('BackOfficeBundle:Product', 'p')
            ->where('p.company IN (:companyIds)');
        $subQueryBuilder->setParameter('companyIds', $listCompId);

        return $subQuery;
    }
}
