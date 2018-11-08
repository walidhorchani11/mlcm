<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use Symfony\Component\HttpFoundation\Session\Session;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormError;

class DefaultController extends Controller
{
    /**
     * @Route("dashboard-veeva/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'GET',
                '/api/v13.0/objects/documents',
                [
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'Authorization' => $sessionId,
                    ],
                ]
            );

            $body = $response->getBody();
            $obj = json_decode($body);
            $datas = !empty($obj->documents) ? $obj->documents : '';
            $content = $this
                ->get('templating')
                ->render(
                    'VeevaVaultBundle:Default:getAllBinders.html.twig',
                    array(
                        'datas' => $datas,
                    )
                );

            return new Response($content);
        } else {
            return $this->redirectToRoute('login_veeva');
        }
    }

    /**
     * @Route("/auth/veeva")
     */
    public function authAction()
    {
        /** @var \GuzzleHttp\Client $client */
        $client = $this->get('guzzle.client.auth_crm');
        $response = $client->request(
            'POST',
            '/api/v13.0/auth',
            [
                'form_params' => [
                    'username' => 'beyrem.chouaieb@vv-agency.com',
                    'password' => 'azerty123',
                ],
            ]
        );

        $session = new Session();
        /** set and get session attributes **/
        $body = $response->getBody();
        $obj = json_decode($body);
        $sessionId = $obj->sessionId;
        $session->set('TokenUserVeeva', $sessionId);

        return new Response(
            '<html><body><br /><h2>Data User Veeva:</h2><br /> '.$response->getBody(
            ).'<br /><a href="/"><h2>Go To Dashboard</h2></a></body></html>'
        );

    }


    /**
     * @Route("/add-binder",name="add_binder_from_veeva")
     */
    public function addBinderAction()
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'POST',
                '/api/v13.0/objects/binders',
                [
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'Authorization' => $sessionId,
                    ],
                    'form_params' => [
                        'name__v' => 'Binder From Symfony',
                        'type__v' => 'Multichannel Presentation',
                        'subtype__v' => '',
                        'lifecycle__v' => 'Binder Lifecycle',
                        'product__v' => '00P000000000601',
                        'country__v' => '00C000000000101',
                        'major_version_number__v' => '0',
                        'minor_version_number__v' => '1',
                    ],
                ]
            );

            return new Response(
                '<html><body>'.$response->getBody().'</body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/add-document",name="add_document_from_veeva")
     */
    public function addDocumentAction()
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'POST',
                '/api/v13.0/objects/documents',
                [
                    'headers' => [
                        'Authorization' => $sessionId,

                    ],
                    'multipart' => [
                        [
                            'name' => 'file',
                            'contents' => fopen('/home/argo/Bureau/file/images.jpg', 'r'),

                        ],
                        [
                            'name' => 'name__v',
                            'contents' => 'Document From Symfony',
                        ],

                        [
                            'name' => 'title__v',
                            'contents' => 'title document',
                        ],

                        [
                            'name' => 'type__v',
                            'contents' => 'Promotional Piece',
                        ],
                        [
                            'name' => 'subtype__v',
                            'contents' => '',
                        ],
                        [
                            'name' => 'classification__v',
                            'contents' => '',
                        ],
                        [
                            'name' => 'lifecycle__v',
                            'contents' => 'Promotional Piece',
                        ],
                        [
                            'name' => 'major_version_number__v',
                            'contents' => '0',
                        ],
                        [
                            'name' => 'minor_version_number__v',
                            'contents' => '1',
                        ],
                        [
                            'name' => 'product__v',
                            'contents' => '00P000000000601',
                        ],
                        [
                            'name' => 'country__v',
                            'contents' => '00C000000000101',
                        ],
                        [
                            'name' => 'campaign__vs',
                            'contents' => 'On Track',
                        ],
                        [
                            'name' => 'audience__vs',
                            'contents' => 'Consumer',
                        ],
                        [
                            'name' => 'media__vs',
                            'contents' => 'Print',
                        ],
                        [
                            'name' => 'branding__vs',
                            'contents' => 'Branded',
                        ],
                        [
                            'name' => 'planned_date_of_first_use__vs',
                            'contents' => '2017-12-20',
                        ],
                        [
                            'name' => 'prescribing_information_required__vs',
                            'contents' => false,
                        ],
                        [
                            'name' => 'pi_version__vs',
                            'contents' => 'test version',
                        ],
                        [
                            'name' => 'prescribing_information_format__vs',
                            'contents' => 'Full Package Insert',
                        ],
                        [
                            'name' => 'field_use__vs',
                            'contents' => false,
                        ],
                        [
                            'name' => 'fair_market_value__vs',
                            'contents' => 'Test Fair Market Value',
                        ],
                        [
                            'name' => 'creative_agency__vs',
                            'contents' => 'Targetbase',
                        ],
                        [
                            'name' => 'other_agencies__vs',
                            'contents' => 'Beacon Healthcare Communications',
                        ],
                        [
                            'name' => 'expiration_date__vs',
                            'contents' => '2017-12-20',
                        ],
                        [
                            'name' => 'duration_of_use_days__vs',
                            'contents' => 3,
                        ],
                        [
                            'name' => 'withdrawal_effective_date__vs',
                            'contents' => '2017-12-20',
                        ],
                        [
                            'name' => 'reason_for_withdrawal__vs',
                            'contents' => 'Health Authority Request',
                        ],
                        [
                            'name' => 'mlr_type__vs',
                            'contents' => 'Electronic',
                        ],
                        [
                            'name' => 'planned_mlr_start_date__vs',
                            'contents' => '2017-12-20',
                        ],
                        [
                            'name' => 'actual_mlr_start_date__vs',
                            'contents' => '2017-12-20',
                        ],
                        [
                            'name' => 'mlr_meeting_date__vs',
                            'contents' => '2017-12-20',
                        ],
                        [
                            'name' => 'mlr_meeting_duration_hours__vs',
                            'contents' => 4,
                        ],
                        [
                            'name' => 'submission_required__vs',
                            'contents' => false,
                        ],
                    ],

                ]
            );
            $body = $response->getBody();

            return new Response(
                '<html><body>'.$body.'</body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/delete-binder/{id}",name="delete_binder_from_veeva")
     */
    public function deleteBinderAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'DELETE',
                '/api/v13.0/objects/binders/'.$id,
                [
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'Authorization' => $sessionId,
                    ],
                ]
            );

            $body = $response->getBody();

            return new Response(
                '<html><body>'.$body.'</body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/update-binder/{id}",name="update_binder_from_veeva")
     */
    public function updateBinderAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'PUT',
                '/api/v13.0/objects/binders/'.$id,
                [
                    'headers' => [
                        'Content-Type' => 'multipart/form-data',
                        'Authorization' => $sessionId,
                    ],
                    'form_params' => [
                        'file' => fopen('/home/argo/Bureau/file/Test_document_PDF.pdf', 'r'),
                        'name__v' => 'Update SymF to Veeva',
                    ],


                ]
            );

            return new Response(
                '<html><body><br>  \'form_params\' => [<br />\'name__v\' => \'Update SymF to Veeva\',<br />],</code><h2>DATA:</h2> '.$response->getBody(
                ).'</body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/upload-document/{id}",name="upload_document_to_veeva")
     */
    public function uploadDocumentAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'POST',
                '/api/v13.0/objects/binders/'.$id.'/attachments',
                [
                    'headers' => [
                        'Authorization' => $sessionId,

                    ],
                    'multipart' => [
                        [
                            'Content-type' => 'application/jpg',
                            'name' => 'file',
                            'contents' => fopen('/home/argo/Bureau/file/images.jpg', 'r'),

                        ],
                    ],
                ]
            );

            return new Response(
                '<html><body><br>  \'form_params\' => [<br />\'file\' => \'Exemple folder/images.jpg\',<br />],</code><h2>DATA:</h2> '.$response->getBody(
                ).'</body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/draft-to-approved/{id}",name="draft_to_approved")
     */
    public function draftToApprovedAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');
            $response = $client->request(
                'PUT',
                '/api/v13.0/objects/binders/lifecycle_actions/1423693497110',
                [
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'Authorization' => $sessionId,
                    ],
                    'form_params' => [
                        'docIDs' => "'.$id.':0:1",
                        'lifecycle' => 'general_lifecycle__vs',
                        'state' => 'approved__vs',
                    ],
                ]
            );

            return new Response(
                '<html><body>
            <h2>DATA:</h2>'.$response->getBody().' </body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/list-of-action/{id}",name="permitted_action")
     */
    public function actionPermittedAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');

            $response = $client->request(
                'GET',
                '/api/v13.0/objects/documents/'.$id.'/versions/0/1/lifecycle_actions',
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => $sessionId,
                    ],

                ]
            );

            return new Response(
                '<html><body>
             <h2>DATA:</h2>'.$response->getBody().' </body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/listing-users",name="listing_users")
     */
    public function listingUsersAction()
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');

            $response = $client->request(
                'GET',
                '/api/v13.0/objects/users',
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => $sessionId,
                    ],

                ]
            );

            return new Response(
                '<html><body>
             <h2>DATA:</h2>'.$response->getBody().' </body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }

    /**
     * @Route("/document-details/{id}",name="document_details")
     */
    public function DocumentDetailsAction($id)
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = $this->get('guzzle.client.tools_binder');

            $response = $client->request(
                'GET',
                'api/v13.0/objects/documents/'.$id.'',
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => $sessionId,
                    ],
                ]
            );
            $data = $response->getBody();

            return new Response(
                '<html><body>
             <h2>Document Details</h2>'.$data.' </body></html>'
            );
        } else {
            return new Response(
                '<html><body>Token User not Valid :)</body></html>'
            );
        }
    }



}
