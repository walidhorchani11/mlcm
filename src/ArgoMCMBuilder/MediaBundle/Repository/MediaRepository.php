<?php

namespace ArgoMCMBuilder\MediaBundle\Repository;

use ArgoMCMBuilder\UserBundle\Entity\User;
use Doctrine\ORM\EntityRepository;

/**
 * FileRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class MediaRepository extends EntityRepository
{
    /**
     * @param string $type
     *
     * @return array
     */
    public function findBytype($type)
    {
        $qb = $this->createQueryBuilder('m');
        $qb->where("m.contentType LIKE '".$type."'");

        return $qb->getQuery()->getResult();
    }

    /**
     * @param User $user
     * @param int  $c
     * @param null $type
     * @param null $product
     *
     * @return array
     */
    public function getMediaByCompany($user, $c, $type = null, $product = null)
    {
        //, p.url,p.label_media,p.height,p.width,p.size,p.inline,p.thumb_url,p.content_type,p.master,p.shared,p.title,p.presentation_id,p.created,p.updated
        $qb = $this->createQueryBuilder('p');
        $qb->select('p')
            // ->join('p.presentation', 'presentation')
            //  ->join('presentation.project', 'project')
            //->join('project.company', 'company')
            //->where('p.Company = :idCompany')
            ->andWhere('p.owner = :owner')
            ->orWhere('p.flag = :flag')
            ->andWhere('p.Company = :idCompany')
            ->setParameters(
                array(
                    'idCompany' => $c,
                    'owner' => $user->getId(),
                    'flag' => 20,
                )
            );
        if ($type != null) {
            if ($type == 'me') {
                $qb
                    ->andWhere('p.flag = :flag')
                    ->setParameter('flag', 10);
            } else {
                $qb
                    ->andWhere('p.contentType LIKE :type')
                    ->setParameter('type', $type);
            }
        }
        if ($product != null) {
            //$qb
            //->join('', 'presentation')
            //->setParameter('type', $type);
        }
        $preparedQuery = $qb->getQuery();

        return $preparedQuery->getResult();
    }

    /**
     * @param string $label
     * @param User   $user
     * @param string $c
     *
     * @return array
     */
    public function findMediaBylabel($label, $user, $c)
    {
        $qb = $this->createQueryBuilder('p');
        $qb->select('p')
            ->andWhere('p.owner = :owner')
            ->orWhere('p.flag = :flag')
            ->andWhere('p.Company = :idCompany')
            ->andWhere('p.labelMedia LIKE :labelmedia or p.title LIKE :labelmedia')
            ->setParameters(
                array(
                    'idCompany' => $c,
                    'owner' => $user->getId(),
                    'flag' => 20,
                    'labelmedia' => '%'.$label.'%',
                )
            );
        $preparedQuery = $qb->getQuery();

        return $preparedQuery->getResult();
    }

    /**
     * @param User   $user
     * @param string $c
     *
     * @return array
     */
    public function getMediaForEdit($user, $c)
    {
        $qb = $this->createQueryBuilder('p');

        $qb->select(
            'p.id,p.url,p.labelMedia,p.height,p.width,p.size,p.inline,p.thumbUrl,p.contentType,p.master,p.shared,
            p.title,p.legend,p.created,p.updated'
        )
            ->andWhere('p.owner = :owner')
            ->orWhere('p.flag = :flag')
            ->andWhere('p.Company = :idCompany')
            ->setParameters(
                array(
                    'idCompany' => $c,
                    'owner' => $user->getId(),
                    'flag' => 20,
                )
            );
        $preparedQuery = $qb->getQuery();

        return $preparedQuery->getResult();
    }

    /**
     * @param User   $user
     * @param string $c
     *
     * @return array
     */
    public function getMediaEditor($user, $c)
    {
        //  $qb = $this->createQueryBuilder('p');
        $qb = $this->getEntityManager()
            ->createQueryBuilder()
            ->select(
                'p.id,p.url,p.labelMedia,p.height,p.width,p.size,p.inline,p.thumbUrl,p.contentType,p.master,p.shared,
                p.title,p.legend,p.flag'
            )
            ->from('ArgoMCMBuilderMediaBundle:Media', 'p')
            //$qb->select('p.id,p.url,p.labelMedia,p.height,p.width,p.size,p.inline,p.thumbUrl,p.contentType,p.master,p.shared,p.title,p.legend,p.flag')
            ->Where('p.owner = :owner')
            ->orWhere('p.flag = :flag')
            ->andWhere('p.Company = :idCompany')
            ->setParameters(
                array(
                    'idCompany' => $c,
                    'owner' => $user->getId(),
                    'flag' => 20,
                )
            );
        $preparedQuery = $qb->getQuery();

        return $preparedQuery->getResult();
    }

    /**
     * @param int    $idPres
     * @param string $mediaType
     *
     * @return array
     */
    public function getMediaByPresentation($idPres, $mediaType)
    {
        $qb = $this->createQueryBuilder('m');
        $qb->select('m.id, m.labelMedia, pres.id as presId')
            ->join('m.presentation', 'pres')
            ->where('m.contentType = :mediaType')
            ->andWhere('pres.id = :idPres')
            ->setParameters(
                array(
                    'mediaType' => $mediaType,
                    'idPres' => $idPres,
                )
            );

        return $qb->getQuery()->getResult();
    }

    /**
     * @param int    $idCompany
     * @param string $mediaType
     *
     * @return array
     */
    public function getMediaByCompanyId($idCompany, $mediaType)
    {
        $qb = $this->createQueryBuilder('m');
        $qb->select('m.id, m.labelMedia,m.thumbUrl as path, comp.id as compId')
            ->join('m.Company', 'comp')
            ->where('m.contentType = :mediaType')
            ->andWhere('comp.id = :idComp')
            ->setParameters(
                array(
                    'mediaType' => $mediaType,
                    'idComp' => $idCompany,
                )
            );

        return $qb->getQuery()->getResult();
    }

//    public function getMediaByPresentation($idPres, $mediaType)
//    {
//        $qb = $this->createQueryBuilder('m');
//        $qb->select('m.id, m.labelMedia, pres.id as presId')
//            ->join('m.presentation', 'pres')
//            ->where('m.contentType = :mediaType')
//            ->andWhere('pres.id = :idPres')
//            ->setParameters(
//                array(
//                    'mediaType' => $mediaType,
//                    'idPres' => $idPres,
//                )
//            );
//        return $qb->getQuery()->getResult();
//    }

//    public function getMediaByCompanyId($idCompany, $mediaType)
//    {
//        $qb = $this->createQueryBuilder('m');
//        $qb->select('m.id, m.labelMedia,m.thumbUrl as path, comp.id as compId')
//            ->join('m.Company', 'comp')
//            ->where('m.contentType = :mediaType')
//            ->andWhere('comp.id = :idComp')
//            ->setParameters(
//                array(
//                    'mediaType' => $mediaType,
//                    'idComp' => $idCompany,
//                )
//            );
//        return $qb->getQuery()->getResult();
//    }
}
