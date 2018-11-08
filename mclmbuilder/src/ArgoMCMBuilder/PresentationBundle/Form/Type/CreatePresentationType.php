<?php

namespace ArgoMCMBuilder\PresentationBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use ArgoMCMBuilder\UserBundle\Entity\Company;

class CreatePresentationType extends AbstractType
{
    /**
     * companyId.
     */
    private $companyId;

    /**
     * projectId.
     */
    private $projectId;
    /**
     * user.
     */
    private $user;
    /**
     * companyProject.
     */
    private $companyProject;
    /**
     * host.
     */
    private $host;

    /**
     * Constructor.
     */
    public function __construct(
        $companyId = null,
        $projectId = null,
        $user = null,
        $companyProject = null,
        $host = null
    ) {
        $this->companyId = $companyId;
        $this->projectId = $projectId;
        $this->user = $user;
        $this->companyProject = $companyProject;
        $this->host = $host;
    }

    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $companyId = $this->companyId;
        $projectId = $this->projectId;
        $user = $this->user;
        $userRoles = $this->user->getRoles();

        $companyProject = $this->companyProject;

        if ($this->projectId == null) {
            $builder->add(
                'project',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\ProjectBundle\Entity\Project',
                    'property' => 'name',
                    'multiple' => false,
                    'label' => 'p-project-name',
                    'translation_domain' => 'presentations',
                    'required' => true,
                    'placeholder' => 'choose-a-project',
                    'empty_value' => 'no available Project',
                    'query_builder' => function (EntityRepository $er) use ($companyId, $user) {
                        return $er->getListAvailableProjects($companyId, $user);
                    },
                    'attr' => array('class' => 'form-control'),
                )
            );
        } else {
            $companyId = $companyProject;
            $userRoles = array();
            $builder->add(
                'project',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\ProjectBundle\Entity\Project',
                    'property' => 'name',
                    'multiple' => false,
                    'label' => 'p-project-name',
                    'translation_domain' => 'presentations',
                    'required' => true,
                    'query_builder' => function (EntityRepository $er) use ($projectId) {
                        return $er->findProjectById($projectId);
                    },
                    'attr' => array('class' => 'form-control'),
                )
            );
        }

        $builder->add(
            'name',
            'text',
            array(
                'label' => 'presentation_name',
                'translation_domain' => 'presentations',
                'attr' => array(
                    'class' => 'form-control',
                    'placeholder' => 'presentation_name',
                ),
            )
        );

        if ($options['data']->getType() != 'Localisation') {
            $builder
                ->add(
                    'type',
                    'choice',
                    array(
                        'translation_domain' => 'presentations',
                        'label' => 'presentation_type',
                        'empty_value' => 'choose_presentation_type',
                        'choices' => array(
                            'Standard' => 'Standard',
                            'Master' => 'Master to localisations',
                        ),
                        'data' => $options['data']->getType(),
                        'attr' => array('class' => 'form-control'),
                    )
                )
                ->add(
                    'territory',
                    'entity',
                    array(
                        'class' => 'ArgoMCMBuilder\UserBundle\Entity\Territory',
                        'query_builder' => function (EntityRepository $repository) {
                            return $repository->createQueryBuilder('u')->orderBy('u.name', 'ASC');
                        },
                        'property' => 'name',
                        'multiple' => false,
                        'label' => 'pres-territories',
                        'translation_domain' => 'presentations',
                        'required' => false,
                        'empty_value' => 'p-presentation-territory',
                        'query_builder' => function (EntityRepository $repository) {
                            return $repository->createQueryBuilder('u')->orderBy('u.name', 'ASC');
                        },
                        'attr' => array('class' => 'form-control'),
                    )
                );
        }
        $builder->add('company', 'entity', array(
            'class' => 'ArgoMCMBuilder\UserBundle\Entity\Company',
            'property' => 'name',
            'multiple' => false,
            'translation_domain' => 'presentations',
            'empty_value' => 'choose_the_company',
            'label' => 'presentations.pharmacompany',
            'query_builder' => function (EntityRepository $er) use ($companyId, $userRoles) {
                return $er->findCompanyAndChild($companyId, $userRoles);
            },
            'attr' => array('class' => 'form-control'),
        ));
        if ($options['data']->getType() != 'Localisation') {
            if (!strpos($this->host, 'argolife')) {
                $builder->add(
                    'products',
                    'entity',
                    array(
                        'class' => 'ArgoMCMBuilder\BackOfficeBundle\Entity\Product',
                        'property' => 'name',
                        'multiple' => true,
                        'label' => 'pres-products',
                        'translation_domain' => 'presentations',
                        'required' => false,
                        'empty_value' => 'p-presentation-products',
                        'query_builder' => function (EntityRepository $er) use ($companyId) {
                            return $er->getListAvailableProduct($companyId);
                        },
                        'attr' => array('class' => 'form-control'),
                    )
                );
            }
        }

        $builder
//            ->add('agency', 'entity', array(
//            'class' => 'ArgoMCMBuilder\BackOfficeBundle\Entity\Agence',
//            'property' => 'name',
//            'multiple' => false,
//            'label' => 'Agency company',
//            'translation_domain' => 'presentations',
//            'required' => false,
//            'empty_value' => 'choose the Pharma agency',
//            'attr' => array('class' => 'form-control'),
//        ))

            ->add(
                'device',
                'choice',
                array(
                    'translation_domain' => 'presentations',
                    'label' => 'pres-device',
                    'choices' => array('iPad' => 'iPad'),
                    'attr' => array('class' => 'form-control'),
                )
            );
        $formModifier = function (FormInterface $form, Company $company = null) {
            $companyId = null === $company ? null : $company->getId();

            $form->add(
                'owner',
                'entity',
                array(
                    'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                    'placeholder' => '',
                    'property' => 'fullName',
                    'attr' => array('class' => 'form-control'),
                    'required' => true,
                    'label' => 'owner',
                    'translation_domain' => 'presentations',
                    'empty_value' => 'choose_the_owner',
                    'query_builder' => function (EntityRepository $er) use ($companyId) {
                        return $er->findByCompanyAndRole($companyId, 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_BASIC_USER');
                    },
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
                    'editors',
                    'entity',
                    array(
                        'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                        'property' => 'fullName',
                        'multiple' => true,
                        'label' => 'presentation.editor',
                        'translation_domain' => 'presentations',
                        'required' => false,
                        'empty_value' => 'choose the editor',
                        'query_builder' => function (EntityRepository $er) use ($company) {
                            $companyId = null === $company ? array() : $company->getId();

                            return $er->findByCompanyAndRole($companyId, 'ROLE_BASIC_USER');
                        },
                        'attr' => array('class' => 'form-control'),
                    )
                )
                ->add(
                    'viewers',
                    'entity',
                    array(
                        'class' => 'ArgoMCMBuilder\UserBundle\Entity\User',
                        'property' => 'fullName',
                        'multiple' => true,
                        'label' => 'presentation.viewer',
                        'translation_domain' => 'presentations',
                        'required' => false,
                        'empty_value' => 'choose the viewer',
                        'query_builder' => function (EntityRepository $er) use ($company) {
                            $companyId = null === $company ? array() : $company->getId();

                            return $er->findByCompanyAndRole($companyId, 'ROLE_BASIC_USER');
                        },
                        'attr' => array('class' => 'form-control'),
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

        $builder->add(
            'isActive',
            'choice',
            array(
                'label' => 'status',
                'choices' => array('20' => 'Active', '10' => 'Archive'),
                'translation_domain' => 'presentations',
                'attr' => array('class' => 'form-control'),
            )
        );

        $builder->add(
            'saveAndReturn',
            'submit',
            array(
                'translation_domain' => 'presentations',
                'label' => 'pres-save-and-start-presentation',
                'attr' => array(
                    'class' => 'btn btn-success pull-right',
                ),
            )
        );
    }

    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'ArgoMCMBuilder\PresentationBundle\Entity\Presentation',
                'allow_extra_fields' => true,
            )
        );
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'create_presentation';
    }
}
