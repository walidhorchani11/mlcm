<?php

namespace ArgoMCMBuilder\PresentationBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ReferenceType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', 'text', array(
                'translation_domain' => 'presentationedit',
                'label' => 'Reference-title',
                'attr' => array('class' => 'form-control', 'placeholder' => 'Reference-title'),

            ))
            ->add('description', 'textarea', array(
                'translation_domain' => 'presentationedit',
                'label' => 'Reference-description',
                'attr' => array('class' => 'form-control'),
            ))
            ->add(
                'saveAndReturn',
                'submit',
                array(
                    'translation_domain' => 'presentationedit',
                    'label' => 'Create-Reference',
                    'attr' => array(
                        'class' => 'button ladda-button ladda-button-demo pull-right',
                        'data-style' => 'zoom-in',
                    ),
                )
            );
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\PresentationBundle\Entity\Reference',
            )
        );
    }
}
