<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class VeevaRepository extends EntityRepository
{
    /**
     * @param $idPres
     * @param $typeVeeva
     * @return array
     */
    public function getExistBinder($idPres, $typeVeeva)
    {
        $qb = $this->createQueryBuilder('binder');
        $qb->select('binder')
            ->where('binder.presentation = :idPres')
            ->andWhere('binder.type = :typeVeeva')
            ->setParameters(['idPres' => $idPres, 'typeVeeva' => $typeVeeva])
            ->orderBy('binder.id', 'DESC')
            ->setMaxResults(1);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param $idPres
     * @param $typeVeeva
     * @param $idCompanyVault
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getExistBinderByCompany($idPres, $typeVeeva, $idCompanyVault)
    {
        $qb = $this->createQueryBuilder('bn');
        $qb->select('bn')
            ->where('bn.presentation = :idPres')
            ->andWhere('bn.type = :typeVeeva')
            ->andWhere('bn.idCompanyVault = :idCompanyVault')
            ->setParameters(['idPres' => $idPres, 'typeVeeva' => $typeVeeva, 'idCompanyVault' => $idCompanyVault])
            ->setMaxResults(1);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @param $idPres
     * @return array
     */
    public function getExistTypeBinder($idPres)
    {
        $qb = $this->createQueryBuilder('binder');
        $qb->select('distinct binder.type')
            ->where('binder.presentation = :idPres')
            ->setParameters(['idPres' => $idPres]);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param $idPres
     * @param $typeVeeva
     * @return array
     */
    public function getExistBinders($idPres, $typeVeeva, $idCompanyVault)
    {
        $qb = $this->createQueryBuilder('binders');
        $qb->select('binders')
            ->where('binders.presentation = :idPres')
            ->andWhere('binders.type = :typeVeeva')
            ->andWhere('binders.idCompanyVault = :idCompanyVault')
            ->setParameters(['idPres' => $idPres, 'typeVeeva' => $typeVeeva, 'idCompanyVault' => $idCompanyVault])
            ->orderBy('binders.id', 'DESC')
            ->setMaxResults(5);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param $idBinder
     * @return array
     */
    public function getBinder($idBinder)
    {
        $qb = $this->createQueryBuilder('binder');
        $qb->select('binder')
            ->where('binder.binderId = :idBinder')
            ->setParameters(['idBinder' => $idBinder]);

        return $qb->getQuery()->getOneOrNullResult();
    }
}
