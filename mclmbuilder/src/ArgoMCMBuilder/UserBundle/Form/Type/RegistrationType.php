<?php

namespace ArgoMCMBuilder\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
use ArgoMCMBuilder\UserBundle\Services\RolesHelper;
use ArgoMCMBuilder\UserBundle\Entity\Company;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;

class RegistrationType extends BaseType
{
    /**
     * @var RolesHelper
     */
    private $roles;
    /**
     * @var Container
     */
    private $container;

    /**
     * @param string      $class The User class name
     * @param RolesHelper $roles Array or roles
     */
    public function __construct($class, RolesHelper $roles, Container $container)
    {
        parent::__construct($class);

        $this->roles = $roles;
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $roles = array(
            'ROLE_BASIC_USER' => 'MCM Basic user',
            'ROLE_MANAGER' => 'MCM Manager',
            'ROLE_ADMIN' => 'MCM Administrator',
            'ROLE_SUPER_ADMIN' => 'MCM Super Administrator',
        );
        $user = $this->container->get('security.context')->getToken()->getUser();
        $companyId = $user->getCompany()->getId();
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
                'email',
                'email',
                array('label' => 'form.email', 'attr' => array('class' => 'form-control', 'palceholder' => 'E-mail'))
            )
            ->add(
                'occupation',
                'text',
                array('label' => 'form.occupation', 'attr' => array('class' => 'form-control'), 'required' => false)
            )
            ->add(
                'file',
                'file',
                array('label' => 'form.picture', 'attr' => array('class' => 'form-control'), 'required' => true)
            )
            ->add(
                'plainPassword',
                'repeated',
                array(
                    'attr' => array('class' => 'form-control'),
                    'type' => 'password',
                    'options' => array('translation_domain' => 'FOSUserBundle'),
                    'first_options' => array('label' => 'form.password'),
                    'second_options' => array('label' => 'form.password_confirmation'),
                    'invalid_message' => 'fos_user.password.mismatch',
                )
            );
        if (in_array('ROLE_SUPER_ADMIN', $user->getRoles())) {
            $builder->add(
                'roles',
                'choice',
                array(
                    'attr' => array('class' => 'form-control'),
                    'choices' => $roles,
                    'required' => false,
                    'multiple' => true,
                )
            );
            $builder->add(
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
        } else {
            $builder->add(
                'roles',
                'choice',
                array(
                    'attr' => array('class' => 'form-control'),
                    'choices' => array(
                        'ROLE_ADMIN' => 'MCM Administrator',
                        'ROLE_MANAGER' => 'MCM Manager',
                        'ROLE_BASIC_USER' => 'MCM Basic user',
                    ),
                    'required' => false,
                    'multiple' => true,
                )
            );
            $builder->add(
                'company',
                'entity',
                array(
                    'attr' => array('class' => 'form-control'),
                    'class' => 'UserBundle:Company',
                    'property' => 'name',
                    'multiple' => false,
                    'label' => 'Company',
                    'empty_value' => 'form.choose.your.company',
                    'query_builder' => function ($er) use ($companyId) {
                        return $er->findCompanyAndChild($companyId);
                    },
                )
            );
        }

        $builder->remove('username');
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
        return 'FOS\UserBundle\Form\Type\RegistrationFormType';
    }

    public function getBlockPrefix()
    {
        return 'clm_user_registration';
    }

    // For Symfony 2.x
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
