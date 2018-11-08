<?php

namespace ArgoMCMBuilder\PresentationBundle\Repository;

/**
 * RevisionRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RevisionRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * @param int $idRev
     *
     * @return mixed
     */
    public function getPresentationVersionAndProjectName(int $idRev)
    {
        $qb = $this->createQueryBuilder('rev');
        $qb->select('pres.version, prj.name')
            ->join('rev.presentation', 'pres')
            ->join('pres.project', 'prj')
            ->where('rev.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @param int $idPres
     *
     * @return mixed
     */
    public function getLastVersionRevisionByPres(int $idPres)
    {
        $query = $this->createQueryBuilder('rev');
        $query->select('MAX(rev.id)');
        $query->where('rev.presentation = :idPres')->setParameter('idPres', $idPres);

        return $query->getQuery()->getSingleScalarResult();
    }

    /**
     * @param int $idPres
     *
     * @return mixed
     */
    public function getLastIdRevisionByPres(int $idPres)
    {
        $lastIDRev = $this->getLastVersionRevisionByPres($idPres);
        $query = $this->createQueryBuilder('rev');
        $query->select('rev');
        $query->where('rev.presentation = :idPres')->setParameter('idPres', $idPres);
        $query->andwhere('rev.id = :version')->setParameter('version', $lastIDRev);

        return $query->getQuery()->getSingleResult();
    }

    /**
     * @param int $idPres
     *
     * @return mixed
     */
    public function getListRevisionByPres(int $idPres)
    {
        $query = $this->createQueryBuilder('rev');
        $query->select('rev.id, rev.version, rev.comment, rev.createdAt, user.firstname, user.lastname, rev.parent');
        $query->join('rev.user', 'user');
        $query->where('rev.presentation = :idPres')->setParameter('idPres', $idPres);

        return $query->getQuery()->getResult();
    }

    /**
     * Get Presentation name and territory name name by revision.
     *
     * @param int $idRev
     *
     * @return array
     */
    public function getPresentationName($idRev)
    {
        $qb = $this->createQueryBuilder('r');
        $qb->select('p.name as presName, t.name as territory')
            ->join('r.presentation', 'p')
            ->join('p.territory', 't')
            ->where('r.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * Get Presentation name and territory name name by revision.
     *
     * @return array
     */
    public function getJson()
    {
        $qb = $this->createQueryBuilder('r');
        $qb->select('r.id')
            ->where("JSON_CONTAINS(r.preSettings, '{\"dataTitleRefContent\": \"Referencesss\"}')=1");

        // ->setParameter('dataTitleRefContent', "dataTitleRefContent");

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * Get Json popins of Revision
     *
     * @return array
     */
    public function getJsonPopins($idRev)
    {
        $qb = $this->createQueryBuilder('r');
        $qb->select('r.popin')
            //->where("JSON_CONTAINS(r.popin, '{\"dataTitleRefContent\": \"Referencesss\"}')=1")
            ->where('r.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getOneOrNullResult();
    }


    /**
     * @param int $idRev
     *
     * @return array
     */
    public function getPdfsByRevision($idRev)
    {
        $qb = $this->createQueryBuilder('rev');
        $qb->select('pdf.id')
            ->join('rev.pdf', 'pdf')
            ->where('rev.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param int $idRev
     *
     * @return array
     */
    public function getVideosByRevision($idRev)
    {
        $qb = $this->createQueryBuilder('rev');
        $qb->select('video.id')
            ->join('rev.video', 'video')
            ->where('rev.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param int $idRev
     *
     * @return array
     */
    public function getImagesByRevision($idRev)
    {
        $qb = $this->createQueryBuilder('rev');
        $qb->select('image.id')
            ->join('rev.image', 'image')
            ->where('rev.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getResult();
    }

    /**
     * getS3FolderByRev
     * @param $idRev
     * @return mixed
     */
    public function getS3FolderByRev($idRev)
    {
        $qb = $this->createQueryBuilder('r');
        $qb->select('r.dataFolderS3')
            ->where('r.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * getS3FolderVeevaByRev
     * @param $idRev
     * @return mixed
     */
    public function getS3FolderVeevaByRev($idRev)
    {
        $qb = $this->createQueryBuilder('r');
        $qb->select('r.dataFolderVeevaS3')
            ->where('r.id = :idRev')
            ->setParameter('idRev', $idRev);

        return $qb->getQuery()->getOneOrNullResult();
    }

}