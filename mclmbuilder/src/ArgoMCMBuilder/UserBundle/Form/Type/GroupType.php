<?php

namespace ArgoMCMBuilder\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use ArgoMCMBuilder\UserBundle\Entity\Company;

class GroupType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('parent')
            ->add('company');
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\UserBundle\Entity\Group',
                'translation_domain' => 'users',
            )
        );
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\GroupFormType';
    }

    public function getBlockPrefix()
    {
        return 'clm_user_group';
    }

    // For Symfony 2.x
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
