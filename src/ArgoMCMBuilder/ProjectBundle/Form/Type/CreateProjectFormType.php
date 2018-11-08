<?php

namespace ArgoMCMBuilder\ProjectBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use ArgoMCMBuilder\UserBundle\Entity\Company;

class CreateProjectFormType extends AbstractType
{
    /**
     * True if the form is used for edition.
     *
     * @var bool
     */
    private $editMode;
    /**
     * Project Id.
     */
    private $projectId;
    /**
     * Company Id.
     */
    private $companyId;
    /**
     * user Roles.
     */
    private $userRoles;

    /**
     * Constructor.
     */
    public function __construct(
        $companyId = null,
        $editMode = false,
        $projectId = null,
        $userRoles = null
    ) {
        $this->editMode = $editMode;
        $this->projectId = $projectId;
        $this->companyId = $companyId;
        $this->userRoles = $userRoles;
    }

    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $companyId = $this->companyId;
        $userRoles = $this->userRoles;
        $builder->add(
            'name',
            'text',
            array(
                'label' => 'project.name',
                'attr' => array('class' => 'form-control', 'placeholder' => 'enter_project_name'),
                'translation_domain' => 'project',
            )
        );
        if ($this->editMode) {
            $builder->add(
                'owner',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                    'property' => 'fullName',
                    'multiple' => false,
                    'label' => 'project.owner',
                    'translation_domain' => 'project',
                    'required' => false,
                    'empty_value' => 'choose the owner',
                    'query_builder' => function (EntityRepository $er) use ($companyId, $options) {
                        return $er->findByCompanyAndRole(
                            $companyId,
                            'ROLE_BASIC_USER',
                            'ROLE_MANAGER',
                            'ROLE_ADMIN',
                            $options['data']->getOwner()->getId()
                        );
                    },
                    'attr' => array('class' => 'form-control'),
                    'group_by' => function ($val, $key, $index) {
                        if (in_array('ROLE_ADMIN', $val->getRoles())) {
                            return 'List Admins';
                        } elseif (in_array('ROLE_MANAGER', $val->getRoles())) {
                            return 'List Managers';
                        } else {
                            return 'List Basic users';
                        }
                    },
                )
            )
                ->add(
                    'status',
                    'choice',
                    array(
                        'label' => 'project.status',
                        'choices' => array('20' => 'Active', '10' => 'Archive'),
                        'translation_domain' => 'project',
                        'attr' => array('class' => 'form-control'),
                    )
                )
                ->add(
                    'saveAndReturn',
                    'submit',
                    array(
                        'translation_domain' => 'project',
                        'label' => 'projects.edit.confirm',
                        'attr' => array('class' => 'btn btn-success pull-right'),
                    )
                );
        } else {
            $builder->add(
                'company',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\UserBundle\Entity\Company',
                    'property' => 'name',
                    'label' => 'project.company',
                    'translation_domain' => 'project',
                    'required' => true,
                    'empty_value' => 'choose_your_company',
                    'query_builder' => function (EntityRepository $er) use ($companyId, $userRoles) {
                        return $er->findCompanyAndChild($companyId, $userRoles);
                    },
                    'attr' => array('class' => 'form-control'),
                )
            );
            /******************************************************************/

            $formModifier = function (FormInterface $form, Company $company = null) {
                $companyId = null === $company ? null : $company->getId();
                $form->add(
                    'owner',
                    'entity',
                    array(
                        'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                        'placeholder' => '',
                        'property' => 'fullName',
                        'label' => 'project.owner',
                        'attr' => array('class' => 'form-control'),
                        'translation_domain' => 'project',
                        'empty_value' => 'choose_the_owner',
                        'required' => false,
                        'query_builder' => function (EntityRepository $er) use ($companyId) {
                            return $er->findByCompanyAndRole(
                                $companyId,
                                'ROLE_ADMIN',
                                'ROLE_MANAGER',
                                'ROLE_BASIC_USER'
                            );
                        },
                        'group_by' => function ($val) {
                            if (in_array('ROLE_ADMIN', $val->getRoles())) {
                                return 'List Admins';
                            } elseif (in_array('ROLE_MANAGER', $val->getRoles())) {
                                return 'List Managers';
                            } else {
                                return 'List Basic users';
                            }
                        },
                    )
                );
            };

            $builder->addEventListener(
                FormEvents::PRE_SET_DATA,
                function (FormEvent $event) use ($formModifier) {
                    $data = $event->getData();
                    $formModifier($event->getForm(), $data->getCompany());
                }
            );

            $builder->get('company')->addEventListener(
                FormEvents::POST_SUBMIT,
                function (FormEvent $event) use ($formModifier) {
                    $company = $event->getForm()->getData();
                    $formModifier($event->getForm()->getParent(), $company);
                }
            );
            /******************************************************************/
            $builder->add(
                'startDate',
                'date',
                array(
                    'label' => 'project.startDate',
                    'translation_domain' => 'project',
                    'widget' => 'single_text',
                    'attr' => array('class' => 'form-control', 'disabled' => 'disabled'),
                    'data' => new \DateTime(),
                )
            )
                ->add(
                    'status',
                    'choice',
                    array(
                        'label' => 'project.status',
                        'choices' => array('20' => 'Active', '10' => 'Archive'),
                        'translation_domain' => 'project',
                        'attr' => array('class' => 'form-control'),
                    )
                )
                ->add(
                    'saveAndReturn',
                    'submit',
                     array(
                        'translation_domain' => 'project',
                        'label' => 'projects.create.project',
                        'attr' => array('class' => 'btn btn-success pull-right'),
                    )
                );
        }
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\ProjectBundle\Entity\Project',
                'allow_extra_fields' => true,
            )
        );
    }

    public function getName()
    {
        return 'create_project';
    }
}
