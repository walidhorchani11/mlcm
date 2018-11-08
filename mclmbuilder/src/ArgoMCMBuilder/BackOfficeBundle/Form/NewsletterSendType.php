<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class NewsletterSendType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
          ->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
              $product = $event->getData();
              $form = $event->getForm();
              $form
              ->add('subject', null, array(
                  'label_attr' => array('class' => 'col-sm-2 control-label'),
                  'attr' => array('class' => 'form-control'),
                  'required' => true,
              ))
              ->add('users', 'entity', array(
                  'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                  'property' => 'fullName',
                  'multiple' => true,
                  'required' => true,
                  'label_attr' => array('class' => 'col-sm-2 control-label'),
                  'attr' => array('class' => 'form-control'),
                  'mapped' => false,
              ))
              ->add('textMessage', TextareaType::class, array(
                  'required' => false,
                  'attr' => array('class' => 'summernote'),
              ));
              if ($product->getId() == null) {
                  $form->add('copy', CheckboxType::class, array(
                      'label' => 'Save a copy',
                      'label_attr' => array('class' => 'col-sm-2 control-label'),
                      'attr' => array('class' => 'form-control'),
                      'mapped' => false,
                      'required' => false,
                ));
              } else {
                  $form->add('copy', HiddenType::class, array(
                    'label' => ' ',
                    'mapped' => false,
                    'required' => false,
                ));
              }
          });
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
        return 'argomcmbuilder_backofficebundle_newslettersend';
    }
}
