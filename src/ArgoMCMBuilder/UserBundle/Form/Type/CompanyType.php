<?php

namespace ArgoMCMBuilder\UserBundle\Form\Type;

use ArgoMCMBuilder\UserBundle\Entity\CompanyRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class CompanyType extends AbstractType
{
    private $securityContext;

    public function __construct(SecurityContext $securityContext)
    {
        $this->securityContext = $securityContext;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // Current logged user
        $user = $this->securityContext->getToken()->getUser();
        $builder->add('name', 'text', array('label' => 'Name', 'attr' => array('class' => 'form-control')));
//        $builder
//            ->add(
//                'agencies',
//                'entity',
//                array(
//                    'class' => 'BackOfficeBundle:Agence',
//                    'choice_label' => 'name',
//                    'required' => false,
//                    'multiple' => true,
//                    'attr' => array('class' => 'form-control'),
//                )
//            );
        $builder->add(
            'parent',
            'entity',
            array(
                'class' => 'UserBundle:Company',
                'placeholder' => 'Parent',
                'choice_label' => 'name',
                'required' => false,
                'attr' => array(
                    'class' => 'form-control',
                    'placeholder' => 'choice_level',
                ),
                'query_builder' => function (CompanyRepository $repository) {
                    return $repository->findCompanyAndChild(
                        $this->securityContext->getToken()->getUser()->getCompany()->getId(),
                        $this->securityContext->getToken()->getUser()->getRoles()
                    );
                },
            )
        );
        $builder->add(
            'veevaUrl',
            'text',
            array(
                'required' => false,
                'label' => 'VEEVA VAULT URL',
                'attr' => array('class' => 'form-control'),
            )
        );
        /*$builder->add(
            'veevaApi',
            'text',
            array('required' => false, 'label' => 'VEEVA VAULT API', 'attr' => array('class' => 'form-control'))
        );*/

        $builder->add(
            'veevaApi',
            ChoiceType::class,
            array(
                'choices' => array(
                    "v11.0" => "v11.0",
                    "v12.0" => "v12.0",
                    "v13.0" => "v13.0",
                    "v14.0" => "v14.0",
                    "v15.0" => "v15.0",
                    "v16.0" => "v16.0",
                    "v17.1" => "v17.1",
                    "v17.2" => "v17.2",
                ),
                'required' => false,
                'data' => "v17.2",
                'label' => 'VEEVA VAULT API',
                'attr' => array('class' => 'form-control'),
            )
        );

    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\UserBundle\Entity\Company',
                'csrf_protection' => true,
                'translation_domain' => 'users',
            )
        );
    }

    public function getBlockPrefix()
    {
        return 'clm_company_add';
    }

    // For Symfony 2.x
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
