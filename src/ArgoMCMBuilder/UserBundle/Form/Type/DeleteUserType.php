<?php

namespace ArgoMCMBuilder\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityRepository;

class DeleteUserType extends AbstractType
{
    /**
     * userId.
     */
    private $userId;

    /**
     * projectId.
     */
    private $projectId;

    /**
     * Constructor.
     */
    public function __construct($UserId = null, $ProjectId = null)
    {
        $this->userId = $UserId;
        $this->projectId = $ProjectId;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $userId = $this->userId;
        $projectId = $this->projectId;
        $builder
            ->add(
                'users',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                    'multiple' => false,
                    'mapped' => false,
                    'label' => 'Please choose the user to who you want to transfer the ownership of presentations:',
                    'empty_value' => 'Please choose a user',
                    'query_builder' => function (EntityRepository $er) use ($projectId) {
                        return $er->getListUserByCompany($projectId);
                    },
                    'attr' => array('class' => 'form-control'),
                )
            )
            ->add(
                'Type',
                'choice',
                array(
                    'choices' => array(
                        'Master to Loc' => 'Master to Loc',
                        'Localisation' => 'Localisation',
                        'Pilote' => 'Pilote',
                    ),
                    'attr' => array('class' => 'form-control'),
                    'mapped' => false,
                )
            )
            ->add(
                'Presentations',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\PresentationBundle\Entity\Presentation',
                    'property' => 'name',
                    'multiple' => true,
                    'mapped' => false,
                    'label' => 'You can select the clm to transfer',
                    'empty_value' => 'select the clm',
                    'attr' => array('class' => 'chosen-select form-control'),
                )
            )
            ->add(
                'all',
                'checkbox',
                array('label' => 'All Presentations', 'attr' => array('class' => 'form-control'), 'mapped' => false)
            );
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                'allow_extra_fields' => true,
                'translation_domain' => 'users',
            )
        );
    }

    public function getBlockPrefix()
    {
        return 'clm_delete_user';
    }

    // For Symfony 2.x
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
