<?php

namespace ArgoMCMBuilder\PresentationBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr;

class PresentationRepository extends EntityRepository
{
    public function findAllByUserCompany($data, $page = 0, $max = null, $getResult = true)
    {
        $em = $this->getEntityManager();
        $companyRep = $em->getRepository('UserBundle:Company');
        $listCompId = $companyRep->findCompanyAndChildForList($data['idCompany']);
        $qb = $this->createQueryBuilder('p');
        $qb->select('p.id, p.name, territory.name as territoryName, agency.name as agencyName, p.type,project.name as
         projectName, revision.version, p.status, p.isActive, p.lock, p.lastUpDate, p.creationDate, company.name as 
         companyName, company.id as companyId, owner.firstname, owner.lastname, owner.id as ownerId, revision.id as revId')
            ->join('p.project', 'project')
            ->leftJoin('p.owner', 'owner')
            ->leftJoin('p.territory', 'territory')
            ->join('p.company', 'company')
            ->leftJoin('p.agency', 'agency')
            ->innerJoin('p.revisions', 'revision')
            ->leftJoin('p.revisions', 'revision2', Expr\Join::WITH, 'revision.id < revision2.id')
            ->leftJoin('p.products', 'product')
            ->join('project.owner', 'op')
            ->leftJoin('p.children', 'child')
            ->andWhere('p.isActive = :isActive')
            ->andWhere('revision2.id IS NULL');
        if (in_array('ROLE_SUPER_ADMIN', $data['userRole'])) {
            $qb->setParameter('isActive', $data['isActive']);
        } elseif (in_array('ROLE_ADMIN', $data['userRole']) || in_array('ROLE_MANAGER', $data['userRole'])) {
            $qb->andWhere('company.id in (:idCompany) or owner.id = :user or child.owner = :user')
                ->setParameters(
                    array(
                        'user' => $data['idUser'],
                        'idCompany' => $listCompId,
                        'isActive' => $data['isActive'],
                    )
                );
        } elseif (in_array('ROLE_BASIC_USER', $data['userRole'])) {
            $qb->leftJoin('p.editors', 'editor')
                ->leftJoin('p.viewers', 'viewer')
                ->leftJoin('child.viewers', 'viewerP')
                ->leftJoin('child.editors', 'editorP')
                ->andWhere('owner.id = :user or editor.id = :user or viewer.id = :user or op.id = :user or child.owner = :user or viewerP.id  = :user or  editorP.id  = :user')
                ->setParameters(
                    array(
                        'user' => $data['idUser'],
                        'isActive' => $data['isActive'],
                    )
                );
        }
        /************************* **********************/
        $presentationName = isset($data['presentationName']) && $data['presentationName'] ?
            $data['presentationName'] : null;
        if ($presentationName) {
            $qb
                ->andWhere('p.name like :presentationName')
                ->setParameter('presentationName', '%'.$presentationName.'%');
        }
        $status = isset($data['status']) && $data['status'] ? $data['status'] : null;
        if ($status) {
            $qb
                ->andWhere('p.status like :status')
                ->setParameter('status', '%'.$status.'%');
        }
        $type = isset($data['type']) && $data['type'] ? $data['type'] : null;
        if ($type) {
            $qb
                ->andWhere('p.type like :type')
                ->setParameter('type', '%'.$type.'%');
        }
        $company = isset($data['company']) && $data['company'] ? $data['company'] : null;
        if ($company) {
            $qb
                ->andWhere('company.name like :companyName')
                ->setParameter('companyName', '%'.$company.'%');
        }
        $agency = isset($data['agency']) && $data['agency'] ? $data['agency'] : null;
        if ($agency) {
            $qb
                ->andWhere('agency.name like :agencyName')
                ->setParameter('agencyName', '%'.$agency.'%');
        }
        $project = isset($data['project']) && $data['project'] ? $data['project'] : null;
        if ($project) {
            $qb
                ->andWhere('project.name like :projectName')
                ->setParameter('projectName', '%'.$project.'%');
        }
        $owner = isset($data['owner']) && $data['owner'] ? $data['owner'] : null;
        if ($owner) {
            $owner = explode(' ', $owner);
            $qb
                ->andWhere('owner.firstname like :ownerName')
                ->setParameter('ownerName', '%'.$owner[0].'%');
        }
        $territory = isset($data['territory']) && $data['territory'] ? $data['territory'] : null;
        if ($territory) {
            $qb
                ->andWhere('territory.name like :territoryName')
                ->setParameter('territoryName', '%'.$territory.'%');
        }
        $product = isset($data['product']) && $data['product'] ? $data['product'] : null;
        if ($product) {
            $qb
                ->andWhere('product.name like :product')
                ->setParameter('product', '%'.$product.'%');
        }
        $order = isset($data['order']) && $data['order'] ? $data['order'] : null;
        if ($order) {
            switch ($order['column']) {
                case 0:
                    $qb->orderBy('p.name', $order['dir']);
                    break;
                case 1:
                    $qb->orderBy('project.name', $order['dir']);
                    break;
                case 3:
                    $qb->orderBy('territory.name', $order['dir']);
                    break;
                case 4:
                    $qb->orderBy('p.status', $order['dir']);
                    break;
                case 5:
                    $qb->orderBy('p.version', $order['dir']);
                    break;
                case 6:
                    $qb->orderBy('owner.firstname', $order['dir']);
                    break;
                case 7:
                    $qb->orderBy('p.creationDate', $order['dir']);
                    break;
            }
        } else {
            $qb->orderBy('p.id', 'DESC');
        }
        $qb->distinct("p.id");
        if ($max) {
            $preparedQuery = $qb->getQuery()
                ->setMaxResults($max)
                ->setFirstResult($page * $max);
        } else {
            $preparedQuery = $qb->getQuery();
        }

        return $getResult ? $preparedQuery->getResult() : $preparedQuery;
    }

    public function getSoftwares($data)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->select('distinct p.system, distinct p.type')
            ->join('p.project', 'projet')
            ->join('projet.owner', 'owner')
            ->join('projet.company', 'company')
            ->where('owner.id = :idOwner')
            ->andWhere('company.id = :idCompany')
            ->andWhere('p.isActive = :isActive')
            ->setParameters(
                array(
                    'idOwner' => $data['idUser'],
                    'idCompany' => $data['idCompany'],
                    'isActive' => $data['isActive'],
                )
            )
            ->getQuery()
            ->getResult();
    }

    public function getProductsByPresentation($idPres)
    {
        $qb = $this->createQueryBuilder('pres');
        $qb->select('prod.id')
            ->join('pres.products', 'prod')
            ->where('pres.id = :idPres')
            ->setParameter('idPres', $idPres);

        return $qb->getQuery()->getResult();
    }

    public function getEditorsByPresentation($idPres)
    {
        $qb = $this->createQueryBuilder('pres');
        $qb->select('editor.id')
            ->join('pres.editors', 'editor')
            ->where('pres.id = :idPres')
            ->setParameter('idPres', $idPres);

        return $qb->getQuery()->getResult();
    }

    public function getViewersByPresentation($idPres)
    {
        $qb = $this->createQueryBuilder('pres');
        $qb->select('viewer.id')
            ->join('pres.viewers', 'viewer')
            ->where('pres.id = :idPres')
            ->setParameter('idPres', $idPres);

        return $qb->getQuery()->getResult();
    }

    public function getPresentationsByType($idProject, $type, $user = null)
    {
        $em = $this->getEntityManager();
        $companyRep = $em->getRepository('UserBundle:Company');
        $listCompId = $companyRep->findCompanyAndChildForList($user->getCompany()->getId());
        $qb = $this->createQueryBuilder('p');
        $qb->select('p')
            ->join('p.project', 'project')
            ->join('p.owner', 'owner')
            ->join('p.company', 'company')
            ->join('project.owner', 'op')
            ->leftJoin('p.editors', 'editor')
            ->leftJoin('p.viewers', 'viewer')
            ->leftJoin('p.children', 'child')
            ->where('project.id = :projectId')
            ->andWhere('p.type = :type');
        if ($user && in_array('ROLE_BASIC_USER', $user->getRoles())) {
            $qb
                ->leftJoin('child.viewers', 'viewerP')
                ->leftJoin('child.editors', 'editorP')
                ->andWhere('owner.id    = :user or 
                            editor.id   = :user or 
                            viewer.id   = :user or 
                            op          = :user or 
                            child.owner = :user or
                            viewerP.id  = :user or
                            editorP.id  = :user')
                ->setParameters(array(
                    'user' => $user->getId(),
                    'projectId' => $idProject,
                    'type' => $type,
                ));
        } elseif (in_array('ROLE_MANAGER', $user->getRoles()) || in_array('ROLE_ADMIN', $user->getRoles())) {
            $qb->andWhere('company.id in (:idCompany) or owner.id = :user or op = :user or child.owner = :user');
            $qb->setParameters(
                     array(
                        'projectId' => $idProject,
                        'type' => $type,
                        'user' => $user->getId(),
                        'idCompany' => $listCompId,
                     )
                 );
        } else {
            $qb->setParameters(
                array(
                    'projectId' => $idProject,
                    'type' => $type,
                )
            );
        }
        $qb->distinct();

        return $qb->getQuery()->getResult();
    }

    /**
     * fetch master presentation.
     *
     * @param int $idMaster
     *
     * @return array
     */
    public function findMaster($idMaster)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->select('p')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('p.id', ':id'),
                    $qb->expr()->eq('p.type', ':type')
                )
            )
            ->setParameter('id', $idMaster)
            ->setParameter('type', 'Master');

        return $qb->getQuery()->getResult();
    }

    public function getPresForExport($user, $isActive)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->select('p')
            ->join('p.project', 'project')
            ->where('p.isActive = :isActive')
            ->andwhere('project.owner = :idProject')
            ->setParameters(array('isActive' => $isActive, 'idProject' => $user->getId()));

        return $qb->getQuery()->getResult();
    }

    public function countDuplicatedPres($name)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->select('p.name')
            ->where('p.name LIKE :name')
            ->setParameter('name', $name.'%');

        return $qb->getQuery()->getResult();
    }

    /**
     * Retrieve the zip name.
     *
     * @param int $idRev
     *
     * @return array
     */
    public function getZipName($idRev)
    {
        $qb = $this->createQueryBuilder('p');

        $qb->select('p.version, p.name as pres')
            ->addSelect('t.name as country')
            ->addSelect('comp.name as company')
            ->join('p.territory', 't')
            ->join('p.revisions', 'rev')
            ->join('p.company', 'comp')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('rev.id', ':idRev')
                )
            )
            ->setParameter('idRev', $idRev);

        $result = $qb->getQuery()->getResult();
        if (1 == count($result)) {
            foreach ($result[0] as $index => $name) {
                $result[0][$index] = preg_replace('#(\s)#', '', $result[0][$index]); // delete whitespaces
            }

            return $result[0];
        }

        // the result must be one array! otherwise the result is false!
        return null;
    }

  /**
   * @param array $request
   *
   * @return array
   */
  public function ajaxTable($request)
  {
      $qb = $this->createQueryBuilder('p')
      ->select('p.id as id, p.name as name, p.thumbnailPath as thumbnailPath, companys.name as company, projects.name as project, projects.id as projectId, revisions.id as revision, revisions.dataPopin as popin, count(sliders) as slide')
      ->leftJoin('p.project', 'projects')
      ->leftJoin('p.company', 'companys')
      ->leftJoin('p.revisions', 'revisions')
      ->leftJoin('revisions.sliders', 'sliders')
      ->groupBy('p.id');

      $total = $this->createQueryBuilder('p')->select('count(p.id)');

      $FilteredTotal = clone $total;
      if (isset($request['start']) and $request['start'] != null) {
          $qb->setFirstResult((int) $request['start']);
      }

      if (isset($request['length']) and $request['length'] != null) {
          $qb->setMaxResults((int) $request['length']);
      }

      if (isset($request['order'])) {
          foreach ($request['order'] as $order) {
              $qb->addOrderBy('p.'.$request['columns'][$order['column']]['data'], $order['dir']);
          }
      }

      if (isset($request['columns']) and isset($request['search']) and $request['search']['value'] != '') {
          $search = array();
          foreach ($request['columns'] as $column) {
              if ($column['searchable'] == 'true') {
                  $search[] = $qb->expr()->like('p.'.$column['data'], '\'%'.$request['search']['value'].'%\'');
              }
          }
          $qb->andWhere(new Expr\Orx($search));
          $FilteredTotal->andWhere(new Expr\Orx($search));
      }
      $output = array(
      'request' => $request,
      'draw' => $request['draw'],
      'recordsTotal' => $total->getQuery()->getSingleScalarResult(),
      'recordsFiltered' => $FilteredTotal->getQuery()->getSingleScalarResult(),
      'data' => $qb->getQuery()->getResult(),
    );

      return $output;
  }
}
