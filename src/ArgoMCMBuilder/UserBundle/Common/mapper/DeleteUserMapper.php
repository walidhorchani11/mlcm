<?php

namespace ArgoMCMBuilder\UserBundle\Common\mapper;

class UserDeleteMapper extends AbstractModelMapper
{
    /**
     * Map data from entity to dto.
     *
     * @return ArgoMCMBuilder\UserBundle\Common\dto\DeleteUserDTO
     */
    public function modelToDto($model, $dto = null)
    {
        $dto = ($dto != null) ? $dto : new ProjectDTO();
        $dto->setUserId($model->getId());
        $dto->setUsers($model->getUsers());
        $dto->setPresentations($model->getPresentations());

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
