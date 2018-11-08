<?php

namespace ArgoMCMBuilder\PresentationBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * Class SurveyRepository
 * @package ArgoMCMBuilder\PresentationBundle\Repository
 */
class SurveyRepository extends EntityRepository
{
    /**
     * @param array $ids
     */
    public function clearSurvey(array $ids)
    {
        $this->getEntityManager()
            ->createQuery('DELETE FROM PresentationBundle:Survey surv WHERE surv.id IN (:id)')
            ->setParameter('id', $ids)
            ->execute();
    }
}
