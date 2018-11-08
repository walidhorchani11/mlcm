<?php

namespace ArgoMCMBuilder\PresentationBundle\Type;

use Doctrine\DBAL\Types\Type;
use Doctrine\DBAL\Platforms\AbstractPlatform;

/**
 * The JSON type.
 *
 * @author Mehrez Bouchaala <bouchaala.mehrez@gmail.com>
 */
class JsonDocType extends Type
{

    /**
     * Gets the SQL snippet used to declare a CLOB column type.
     * @return string
     */
    public function getJsonTypeDeclarationSQL()
    {
        return 'JSON';
    }

    /**
     * {@inheritdoc}
     */
    public function getSQLDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        return $this->getJsonTypeDeclarationSQL();
    }

    /**
     * {@inheritdoc}
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if (null === $value) {
            return null;
        }

        return json_encode($value);
    }

    /**
     * {@inheritdoc}
     */
    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        if ($value === null || $value === '') {
            return '{}';
        }

        $value = (is_resource($value)) ? stream_get_contents($value) : $value;

        return $value;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'json_doc';
    }
}