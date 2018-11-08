<?php

namespace ArgoMCMBuilder\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
use ArgoMCMBuilder\UserBundle\Services\RolesHelper;
use ArgoMCMBuilder\UserBundle\Entity\Company;
use Symfony\Component\Security\Core\SecurityContext;

class ProfileType extends BaseType
{
    /**
     * @var RolesHelper
     */
    private $roles;
    private $securityContext;

    /**
     * @param string          $class           The User class name
     * @param RolesHelper     $roles           Array or roles
     * @param SecurityContext $securityContext
     */
    public function __construct($class, RolesHelper $roles, SecurityContext $securityContext)
    {
        parent::__construct($class);
        $this->securityContext = $securityContext;

        $this->roles = $roles;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $roles = array(
            'ROLE_BASIC_USER' => 'ROLE_BASIC_USER',
            'ROLE_MANAGER' => 'ROLE_MANAGER',
            'ROLE_ADMIN' => 'ROLE_ADMIN',
            'ROLE_SUPER_ADMIN' => 'ROLE_SUPER_ADMIN',
        );
        $user = $this->securityContext->getToken()->getUser();

        $builder
            ->add(
                'firstname',
                'text',
                array('label' => 'form.first_name', 'attr' => array('class' => 'form-control'), 'required' => true)
            )
            ->add(
                'lastname',
                'text',
                array('label' => 'form.last_name', 'attr' => array('class' => 'form-control'), 'required' => true)
            )
            ->add(
                'occupation',
                'text',
                array('label' => 'form.occupation', 'attr' => array('class' => 'form-control'), 'required' => true)
            )
            ->add(
                'file',
                'file',
                array('label' => 'form.picture', 'attr' => array('class' => 'form-control'), 'required' => false)
            );

        if ($user->hasRole('ROLE_SUPER_ADMIN')) {
            $builder->add(
                'roles',
                'choice',
                array(
                    'attr' => array('class' => 'form-control'),
                    'choices' => $roles,
                    'required' => false,
                    'multiple' => true,
                )
            )
                ->add(
                    'company',
                    'entity',
                    array(
                        'attr' => array('class' => 'form-control'),
                        'class' => 'UserBundle:Company',
                        'property' => 'name',
                        'multiple' => false,
                        'label' => 'Company',
                        'empty_value' => 'form.choose.your.company',
                    )
                );
        } elseif ($user->hasRole('ROLE_ADMIN')) {
            $builder->add(
                'roles',
                'choice',
                array(
                    'attr' => array('class' => 'form-control'),
                    'choices' => array(
                        'ROLE_ADMIN' => 'ROLE_ADMIN',
                        'ROLE_MANAGER' => 'ROLE_MANAGER',
                        'ROLE_BASIC_USER' => 'ROLE_BASIC_USER',
                    ),
                    'required' => false,
                    'multiple' => true,
                )
            );
        }

        $builder->remove('username');
        $builder->remove('email');
        $builder->remove('current_password');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                'csrf_protection' => true,
                'translation_domain' => 'users',
            )
        );
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\ProfileFormType';
    }

    public function getBlockPrefix()
    {
        return 'clm_user_profile';
    }

    // For Symfony 2.x
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
