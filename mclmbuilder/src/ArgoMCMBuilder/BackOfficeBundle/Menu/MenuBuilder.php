<?php

namespace ArgoMCMBuilder\BackOfficeBundle\Menu;

use Knp\Menu\FactoryInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use Symfony\Component\Security\Core\SecurityContextInterface;

class MenuBuilder
{
    private $factory;
    private $container;
    private $security;

    /**
     * MenuBuilder constructor.
     *
     * @param FactoryInterface $factory
     * @param Container $container
     * @param SecurityContextInterface $security
     */
    public function __construct(FactoryInterface $factory, Container $container, SecurityContextInterface $security)
    {
        $this->factory = $factory;
        $this->container = $container;
        $this->security = $security;
    }

    /**
     * Backoffice menu.
     *
     * @param RequestStack $requestStack
     *
     * @return unknown
     */
    public function createMenu(RequestStack $requestStack)
    {
        // Route node
        $menu = $this->factory->createItem(
            'root',
            array(
                'childrenAttributes' => array(
                    'class' => 'nav metismenu',
                    'id' => 'left-menu',
                ),
            )
        );
        if ($this->container->getParameter('kernel.environment') == 'dev') {
            // Child nodes
            $menu->addChild(
                'dashboard',
                array(
                    'route' => 'dashboard_index',
                    //'uri' => '#',
                )
            )->setAttribute('icon', 'fa fa-dashboard');
        }
        // Project node
        $menu->addChild(
            'My Projects',
            array(
                'uri' => '#',
                'linkAttributes' => array('class' => 'settings-icon'),
                'childrenAttributes' => array('class' => 'nav nav-second-level'),
            )
        );
        // Project Child nodes
        $menu['My Projects']->addChild(
            $translated = $this->container->get('translator')->trans('projects.my.active.project', array(), 'project'),
            array(
                'route' => 'projects_actives_projects_list',
            )
        );

        $menu['My Projects']->addChild(
            $translated = $this->container->get('translator')->trans('projects.my.archive.project', array(), 'project'),
            array(
                'route' => 'projects_archives_projects_list',
            )
        );
        if ($this->security->isGranted('ROLE_MANAGER')) {
            $menu['My Projects']->addChild(
                $translated = $this->container->get('translator')->trans(
                    'projects.create.new.project',
                    array(),
                    'project'
                ),
                array(
                    'route' => 'projects_create_new_project',
                )
            );
        }

        if ($this->container->getParameter('kernel.environment') == 'dev'
            || $this->container->getParameter('kernel.environment') == 'prod'
        ) {
            // Child nodes
            $menu->addChild(
                'My CLM Presentations',
                array(
                    'uri' => '#',
                    'childrenAttributes' => array(
                        'class' => 'nav nav-second-level',
                    ),

                    'linkAttributes' => array(
                        'class' => 'treeview-toggle',
                        'data-toggle' => 'nav-second-level',
                        'data-target' => '#',
                    ),

                    'linkAttributes' => array(
                        'class' => 'presentations-icon',
                    ),
                )
            );

            $menu['My CLM Presentations']->addChild(
                $translated = $this->container->get('translator')->trans(
                    'presentations.my_active_clm_presentations',
                    array(),
                    'presentations'
                ),
                array(
                    'route' => 'presentations',
                )
            );

            if ($this->security->isGranted('ROLE_MANAGER')) {
                $menu['My CLM Presentations']->addChild(
                    $translated = $this->container->get('translator')->trans(
                        'presentations.new_clm_presentation',
                        array(),
                        'presentations'
                    ),
                    array(
                        'route' => 'create_new_pres',
                    )
                );
            }

            $menu['My CLM Presentations']->addChild(
                $translated = $this->container->get('translator')->trans(
                    'presentations.my_archived_clm_presentations',
                    array(),
                    'presentations'
                ),
                array(
                    'route' => 'presentations_archived_presentation',
                )
            );
        }
        if ($this->container->getParameter('kernel.environment') == 'dev') {
            // Child nodes
            $menu->addChild(
                'My Emails Templates',
                array(
                    'route' => 'emails',
                )
            )->setAttribute('icon', 'fa fa-envelope');

            // Child nodes
            $menu->addChild(
                'Alerts and Notifications',
                array(
                    'route' => 'alerts',
                )
            )->setAttribute('icon', 'fa fa-bell');
        }
        if ($this->security->isGranted('ROLE_ADMIN') or $this->security->isGranted('ROLE_SUPER_ADMIN')) {
            // Child nodes
            $menu->addChild(
                'Administration',
                array(
                    'uri' => '#',
                    'childrenAttributes' => array(
                        'class' => 'nav nav-second-level',
                    ),

                    'linkAttributes' => array(
                        'class' => 'treeview-toggle',
                        'data-toggle' => 'nav-second-level',
                        'data-target' => '#',
                    ),
                    'linkAttributes' => array(
                        'class' => 'administration-icon',
                    ),
                )
            );
            if ($this->container->getParameter('kernel.environment') == 'dev') {
                $menu['Administration']->addChild(
                    'Workflows',
                    array(
                        'route' => 'workflows',
                    )
                );
            }

            $menu['Administration']->addChild(
                'Companies',
                array(
                    'route' => 'clm_company_list',
                )
            );

            if ($this->container->getParameter('kernel.environment') == 'dev') {
                $menu['Administration']->addChild(
                    'Territories',
                    array(
                        'route' => 'territories',
                    )
                );

                $menu['Administration']->addChild(
                    'Groups',
                    array(
                        'route' => 'fos_user_group_list',
                    )
                );
            }
            $menu['Administration']->addChild(
                'Users',
                array(
                    'route' => 'clm_users_list',
                )
            );

            if ($this->container->getParameter('kernel.environment') == 'dev') {
                $menu['Administration']->addChild(
                    'Products',
                    array(
                        'route' => 'products',
                    )
                );
                $menu['Administration']->addChild(
                    'All presentations',
                    array(
                        'route' => 'presentations_admin_index',
                    )
                );
                $menu['Administration']->addChild(
                    'Connected users',
                    array(
                        'route' => 'connected_user',
                    )
                );
                $menu['Administration']->addChild(
                    'Newsletter',
                    array(
                        'route' => 'newsletter_index',
                    )
                );
            }
        }

        if ($this->security->isGranted('ROLE_ADMIN') or $this->security->isGranted('ROLE_MANAGER')) {
            if ($this->container->getParameter('kernel.environment') == 'dev') {
                $menu->addChild(
                    'Mediathéque',
                    array(
                        'route' => 'media_index',
                        'linkAttributes' => array(
                            'class' => 'media-icon',
                        ),
                    )
                );
                $env = $this->container->get('app.env_by_client')->getEnvByClient();
                $request = $this->container->get('request');
                $currentUrl = $request->getSchemeAndHttpHost();
                if (!empty($env[$currentUrl]) && $env[$currentUrl] == "merck") {
                    $menu->addChild(
                        'FAQ',
                        array(
                            'route' => 'faq_index',
                        )
                    )->setAttribute('icon', 'fa fa-question-circle');
                }
            }
        }

        //$this->setCurrentMenu($menu);

        return $menu;
    }
}
