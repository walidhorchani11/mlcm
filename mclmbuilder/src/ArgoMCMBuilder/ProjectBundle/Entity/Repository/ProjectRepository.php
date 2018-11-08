<?php

namespace ArgoMCMBuilder\ProjectBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class ProjectRepository extends EntityRepository
{
    public function getListAvailableProjects($companyId, $user = null)
    {
        $companyRep = $this->getEntityManager()->getRepository('UserBundle:Company');
        $listCompId = $companyRep->findCompanyAndChildForList($companyId);
        $subQuery = $this->createQueryBuilder('pr')
            ->select('pr')
            ->innerJoin('pr.company', 'cp')
            ->where('pr.status = :status')
            ->setParameter('status', '20');
        if (in_array('ROLE_ADMIN', $user->getRoles()) || in_array('ROLE_MANAGER', $user->getRoles())) {
            $subQuery->andWhere('cp.id in (:companyIds)')
                ->setParameter('companyIds', $listCompId);
        }

        return $subQuery;
    }

    /**
     * get Projects by status (archive or active).
     *
     * @param array $data
     * @param int   $page
     * @param null  $max
     * @param bool  $getResult
     *
     * @return array
     */
    public function getProjectsByStatus($data, $page = 0, $max = null, $getResult = true)
    {
        $em = $this->getEntityManager();
        $companyRep = $em->getRepository('UserBundle:Company');
        $listCompId = $companyRep->findCompanyAndChildForList($data['idCompany']);
        $qb = $this->createQueryBuilder('p');
        $qb->select(array('p.id as idProject, p.name, p.startDate, p.endDate, owner.id as idOwner'))
            ->join('p.owner', 'owner')
            ->join('p.company', 'company')
            ->addSelect(
                array('owner.firstname as ownerFirstName, owner.lastname as ownerLastName, owner.id as ownerId')
            )
            ->addSelect('company.name as companyName, company.id as idCompany');
        if (in_array('ROLE_SUPER_ADMIN', $data['userRole'])) {
            $qb->where('p.status = :status')
                ->setParameter('status', $data['status']);
        } elseif (in_array('ROLE_MANAGER', $data['userRole']) || in_array('ROLE_ADMIN', $data['userRole'])) {
            $qb->leftJoin('p.presentations', 'prez')
                ->leftJoin('prez.owner', 'oc')
                ->leftJoin('prez.company', 'companyPrez')
                ->where(
                    $qb->expr()->andX(
                        $qb->expr()->eq('p.status', ':status')
                    )
                )
                ->andWhere('company.id in (:idsCompany) or oc.id = :user or companyPrez.id in (:idsCompany)')
                ->setParameters(
                    array(
                        'idsCompany' => $listCompId,
                        'status' => $data['status'],
                        'user' => $data['idOwner'],
                    )
                )
                ->distinct('p.id');
        } else {
            $qb->leftJoin('p.presentations', 'c')
                ->leftJoin('c.editors', 'e')
                ->leftJoin('c.viewers', 'v')
                ->leftJoin('c.owner', 'oc')
                ->where('p.status = :status')
                ->andWhere('e.id = :user or v.id = :user  or owner.id = :user or oc.id = :user')
                ->setParameters(array('status' => $data['status'], 'user' => $data['idOwner']))
                ->distinct('p.id');
        }

        $owner = isset($data['owner']) && $data['owner'] ? $data['owner'] : null;
        if ($owner) {
            $qb
                ->andWhere(
                    $qb->expr()->orX(
                        $qb->expr()->like('owner.firstname', ':owner'),
                        $qb->expr()->like('owner.lastname', ':owner')
                    )
                )
                ->setParameter('owner', '%'.$owner.'%')
                ->setParameter('owner', '%'.$owner.'%');
        }

        $company = isset($data['company']) && $data['company'] ? $data['company'] : null;
        if ($company) {
            $companyRep = $this->getEntityManager()->getRepository('UserBundle:Company');
            $companyId = $companyRep->findOneByName($company);
            $listCompId = $companyRep->getAllChildrenRecursive($companyId->getId());
            $qb
                ->andWhere('company.id in (:companies)')
                ->setParameter('companies', $listCompId);
        }

        $startDate = isset($data['startDate']) && $data['startDate'] ? $data['startDate'] : null;
        if ($startDate) {
            $qb
                ->andWhere($qb->expr()->like('p.startDate', ':startDate'))
                ->setParameter('startDate', '%'.$startDate.'%');
        }

        $order = isset($data['order']) && $data['order'] ? $data['order'] : null;

        if ($order) {
            $orderColumn = $order['column'];
            $orderDirection = $order['dir'];
            switch ($orderColumn) {
                case 0:
                    $qb->orderBy('p.name', $orderDirection);
                    break;
                case 1:
                    $qb->orderBy('company.name', $orderDirection);
                    break;
                case 2:
                    $qb->orderBy('owner.firstname', $orderDirection);
                    break;
                case 3:
                    $qb->orderBy('p.startDate', $orderDirection);
                    break;
            }
        } else {
            $qb->orderBy('p.id', 'DESC');
        }
        if ($max) {
            $preparedQuery = $qb->getQuery()
                ->setMaxResults($max)
                ->setFirstResult($page * $max);
        } else {
            $preparedQuery = $qb->getQuery();
        }

        return $getResult ? $preparedQuery->getResult() : $preparedQuery;
    }

    public function findProjectById($idProject)
    {
        $subQuery = $this->createQueryBuilder('p')
            ->select('p')
            ->where('p.id = :idProject')
            ->setParameter('idProject', $idProject);

        return $subQuery;
    }

    public function countDuplicatedProject($name)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->select('p.name')
            ->where('p.name LIKE :name')
            ->setParameter('name', $name.'%');

        return $qb->getQuery()->getResult();
    }
}
