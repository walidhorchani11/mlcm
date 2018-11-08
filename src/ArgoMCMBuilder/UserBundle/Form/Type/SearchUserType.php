<?php

namespace ArgoMCMBuilder\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use ArgoMCMBuilder\UserBundle\Entity\Company;

class SearchUserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $roles = array(
            'ROLE_BASIC_USER' => 'ROLE_BASIC_USER',
            'ROLE_MANAGER' => 'ROLE_MANAGER',
            'ROLE_ADMIN' => 'ROLE_ADMIN',
        );
        $builder
            ->add(
                'firstname',
                'text',
                array('label' => 'Name', 'attr' => array('class' => 'form-control'), 'required' => false)
            )
            ->add(
                'company',
                'entity',
                array(
                    'class' => 'UserBundle:Company',
                    'property' => 'name',
                    'multiple' => false,
                    'required' => false,
                    'label' => 'Company',
                    'empty_value' => 'Choose company',
                    'attr' => array('class' => 'form-control'),
                )
            )
            ->add(
                'roles',
                'choice',
                array(
                    'choices' => $roles,
                    'required' => false,
                    'multiple' => false,
                    'empty_value' => 'Choose role',
                    'attr' => array('class' => 'form-control'),
                )
            );
    }

    public function getBlockPrefix()
    {
        return 'clm_search_user';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
