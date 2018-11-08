<?php

namespace ArgoMCMBuilder\ProjectBundle\Common\mapper;

abstract class AbstractModelMapper
{
    abstract public function modelToDto($model, $dto);

    abstract public function dtoToModel($dto, $model);

    /**
     * Map list of model to list of dto.
     *
     * @param array $modelList
     * @param array $dtoList
     *
     * @return array $dtoList
     */
    public function listModelToDto($modelList, &$dtoList = null)
    {
        $dtoList = ($dtoList != null) ? $dtoList : array();

        foreach ($modelList as $model) {
            $dtoList[] = $this->modelToDto($model);
        }

        return $dtoList;
    }
}
