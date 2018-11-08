<?php

/**
 * Created by PhpStorm.
 * User: argo
 * Date: 03/03/17
 * Time: 10:33
 */
namespace ArgoMCMBuilder\VeevaVaultBundle\Helper;

use ArgoMCMBuilder\MediaBundle\Services\AwsMedia;
use ArgoMCMBuilder\PresentationBundle\Objects\Catcher;
use ArgoMCMBuilder\UserBundle\Common\dto\DeleteUserDTO;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\RadioType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\Container;
use Doctrine\ORM\EntityManager;
use ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\BadResponseException;
use ArgoMCMBuilder\VeevaVaultBundle\Exception\VeevaException;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;


/***
 * Class ToolsHelper
 * @package ArgoMCMBuilder\VeevaVaultBundle\Helper
 */
class ToolsHelper
{
    /**
     * @var Container
     */
    private $container;
    /**
     *
     * @var EntityManager
     */
    protected $em;

    /**
     * ToolsHelper constructor.
     * @param Container $container
     * @param EntityManager $entityManager
     */
    public function __construct($container, $entityManager)
    {
        $this->container = $container;
        $this->em = $entityManager;

    }

    /***
     * @return mixed
     * Add Current User Veeva Token
     */
    public function token_instance()
    {
        $session = new Session();

        return $session->get('TokenUserVeeva');
    }

    /***
     * @param $id
     * @return mixed|Response
     */
    public function DocumentDetails($id)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$id.'',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                $response_body = json_decode($response->getBody()->getContents());

                return $response_body;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id
     * @return array
     * @throws \Throwable
     */
    public function DocumentCodeDetails($id)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$id.'',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                $response_body = json_decode($response->getBody()->getContents());
                $version = $response_body->document->major_version_number__v.'.'.$response_body->document->minor_version_number__v;

                return array('codeDoc' => $response_body->document->document_number__v, 'versionDoc' => $version);

            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /***
     * @return mixed|Response
     */
    public function DocumentListing()
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response_ = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],
                    ]
                );
                $body = $response_->getBody();
                $obj = json_decode($body);
                $datas = $obj->documents;

                return $datas;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /***
     * @param $id
     * @return mixed|Response
     */
    public function BinderDetails($id)
    {
        /**Verify Id Document If exist in Vault**/
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$id.'',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                $response_body = json_decode($response->getBody()->getContents());

                return $response_body;

            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /****
     * @return mixed|Response
     */
    public function DocumentTypes()
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/metadata/objects/documents',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );

                $obj = $response->getBody()->getContents();
                $documents = json_decode($obj);

                return $documents;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /****
     * @return mixed|Response
     */
    public function DocumentSubTypes($type)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/metadata/objects/documents/types/'.$type,
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );

                $obj = $response->getBody()->getContents();
                $documents = json_decode($obj);

                return $documents;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /****
     * @param $data_sent
     * @return mixed|Response
     */
    public function CreateBinder($data_sent, Request $request, $id_press, $id_rev)
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
        $company = $user->getCompany();
        $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
        $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
        /*dump($data_sent);die;*/
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $client = new Client();
            try {
                $response = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],
                        'form_params' =>
                            $data_sent
                        ,

                    ]
                );
                $result = json_decode($response->getBody());
                if ($result->responseStatus == 'SUCCESS') {
                    /**Get Version Binder**/
                    $resource = \GuzzleHttp\Promise\any($result->id)->then(
                        function ($values) use (
                            $client,
                            $veevaUrl,
                            $veevaApi,
                            $sessionId,
                            $result,
                            $id_rev,
                            $id_press
                        ) {
                            /** @var \GuzzleHttp\Client $client */
                            $res = $client->request(
                                'GET',
                                $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$result->id,
                                [
                                    'headers' => [
                                        'Authorization' => $sessionId,

                                    ],
                                ]
                            );
                            $dataUser = $this->currentUserDetailsAction();
                            if ($dataUser->responseStatus == "SUCCESS") {
                                $idCompanyVault = $dataUser->users[0]->user->vault_id__v[0];
                            }
                            $versionVeeva = json_decode($res->getBody());
                            $versionVeevaNumber = $versionVeeva->document->minor_version_number__v;

                            $type = $this->getTypeFromPath();

                            /**Persist data in Data Base***/
                            $em = $this->container->get('doctrine')->getManager();
                            $fileName = $em->getRepository('PresentationBundle:Presentation')->getZipName($id_rev);
                            $version = !empty($fileName['version']) ? $fileName['version'] : '';
                            $veeva = new Veeva();
                            $veeva->setStartDate(new \DateTime());
                            $veeva->setVersion($version);
                            $veeva->setBinderId($result->id);
                            $veeva->setVeevaVersion($versionVeevaNumber);
                            $veeva->setIdCompanyVault($idCompanyVault);
                            $presentation = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
                            $veeva->setPresentation($presentation);
                            $veeva->setType($type);
                            $em->persist($veeva);
                            $em->flush();
                            /****/
                        }
                    );
                    $resource->wait();


                    $mssg = $result->responseMessage;
                    $request->getSession()
                        ->getFlashBag()
                        ->add('success', $mssg);

                } else {
                    $result->responseStatus.' '.$result->errors[0]->message;
                }

                return $result;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id_press
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function addNewVersionBinder($id_press)
    {
        $existeBinder = $this->existeBinder($id_press);
        if (!empty($existeBinder)) {
            $existeBinderId = $existeBinder[0]->getBinderId();
            if ($existeBinderId) {
                $sessionId = $this->token_instance();
                $user = $this->container->get('security.context')->getToken()->getUser();
                $company = $user->getCompany();
                $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
                $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
                $client = new Client();
                try {
                    $response = $client->request(
                        'POST',
                        $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$existeBinderId,
                        [
                            'headers' => [
                                'Content-Type' => 'application/x-www-form-urlencoded',
                                'Authorization' => $sessionId,
                            ],
                        ]

                    );
                    if (!empty($response)) {
                        $data = @json_decode($response->getBody()->getContents(), false, 512, JSON_BIGINT_AS_STRING);
                    }


                    return $data;
                } catch (BadResponseException $e) {
                    trigger_error($e->getMessage());
                }
            }
        }

    }

    /***
     * @param $data
     * @param array $file
     * @return mixed|\Psr\Http\Message\ResponseInterface|Response
     */

    public function CreateDocument($data, $file = array())
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            $array_merge = array_merge(
                $file,
                $data
            );

            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $res = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents',
                    [
                        'headers' => [
                            'Authorization' => $sessionId,

                        ],
                        'multipart' => $array_merge,
                    ]
                );

                return $res;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /***
     * @param $id_binder
     * @param $id_document
     * @return mixed|\Psr\Http\Message\ResponseInterface|Response
     */
    public function MoveDocumentToBinder($id_binder, $id_document)
    {

        if (!empty($id_binder)) {
            if (!$this->checkVaultBinder($id_binder)) {

                throw new VeevaException(
                    'Document Not Found
                        You may have reached this page for one of the following reasons: 
                        
                        You do not have permission to view this document.
                        The URL was incorrect.
                        The document has been deleted or does not exist in this vault.
                        
                        Check the link you used or	contact your administrator if you feel you have reached this page in error.'
                );
            }
        }
        if (!empty($id_document)) {
            if (!$this->checkVaultDocument($id_document)) {

                throw new VeevaException(
                    'Document Not Found
                        You may have reached this page for one of the following reasons: 
                        
                        You do not have permission to view this document.
                        The URL was incorrect.
                        The document has been deleted or does not exist in this vault.
                        
                        Check the link you used or	contact your administrator if you feel you have reached this page in error.'
                );
            }
        }
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $version = $this->DocumentDetails($id_document);

            $major_version = $version->document->major_version_number__v;
            $minor_version = $version->document->minor_version_number__v;

            $client = new Client();
            try {
                $result = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$id_binder.'/documents',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],
                        'form_params' => [
                            'document_id__v' => $id_document,
                            'major_version_number__v' => $major_version,
                            'minor_version_number__v' => $minor_version,

                        ],

                    ]
                );


                return $result;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /***
     * @param $create_doc
     * @param $move_doc
     * @return Response
     */
    public function PromiseCreateMoveDocumentToBinder($create_doc, $move_doc)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {

            $promises = [
                'createDoc' => $create_doc,
                'moveDoc' => $move_doc,
            ];
            try {
                $result = \GuzzleHttp\Promise\any($promises)->then(
                    function ($value) {
                    }
                );
                $result->wait();
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }


    /***
     * @param $type
     * @return mixed
     */
    public function CustomFieldType($type)
    {


        switch ($type) {
            case 'ExactMatchString':
            case 'String':
            case 'URL':
                $opt = TextType::class;
                break;
            case 'Autonumber':
            case 'Number':
                $opt = NumberType::class;
                break;
            case 'Picklist':
            case 'ObjectReference':
                $opt = ChoiceType::class;
                break;
            case 'DateTime':
            case 'Date':
                $opt = DateType::class;
                break;
            case 'Boolean':
                $opt = ChoiceType::class;
                break;
        }

        return $opt;
    }

    /***
     * @param $array
     * @param $key
     * @return array
     */
    public function _group_by($array, $key)
    {
        $return = array();
        foreach ($array as $val) {
            $return[$val[$key]][] = $val;
        }

        return $return;
    }


    /***
     * @param array $array
     * @param $key
     * @return array|null
     */
    public function array_group_by(array $array, $key)
    {
        if (!is_string($key) && !is_int($key) && !is_float($key) && !is_callable($key)) {
            trigger_error('array_group_by(): The key should be a string, an integer, or a callback', E_USER_ERROR);

            return null;
        }
        $func = (!is_string($key) && is_callable($key) ? $key : null);
        $_key = $key;
        // Load the new array, splitting by the target key
        $grouped = [];
        foreach ($array as $value) {
            $key = null;
            if (is_callable($func)) {
                $key = call_user_func($func, $value);
            } elseif (is_object($value) && isset($value->{$_key})) {
                $key = $value->{$_key};
            } elseif (isset($value[$_key])) {
                $key = $value[$_key];
            }
            if ($key === null) {
                continue;
            }
            $grouped[$key][] = $value;
        }
        // Recursively build a nested grouping if more parameters are supplied
        // Each grouped array value is grouped according to the next sequential key
        if (func_num_args() > 2) {
            $args = func_get_args();
            foreach ($grouped as $key => $value) {
                $params = array_merge([$value], array_slice($args, 2, func_num_args()));
                $grouped[$key] = call_user_func_array('array_group_by', $params);
            }
        }

        return $grouped;
    }

    /***
     * @param $name_machine
     * @return mixed|string|Response
     */
    public function NameType($name_machine)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/metadata/objects/documents',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );

                $obj = $response->getBody()->getContents();
                $documents = json_decode($obj);

                $types = !empty($documents->types) ? $documents->types : '';
                $array = array();
                if (!empty($types)) {
                    foreach ($types as $type) {
                        $value = substr($type->value, 87);
                        $array[$value] = $type->label;
                    }
                }

                return !empty($array[$name_machine]) ? $array[$name_machine] : '';
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /***
     * @param $steps
     * @return array|string
     */
    public function GetDataStepes($steps)
    {
        $data = array();
        $session = new Session();
        $current_path = $this->ParseCleanUrl();
        $id_binder = $this->container->get('request')->get('id_binder');
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        $typeZipPdf = $this->getTypeFromPath();
        $em = $this->container->get('doctrine')->getManager();
        if (!empty($steps)) {
            foreach ($steps as $key => $step) {
                if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                    $idPress = $current_path[2];
                    if ($id_binder && $step->getNumber() != 2) {
                        $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres(
                            $idPress
                        );

                        /**Test Zip In S3**/
                        $countZip = $this->ZipExist($id_rev);

                        $data_doc_zip = array();
                        foreach ($countZip as $keyZip => $zip) {
                            if (!empty($session->get(
                                'data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step->getNumber(
                                ).'_veeva_zip_doc_'.$keyZip.'_'.$idPress
                            ))
                            ) {
                                $data_doc_zip[] = $session->get(
                                    'data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step->getNumber(
                                    ).'_veeva_zip_doc_'.$keyZip.'_'.$idPress
                                );
                            }
                        }
                        $data[$key] = $data_doc_zip;
                    } else {
                        $data[$key] = $session->get(
                            'data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step->getNumber().'_'.$idPress
                        );
                    }


                }
            }

            if (!empty($data[1]) && !empty($data[2])) {
                if ($id_binder) {
                    foreach ($data[2] as $key => $document) {
                        $array[] = array_merge($data[1], $document);
                    }
                    $data_sent = $array;
                    /**get Name type binder
                     * params name machine**/
                    if (!empty($data_sent)) {

                        foreach ($data_sent as $key => $dts) {
                            if ($data_sent[$key]['_token']) {
                                unset($data_sent[$key]['_token']);
                            }
                            /***end****/
                            $document_type = $this->NameType($data_sent[$key]['type__v']);
                            $data_sent[$key]['type__v'] = $document_type;
                            //@todo
                            /**unset other information from data sent***/
                            /**non-editable property**/
                            unset($data_sent[$key]['approved_for_production_date__vs']);
                            unset($data_sent[$key]['approved_for_distribution_date__vs']);
                            unset($data_sent[$key]['mlr_cycle_count__vs']);
                            /***end****/
                        }
                    }
                } else {
                    $data_sent = array_merge($data[1], $data[2]);
                    /**get Name type binder
                     * params name machine**/
                    if (!empty($data_sent)) {
                        /**unset token from array data sent***/
                        if ($data_sent['_token']) {
                            unset($data_sent['_token']);
                        }
                        /***end****/
                        $document_type = $this->NameType($data_sent['type__v']);
                        $data_sent['type__v'] = $document_type;
                        //@todo
                        /**unset other information from data sent***/
                        /**non-editable property**/
                        unset($data_sent['approved_for_production_date__vs']);
                        unset($data_sent['approved_for_distribution_date__vs']);
                        unset($data_sent['mlr_cycle_count__vs']);
                        /***end****/
                    }

                }
            } elseif (!empty($data[1]) && empty($data[2])) {
                $data_sent = $data[1];
                /**get Name type binder
                 * params name machine**/
                if (!empty($data_sent)) {
                    /**unset token from array data sent***/
                    if ($data_sent['_token']) {
                        unset($data_sent['_token']);
                    }
                    /***end****/
                    $document_type = $this->NameType($data_sent['type__v']);
                    $data_sent['type__v'] = $document_type;
                    //@todo
                    /**unset other information from data sent***/
                    /**non-editable property**/
                    unset($data_sent['approved_for_production_date__vs']);
                    unset($data_sent['approved_for_distribution_date__vs']);
                    unset($data_sent['mlr_cycle_count__vs']);
                    /***end****/
                }

            }
        }

        return !empty($data_sent) ? $data_sent : '';
    }

    /***
     * @param $steps
     * @return array|string
     */
    public function GetDataStepesPdf($steps)
    {
        $data = array();
        $session = new Session();
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        $current_path = $this->ParseCleanUrl();
        $typeZipPdf = $this->getTypeFromPath();
        if (!empty($steps)) {
            foreach ($steps as $key => $step) {
                if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                    $idPress = $current_path[2];
                    if (!empty($session->get(
                        'data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step->getNumber().'_'.$idPress
                    ))
                    ) {
                        $data[$key] = $session->get(
                            'data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step->getNumber().'_'.$idPress
                        );
                    }
                }
            }
            if (!empty($data[1]) && !empty($data[2])) {
                $data_sent = array_merge($data[1], $data[2]);
            } elseif (!empty($data[1]) && empty($data[2])) {
                $data_sent = $data[1];
            }
        }

        /**get Name type binder
         * params name machine**/
        if (!empty($data_sent)) {
            /**unset token from array data sent***/
            if ($data_sent['_token']) {
                unset($data_sent['_token']);
            }
            /***end****/
            $document_type = $this->NameType($data_sent['type__v']);
            $data_sent['type__v'] = $document_type;
            //@todo
            /**unset other information from data sent***/
            /**non-editable property**/
            unset($data_sent['approved_for_production_date__vs']);
            unset($data_sent['approved_for_distribution_date__vs']);
            unset($data_sent['mlr_cycle_count__vs']);
            /***end****/
        }

        /**end**/
        return !empty($data_sent) ? $data_sent : '';
    }

    /**
     * @return array
     */
    public function ParseCleanUrl()
    {
        $request = Request::createFromGlobals();
        $path = $request->getPathInfo();
        $urlPathParts = explode('/', ltrim(parse_url($path, PHP_URL_PATH), '/'));

        return $urlPathParts;
    }

    /**
     * @param $id_press
     * @return mixed
     * @throws \Throwable
     */
    public function existeBinder($id_press)
    {
        $typeVeeva = ($this->getPathType()) ? $this->getPathType() : '';
        $em = $this->container->get('doctrine')->getManager();
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
        $is_binder = $em->getRepository('VeevaVaultBundle:Veeva')->getExistBinder($presentation, $typeVeeva);

        return $is_binder;
    }

    /**
     * @return string
     * @return type zip or pdf
     */
    public function getPathType()
    {
        $current_path = $this->ParseCleanUrl();
        if (!empty($current_path[1]) && $current_path[1] == 'dashboard-vault-zip') {
            $typeVeeva = 'zip';
        } elseif (!empty($current_path[1]) && $current_path[1] == 'dashboard-vault-pdf') {
            $typeVeeva = 'pdf';
        } else {
            $typeVeeva = '';
        }

        return $typeVeeva;
    }

    /**
     * @return string
     * @return type zip or pdf
     */
    public function getTypeFromPath()
    {
        $current_path = $this->ParseCleanUrl();
        if (!empty($current_path[1]) && $current_path[1] == 'zip-veeva-steps') {
            $typeVeeva = 'zip';
        } elseif (!empty($current_path[1]) && $current_path[1] == 'pdf-veeva-steps') {
            $typeVeeva = 'pdf';
        } else {
            $typeVeeva = '';
        }

        return $typeVeeva;
    }

    /**
     * @param $id_press
     * @return mixed
     * @throws \Throwable
     */
    public function existeBinders($id_press)
    {
        /**Get current company user vault**/
        $dataUser = $this->currentUserDetailsAction();
        if ($dataUser->responseStatus == "SUCCESS") {
            $idCompanyVault = $dataUser->users[0]->user->vault_id__v[0];
        }

        $typeVeeva = ($this->getPathType()) ? $this->getPathType() : '';
        $em = $this->container->get('doctrine')->getManager();
        $presentation = $em->getRepository('PresentationBundle:Presentation')->find($id_press);
        $is_binder = $em->getRepository('VeevaVaultBundle:Veeva')->getExistBinders(
            $presentation,
            $typeVeeva,
            $idCompanyVault
        );

        return $is_binder;
    }

    /**
     * @param $idBinder
     * @return array|Response
     * @throws \Throwable
     * Return Id document
     */
    public function getDocByBinder($idBinder)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$idBinder,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],
                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    if (isset($options['binder'])) {
                        $documents = $options['binder']['nodes'];
                        if (!empty($documents)) {
                            $arrayDocs = array();
                            foreach ($documents as $key => $document) {
                                $arrayDocs[] = $document['properties']['document_id__v'];
                            }
                        }
                    }

                    return !empty($arrayDocs) ? $arrayDocs : '';
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }

    }

    /**
     * @param $idBinder
     * @return array|Response
     * @throws \Throwable
     * Return Id document
     */
    public function getSharedByBinder($idBinder)
    {
        if (!empty($idBinder)) {
            if (!$this->checkVaultBinder($idBinder)) {

                throw new VeevaException(
                    'Document Not Found
                        You may have reached this page for one of the following reasons: 
                        
                        You do not have permission to view this document.
                        The URL was incorrect.
                        The document has been deleted or does not exist in this vault.
                        
                        Check the link you used or	contact your administrator if you feel you have reached this page in error.'
                );
            }
        }

        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$idBinder,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],
                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    if (isset($options['binder'])) {
                        $documents = $options['binder']['nodes'];
                        if (!empty($documents)) {
                            $arrayDocs = array();
                            foreach ($documents as $key => $document) {
                                if (substr($document['properties']['name__v'], 0, 6) == 'shared' && substr($document['properties']['name__v'], 6, 2) == '__') {
                                    $arrayDocs = $document['properties']['id'];
                                }
                            }
                        }
                    }

                    return !empty($arrayDocs) ? $arrayDocs : '';
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }

    }

    /**
     * @param $idBinder
     * @return array|Response
     * @throws \Throwable
     * Return Id document
     */
    public function getCodeDocByBinder($idBinder)
    {

        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$idBinder,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],
                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    $documents = $options['binder']['nodes'];
                    if (!empty($documents)) {
                        $arrayDocs = array();
                        foreach ($documents as $key => $document) {
                            $arrayDocs[] = $this->DocumentCodeDetails($document['properties']['document_id__v']);
                        }
                    }

                    return !empty($arrayDocs) ? $arrayDocs : '';
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }

    }

    /***
     * @param $data
     * @param array $file
     * @return mixed|\Psr\Http\Message\ResponseInterface|Response
     */

    public function addNewVersionDocument($data, $file = array(), $idDoc)
    {

        if (!empty($idDoc)) {
            if (!$this->checkVaultDocument($idDoc)) {

                throw new VeevaException(
                    'Document Not Found
                        You may have reached this page for one of the following reasons: 
                        
                        You do not have permission to view this document.
                        The URL was incorrect.
                        The document has been deleted or does not exist in this vault.
                        
                        Check the link you used or	contact your administrator if you feel you have reached this page in error.'
                );
            }
        }
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            $array_merge = array_merge(
                $file,
                $data
            );

            $checkOutDoc = $this->checkOutDocument($idDoc);

            if ($checkOutDoc->responseStatus = "SUCCESS") {
                /** @var \GuzzleHttp\Client $client */
                $user = $this->container->get('security.context')->getToken()->getUser();
                $company = $user->getCompany();
                $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
                $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

                $client = new Client();
                try {
                    $response = $client->request(
                        'POST',
                        $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$idDoc,
                        [
                            'headers' => [
                                'Authorization' => $sessionId,
                            ],
                            'multipart' => $array_merge,
                        ]
                    );

                    return $response;
                } catch (BadResponseException $e) {
                    trigger_error($e->getMessage());
                }
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $idDoc
     * @return mixed|Response
     * @throws \Throwable
     * This Function verify if exist attachment
     */
    public function checkOutDocument($idDoc)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->request(
                    'POST',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$idDoc.'/lock',
                    [
                        'headers' => [
                            'Content-Type' => 'application/x-www-form-urlencoded',
                            'Authorization' => $sessionId,
                        ],

                    ]
                );

                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }

                return $options;
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $id_rev
     * @return array
     */

    public function ZipExist($id_rev)
    {
        $em = $this->container->get('doctrine')->getManager();
        $s3Folder = $em->getRepository('PresentationBundle:Revision')->getS3FolderVeevaByRev($id_rev);

        $rev = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
        $idPres = $rev->getPresentation()->getId();

        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company = $presService->recursiveFindParent($pres->getCompany()->getId());


        /** @var AwsMedia $awsConfig */
        $awsConfig = $this->container->get('mcm.aws_media');
        $s3Client = $awsConfig->getS3Client();
        $args = array(
            'Bucket' => $awsConfig->expectedBucketName,
            'Prefix' => $company->getName().'/zip/veeva-wide/'.$s3Folder['dataFolderVeevaS3'].'_vault',
        );


        $list = $s3Client->getIterator('ListObjects', $args);
        $output = array();
        foreach ($list as $elt) {
            $key = $elt['Key'];

            $PathDirectory = explode('/', $key);
            $pos = sizeof($PathDirectory) - 1;
            $PathDirectory[$pos];
            $output[] = array(
                'path' => 'https://s3-eu-west-1.amazonaws.com/'.$awsConfig->expectedBucketName.'/'.$key,
                'fileName' => preg_replace('/\\.[^.\\s]{3,4}$/', '', $PathDirectory[$pos]),
            );
        }
        sort($output);

        return $output;

    }


    /**
     * @param $text
     * @return mixed|string
     */
    public function slugifyZip($text)
    {
        // replace non letter or digits by _
        $text = preg_replace('~[^\pL\d]+~u', '_', $text);
        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);
        // trim
        $text = trim($text, '-');
        // remove duplicate _
        $text = preg_replace('~-/+~', '_', $text);
        // lowercase
        $text = strtolower($text);
        // delete whitespaces
        $text = preg_replace('#(\s)#', '', $text);

        return $text;
    }

    /**
     * @param $name
     * @return string
     * Trait Expression de type 2809_Presentation_04_01 or shared_1506596814
     */
    public function cleanZipName($name)
    {
        if (preg_match('/_/', $name)) {
            $nameZip = explode('_', $name);
            if (!empty($nameZip[1]) && $nameZip[1] == 'Presentation') {
                $name = $nameZip[1].' '.$nameZip[2];
            } else {
                $name = $nameZip[0];
            }
        } else {
            $name = 'Title';
        }

        return $name;
    }

    /**
     * @param $key
     * @return mixed|string
     * @throws \Throwable
     */
    public function getNameCountryByKey($key)
    {
        $sessionId = $this->token_instance();
        if ($sessionId) {
            $client = new Client();
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            try {
                $response_country = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/vobjects/country__v',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_country)) {
                    $country = @json_decode(
                        $response_country->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    $countrys = (isset($country->data)) ? $country->data : '';
                    $opts_country = array();
                    if (!empty($countrys)) {
                        foreach ($countrys as $country) {
                            $opts_country[$country->id] = $country->name__v;
                        }
                    } else {
                        return 'No country found.';
                    }

                    return $opts_country[$key];
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

        }
    }

    /**
     * @param $key
     * @return mixed|string
     * @throws \Throwable
     */
    public function getNameProductByKey($key)
    {
        $sessionId = $this->token_instance();
        if ($sessionId) {
            $client = new Client();
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            try {
                $response_country = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/vobjects/product__v',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_country)) {
                    $country = @json_decode(
                        $response_country->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    $countrys = (isset($country->data)) ? $country->data : '';
                    $opts_country = array();
                    if (!empty($countrys)) {
                        foreach ($countrys as $country) {
                            $opts_country[$country->id] = $country->name__v;
                        }
                    } else {
                        return 'No country found.';
                    }

                    return $opts_country[$key];
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

        }
    }

    /**
     * @param $idBinder
     * @return array|Response
     * @throws \Throwable
     * Return Id document
     */
    public function getSharedIdByBinder($idBinder)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$idBinder,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],
                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    if (isset($options['binder'])) {
                        $documents = $options['binder']['nodes'];
                        if (!empty($documents)) {
                            $arrayDocs = array();
                            foreach ($documents as $key => $document) {
                                if (substr($document['properties']['name__v'], 0, 6) == 'shared' && substr($document['properties']['name__v'], 6, 2) == '__') {
                                    $arrayDocs = $document['properties']['document_id__v'];
                                }
                            }
                        }
                    }

                    return !empty($arrayDocs) ? $arrayDocs : '';
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }

    }

    /**
     * @param $idDoc
     * @param $data
     * @return bool|mixed|\Psr\Http\Message\ResponseInterface
     * @throws \Throwable
     */
    public function updateDocument($idDoc, $data)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {

            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $res = $client->request(
                    'PUT',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$idDoc,
                    [
                        'headers' => [
                            'Authorization' => $sessionId,
                            'Content-Type' => 'application/x-www-form-urlencoded',
                        ],
                        'form_params' => $data
                        ,
                    ]
                );

                if (!empty($res)) {
                    $options = @json_decode(
                        $res->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
                if ($options->responseStatus == "FAILURE") {
                    return false;
                } else {
                    return $res;
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @return mixed|Response
     */
    public function currentUserDetailsAction()
    {
        $sessionId = $this->token_instance();

        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/users/me',
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],

                    ]
                );
                $body = $response->getBody();

                return json_decode($body);
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $idBinder
     * @return mixed
     * @throws \Throwable
     */
    public function checkVaultBinder($idBinder)
    {
        $sessionId = $this->token_instance();

        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/binders/'.$idBinder,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],

                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }

                if ($options['responseStatus'] == 'SUCCESS') {
                    return true;
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @param $idDocument
     * @return mixed
     * @throws \Throwable
     */
    public function checkVaultDocument($idDocument)
    {
        $sessionId = $this->token_instance();

        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response = $client->request(
                    'GET',
                    $veevaUrl.'/api/'.$veevaApi.'/objects/documents/'.$idDocument,
                    [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => $sessionId,
                        ],

                    ]
                );
                if (!empty($response)) {
                    $options = @json_decode(
                        $response->getBody()->getContents(),
                        true,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }

                if ($options['responseStatus'] == 'SUCCESS') {
                    return true;
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
        } else {
            throw new VeevaException('This user does not have access to this page. Verify your Vault connection.');
        }
    }

    /**
     * @return array
     * @throws \Throwable
     */
    public function getCountryVault()
    {

        $sessionId = $this->token_instance();

        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();
            try {
                $response_country = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/vobjects/country__v',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_country)) {
                    $country = @json_decode(
                        $response_country->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
            $countrys = $country->data;
            $opts_country = array();
            if (!empty($countrys)) {
                foreach ($countrys as $country) {
                    $opts_country[$country->id] = $country->name__v;
                }
            } else {
                $opts_country = array('no_data_found' => 'No Data Found');
            }

            return $opts_country;

        }
        /**End**/
    }

    /**
     * @return array
     * @throws \Throwable
     */
    public function getProductVault()
    {

        $sessionId = $this->token_instance();

        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

            $client = new Client();

            try {
                $response_product = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/vobjects/product__v',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_product)) {
                    $product = @json_decode(
                        $response_product->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
            $products = $product->data;
            $opts_product = array();
            if (!empty($products)) {
                foreach ($products as $product) {

                    $opts_product[$product->id] = $product->name__v;
                }
            } else {
                $opts_product = array('no_data_found' => 'No Data Found');
            }

            return $opts_product;
        }
        /**End**/
    }

    /**
     * @param $idUser
     * @return mixed
     * @throws \Throwable
     */
    public function getUsreDataById($idUser)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response_product = $client->get(
                    $veevaUrl.'/api/'.$veevaApi."/query?q=SELECT user_first_name__v, user_last_name__v FROM users WHERE id=".$idUser,
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_product)) {
                    $user = @json_decode(
                        $response_product->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

            return $user;
        }
    }

    /**
     * @param $idUser
     * @return mixed
     * @throws \Throwable
     */
    public function getCompanyFromCurrentVaultUser($idUser = null)
    {
        if ($idUser == null) {
            $dataUser = $this->currentUserDetailsAction();
            if ($dataUser->responseStatus == "SUCCESS") {
                $idUser = $dataUser->users[0]->user->id;
            }
        }
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response_product = $client->get(
                    $veevaUrl.'/api/'.$veevaApi."/query?q=SELECT vault_id__v FROM users WHERE id=".$idUser,
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_product)) {
                    $company = @json_decode(
                        $response_product->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }
            if ($company->responseStatus == "SUCCESS" && !empty($company->data[0]->vault_id__v)) {
                return $company->data[0]->vault_id__v;
            } else {
                return 'company not found';
            }

        }
    }

    /**
     * @param $type
     * @param $id
     * @return mixed
     * @throws \Throwable
     */
    public function ifAccessBinderOrDoc($type, $id)
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/'.$veevaApi."/objects/".$type."/".$id."/roles",
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response)) {
                    $access = @json_decode(
                        $response->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

            return $access;

        }
    }

    /**
     * @throws \Throwable
     */
    public function retrieveAllSupportedVersionsVault()
    {
        $sessionId = $this->token_instance();
        if (!empty($sessionId)) {
            /** @var \GuzzleHttp\Client $client */
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $client = new Client();
            try {
                $response = $client->get(
                    $veevaUrl.'/api/',
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response)) {
                    $access = @json_decode(
                        $response->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }


        }
    }

    /**
     * @param int $idRev
     * @param string $clm
     * @param string $type
     * @param Request $request
     *
     * @return BinaryFileResponse|Response
     */
    public function rendVeevaZip($idRev, $clm, $type, Request $request)
    {

        $em = $this->container->get('doctrine')->getManager();
        /** @var Revision $rev */
        $rev = $em->getRepository('PresentationBundle:Revision')->find($idRev);
        $idPres = $rev->getPresentation()->getId();
        /** @var Presentation $pres */
        $pres = $em->getRepository('PresentationBundle:Presentation')->find($idPres);
        $env = $this->container->get('app.env_by_client')->getEnvByClient();
        $currentUrl = $request->getSchemeAndHttpHost();
        $veevaWide = $this->container->get('zip.veeva_wide_S3');
        $presService = $this->container->get('service.argomcmbuilder_presentation.presentation');
        $company = $presService->recursiveFindParent($pres->getCompany()->getId());
        $catcher = new Catcher();
        set_error_handler(array($catcher, 'exceptionsErrorHandler'));
        try {
            switch ($clm) {
                case 'veeva':
                    switch ($type) {
                        case 'wide':
                            $veevaWide->zip($pres, $rev, $env[$currentUrl], $company->getName(), 'vault');
                            break;
                    }
                    break;
            }

        } catch (\Exception $e) {
            if (!empty($veevaWide->errors)) {
                trigger_error($veevaWide->errors);
            } else {
                trigger_error($e->getMessage());
            }
        }

    }

    /**
     * @param $array
     * @return array
     */
    public function cleanArrayToSendVault($array)
    {
        $cleanArray = array();
        if (is_array($array) && !empty($array)) {
            foreach ($array as $key => $item) {
                if (is_array($item)) {
                    $cleanArray[$key] = implode(",", array_values($item));
                } else {
                    $cleanArray[$key] = $item;
                }

            }
        }

        return $cleanArray;
    }
}
