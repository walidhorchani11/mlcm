<?php

namespace ArgoMCMBuilder\PresentationBundle\Common\mapper;

use ArgoMCMBuilder\PresentationBundle\Common\dto\PresentationDTO;

class PresentationMapper extends AbstractModelMapper
{
    /**
     * Map data from entity to dto.
     *
     * @return ArgoMCMBuilder\PresentationBundle\Common\dto\PresentationDTO
     */
    public function modelToDto($model, $dto = null)
    {
        $dto = ($dto != null) ? $dto : new PresentationDTO();
        $dto->setId($model->getId());
        $dto->setName($model->getName());
        $dto->setType($model->getType());
        $dto->setStatus($model->getStatus());
        $dto->setProgress($model->getProgress());
        $dto->setLock($model->getLock());
        $dto->setVersion($model->getVersion());
        $dto->setIsDisconnect($model->getIsDisconnect());
        $dto->setLastUpdate($model->getLastUpdate());
        $dto->setOwner($model->getOwner()->getFirstname().' '.$model->getOwner()->getLastname());
        $dto->setTerritory($model->getTerritory()->getName());
        $dto->setProject($model->getProject()->getName());
        $dto->setThumbnailPath($model->getThumbnailPath());
        $aProducts = $model->getProducts();
        $sProducts = '';
        $iCpt = 1;
        foreach ($aProducts as $items) {
            if (count($aProducts) > 1) {
                if ($iCpt == 1) {
                    ++$iCpt;
                    $sProducts = $sProducts.$items->getName();
                } else {
                    $sProducts = $sProducts.', '.$items->getName();
                }
            } else {
                $sProducts = $items->getName();
            }
        }

        $dto->setProductList($sProducts);
        $revisionList = array();
        foreach ($model->getRevision() as $item) {
            $revisionList[] = $item;
        }
        $dto->setRevisionList($revisionList);

        return $dto;
    }

    /**
     * Map data from dto to entity.
     *
     * @return entity
     */
    public function dtoToModel($dto, $model)
    {
        throw new NotImplementedException('Not implemented');
    }
}
