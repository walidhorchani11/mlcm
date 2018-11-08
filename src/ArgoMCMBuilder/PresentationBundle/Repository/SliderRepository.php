<?php

namespace ArgoMCMBuilder\PresentationBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;

/**
 * Class SliderRepository
 * @package ArgoMCMBuilder\PresentationBundle\Repository
 */
class SliderRepository extends EntityRepository
{
    /**
     * Get thumbName to slides by revision.
     *
     * @param int $idRevision
     *
     * @return mixed
     */
    public function getThumbNameByRevision($idRevision)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('s.indice, s.dataId')
            ->where('s.revision = :idRevision')
            ->setParameter('idRevision', $idRevision);

        return $qb->getQuery()->getResult();
    }

    /**
     * Get all slides by revision.
     *
     * @param int $idRevision
     *
     * @return mixed
     */
    public function getSliderByRevision($idRevision)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('s')
            ->join('s.revision', 'revision')
            ->where('revision.id = :idRevision')
            ->setParameter('idRevision', $idRevision);

        return $qb->getQuery()->getResult();
    }

    /**
     * Get all slides  page ids by revision.
     *
     * @param int $idRevision
     *
     * @return mixed
     */
    public function getPageIdsByRevision($idRevision)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('s.assetDescription')
            ->join('s.revision', 'revision')
            ->where('revision.id = :idRevision')
            ->andWhere('s.assetDescription IS NOT NULL')
            ->setParameter('idRevision', $idRevision);

        return array_map('current', $qb->getQuery()->getResult());
    }

    /**
     * Get number of slides by revision.
     *
     * @param int $idRevision
     *
     * @return mixed
     */
    public function getNumberSlidersByRevision($idRevision)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('count(s)')
            ->join('s.revision', 'revision')
            ->where($qb->expr()->eq('s.revision', ':idRevision'))
            ->setParameter('idRevision', $idRevision);

        return $qb->getQuery()->getSingleResult();
    }

    /**
     * @param string $content
     * @param int    $idRev
     *
     * @return mixed
     */
    public function getSliderByContent($content, $idRev)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('s')
            ->join('s.revision', 'revision')
            ->where($qb->expr()->eq('s.revision', ':idRev'))
            ->andWhere($qb->expr()->eq('s.content', ':content'))
            ->setParameter('idRev', $idRev)
            ->setParameter('content', $content);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @param string $dataId
     * @param int    $idRev
     *
     * @return mixed
     */
    public function getSliderByDataId($dataId, $idRev)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('s')
            ->join('s.revision', 'revision')
            ->where($qb->expr()->eq('s.revision', ':idRev'))
            ->andWhere($qb->expr()->eq('s.dataId', ':dataId'))
            ->setParameter('idRev', $idRev)
            ->setParameter('dataId', $dataId);

        return $qb->getQuery()->getResult();
    }

    public function getNumberOfChildren($idSlider)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('count(s.id)')
            ->join('s.parent', 'parent')
            ->where('parent.id = :id')
            ->setParameter('id', $idSlider);

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getParentSliders($idRev)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->select('s')
            ->join('s.revision', 'rev')
            ->where('rev.id = :idRev')
            ->andWhere('s.parent is NULL')
            ->setParameters(
                array(
                    'idRev' => $idRev,
                )
            );

        return $qb->getQuery()->getResult();
    }
}
