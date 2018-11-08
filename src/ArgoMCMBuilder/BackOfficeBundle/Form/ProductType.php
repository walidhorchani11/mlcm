<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Doctrine\ORM\EntityRepository;

class ProductType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */

    /**
     * Company Id.
     */
    private $companyId;
    /**
     * user Roles.
     */
    private $userRoles;

    public function __construct(
        $companyId = null,
        $userRoles = null
    ) {
        $this->companyId = $companyId;
        $this->userRoles = $userRoles;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $companyId = $this->companyId;
        $userRoles = $this->userRoles;
        $builder
            ->add(
                'name',
                'text',
                array('label' => 'Name', 'attr' => array('class' => 'form-control'), 'required' => true)
            )
            ->add(
                'country',
                'text',
                array('label' => 'Country', 'attr' => array('class' => 'form-control'), 'required' => true)
            )
            ->add(
                'company',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\UserBundle\Entity\Company',
                    'property' => 'name',
                    'multiple' => false,
                    'empty_value' => 'choose the Pharma company',
                    'label' => 'Pharma company',
                    'translation_domain' => 'presentations',
                    'query_builder' => function (EntityRepository $er) use ($companyId, $userRoles) {
                        return $er->findCompanyAndChild($companyId, $userRoles);
                    },
                    'attr' => array('class' => 'form-control'),
                )
            )
            //->add('companies')
            //->add('projects')
        ;
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\BackOfficeBundle\Entity\Product',
            )
        );
    }
}
