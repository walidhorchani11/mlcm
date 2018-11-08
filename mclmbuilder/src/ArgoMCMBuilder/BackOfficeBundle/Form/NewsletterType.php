<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class NewsletterType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
          ->add('subject', null, array(
              'label_attr' => array('class' => 'col-sm-2 control-label'),
              'attr' => array('class' => 'form-control'),
              'required' => true,
          ))
          ->add('textMessage', TextareaType::class, array(
              'required' => false,
              'attr' => array('class' => 'summernote'),
          ));
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'ArgoMCMBuilder\BackOfficeBundle\Entity\Newsletter',
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'argomcmbuilder_backofficebundle_newsletter';
    }
}
