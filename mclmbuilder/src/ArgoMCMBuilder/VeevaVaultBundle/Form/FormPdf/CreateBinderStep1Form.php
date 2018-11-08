<?php
/**
 * Created by PhpStorm.
 * User: argo
 * Date: 31/03/17
 * Time: 11:20
 */
namespace ArgoMCMBuilder\VeevaVaultBundle\Form\FormPdf;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\OptionsResolver\OptionsResolver;
use GuzzleHttp\Client;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use ClassesWithParents\F;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use EightPoints\Bundle\GuzzleBundle\GuzzleBundle;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\RadioType;
/*use Symfony\Component\Validator\Constraints\False;*/
use ArgoMCMBuilder\PresentationBundle\Entity\Presentation;
use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
use GuzzleHttp\Exception\BadResponseException;


/***
 * Class CreateBinderStep1Form
 * @package AppBundle\Form
 */
class CreateBinderStep1Form extends AbstractType
{
    private $em;
    private $container;

    /*
     * construct
     */
    public function __construct($em, $container)
    {
        $this->em = $em;
        $this->container = $container;

    }

    /***
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $helper = $this->container->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        $current_path = $helper->ParseCleanUrl();
        $session = new Session();
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        $company = $user->getCompany();
        $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
        $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
        $typeZipPdf = $helper->getTypeFromPath();
        $idPress = $this->container->get('request')->get('id_press');
        /**Get Current Presentation Data**/

        $idPress = $this->container->get('request')->get('id_press');
        if (!empty($idPress)) {
            $em = $this->em;
            $presRep = $em->getRepository('PresentationBundle:Presentation');
            $productsId = $presRep->find($idPress);
        }
        /**End**/
        switch ($options['flow_step']) {
            case 1:
                if (!empty($sessionId)) {
                    $options_ = array();
                    $document_type = $helper->DocumentTypes();
                    $types = !empty($document_type->types) ? $document_type->types : '';
                    if (!empty($types)) {
                        foreach ($types as $type) {
                            $type_path = explode('/', ltrim(parse_url($type->value, PHP_URL_PATH), '/'));
                            $position = sizeof($type_path) - 1;
                            $value = $type_path[$position];
                            $options_[$value] = $type->label;
                            $subTypes = $helper->DocumentSubTypes($value);
                            /**Get subtypes doc**/
                            if (isset($subTypes->subtypes) && !empty($subTypes->subtypes)) {
                                /**unset option parent type**/
                                if (!empty($options_[$subTypes->name])) {
                                    unset($options_[$subTypes->name]);
                                }
                                foreach ($subTypes->subtypes as $subtype) {
                                    $PathSubtype = explode('/', ltrim(parse_url($subtype->value, PHP_URL_PATH), '/'));
                                    $pos = sizeof($PathSubtype) - 1;
                                    $valueSubType = $PathSubtype[$pos];
                                    $options_[$value.'/subtypes/'.$valueSubType] = $subTypes->label.' > '.$subtype->label;
                                }
                            }
                        }
                    }
                }
                $default_value_type = '';
                if (!empty($options_)) {
                    $opt = $options_;
                    $id_binder = $this->container->get('request')->get('id_binder');
                    if (empty($id_binder)) {
                        if (array_key_exists('promotional_piece__vs', $opt)) {
                            $default_value_type = 'promotional_piece__vs';
                        } else {
                            $default_value_type = '';
                        }
                    } else {
                        if (array_key_exists('promotional_piece__vs', $opt)) {
                            $default_value_type = 'promotional_piece__vs';
                        } else {
                            $default_value_type = '';
                        }
                    }
                    /**unset option parent type**/
                    unset($opt['base_document__v']);
                } else {
                    $opt = array('no_data_found' => 'No data found');
                    $session->remove('TokenUserVeeva');
                }
                $step = $options['flow_step'] + 1;
                if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                    $idPress = $current_path[2];
                    $data = $session->get('data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step.'_'.$idPress);
                }
                $builder->add(
                    'type__v',
                    ChoiceType::class,
                    array(
                        'choices' => array(
                            'Please Select' => $opt,
                        ),
                        'data' => $default_value_type,
                        'mapped' => false,
                        'label' => 'Type *:',
                        'attr' => array('class' => 'form-control'),
                        'help' => 'Search for and select a document type, subtype, or classification',
                    )
                );
                $builder->add(
                    'name__v',
                    TextType::class,
                    array(
                        'attr' => array('class' => 'form-control'),
                        'data' => !empty($data['name__v']) ? $data['name__v'] : $productsId->getName(),
                        'mapped' => false,
                        'label' => 'Name *:',
                        'attr' => array('class' => 'form-control', 'maxlength' => '100'),
                    )
                );
                break;
            case 2:
                if (!empty($sessionId)) {
                    if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                        $idPress = $current_path[2];
                        $session_redirect_url = $session->get('redirect_url_pdf_'.$idPress);

                    }

                    if (!empty($session_redirect_url) || !empty($options['redirect_url'])) {
                        if (!empty($options['redirect_url'])) {
                            if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                                $idPress = $current_path[2];
                                $session->set('redirect_url_pdf_'.$idPress, $options['redirect_url']);
                            }

                        }

                        $redirect_url = !empty($options['redirect_url']) ? $options['redirect_url'] : $session_redirect_url;
                        $client = new Client();
                        try {
                            $response = $client->get(
                                $veevaUrl.'/api/'.$veevaApi.'/metadata/objects/documents/types/'.$redirect_url,
                                [
                                    'headers' => ['Authorization' => $sessionId],
                                ]
                            );
                        } catch (BadResponseException $e) {
                            trigger_error($e->getMessage());
                        }
                    }

                    /** @var \GuzzleHttp\Client $client */
                    if (!empty($response)) {
                        $data = @json_decode($response->getBody()->getContents(), false, 512, JSON_BIGINT_AS_STRING);

                    }

                    /**Get Binder Life Cycle**/
                    if (isset($data->availableLifecycles) && !empty($data->availableLifecycles)) {
                        $arrays_lifecycle = $data->availableLifecycles;

                        $options_lifecycle = array();
                        foreach ($arrays_lifecycle as $array_lifecycle) {
                            $options_lifecycle = $array_lifecycle->label;
                        }

                        $builder->add(
                            'veeva_life_cycle_binder',
                            'fieldset',
                            [
                                'label' => false, // You probably don't want a label as well as a legend.
                                'legend' => 'Life Cycle Binder',
                                'fields' => function (FormBuilderInterface $builder) use ($options_lifecycle) {
                                    $builder->add(
                                        'lifecycle__v',
                                        TextType::class,
                                        array(
                                            'mapped' => false,
                                            'label' => 'Life Cycle *:',
                                            'data' => !empty($options_lifecycle) ? $options_lifecycle : '',
                                            'attr' => array(
                                                'class' => 'form-control',
                                            ),
                                            'read_only' => true,
                                        )

                                    );
                                },
                            ]
                        );
                    }
                    /**End**/
                    /**Get Country and Product (required in all type)**/
                    $step = $options['flow_step'] + 1;
                    if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                        $idPress = $current_path[2];
                        $default_value = $session->get(
                            'data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step.'_'.$idPress
                        );
                    }

                    /**GET ALL Product And Country from Vault */
                    $opts_country = $helper->getCountryVault();
                    $opts_product = $helper->getProductVault();
                    /**End**/

                    /**Get Country and Product selected of MCM**/
                    if ($productsId) {
                        $keyTerritory = $productsId->getTerritory()->getCode();
                        if (array_key_exists($keyTerritory, $opts_country)) {
                            $territoryMcm = $keyTerritory;
                        } else {
                            $territoryMcm = '';
                        }
                        $productsMcm = array();
                        if (!empty($productsId->getProducts())) {
                            foreach ($productsId->getProducts() as $product) {
                                $productsMcm[$product->getCode()] = $product->getName();
                            }
                            if (array_intersect($opts_product, $productsMcm)) {
                                $array_intersect = array_intersect($opts_product, $productsMcm);
                                $productIntersect = array_keys($array_intersect);
                            } else {
                                $productIntersect = array();
                            }
                        }


                    }


                    /**End**/

                    $builder->add(
                        'veeva_country_product_fieldset',
                        'fieldset',
                        [
                            'label' => false,
                            'legend' => 'General',
                            'fields' => function (FormBuilderInterface $builder) use (
                                $opts_country,
                                $opts_product,
                                $territoryMcm,
                                $productIntersect,
                                $default_value
                            ) {
                                $builder->add(
                                    'country__v',
                                    ChoiceType::class,
                                    array(
                                        'choices' => array(
                                            'Please Select' => $opts_country,
                                        ),
                                        'empty_data' => null,
                                        'empty_value' => "Choose here",
                                        'data' => !empty($default_value['country__v']) ? $default_value['country__v'] : $territoryMcm,
                                        'mapped' => false,
                                        'label' => 'Country *:',
                                        'attr' => array('class' => 'form-control'),
                                    )
                                );
                                $builder->add(
                                    'product__v',
                                    ChoiceType::class,
                                    array(
                                        'choices' => array(
                                            'Please Select' => $opts_product,
                                        ),
                                        'empty_data' => null,
                                        'empty_value' => "Choose here",
                                        'data' => $productIntersect,
                                        'mapped' => false,
                                        'multiple' => true,
                                        'label' => 'Product *:',
                                        'attr' => array('class' => 'form-control'),
                                    )
                                );
                            },
                        ]
                    );

                    /**End**/
                    if (isset($data->properties)) {

                        $properties = $data->properties;
                    }

                    $step = $options['flow_step'] + 1;
                    if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                        $idPress = $current_path[2];
                        $data = $session->get('data_steps_'.$typeZipPdf.'_'.$user->getId().'_'.$step.'_'.$idPress);
                    }


                    if (!empty($properties)) {
                        if (preg_match('/subtypes/', $redirect_url)) {
                            $subtypeLifeCycle = explode('/', ltrim(parse_url($redirect_url, PHP_URL_PATH), '/'));
                            if (!empty($subtypeLifeCycle)) {
                                $redirect_urlLifeCycle = $subtypeLifeCycle[0];
                                $params = $this->getSectionField($properties, $redirect_urlLifeCycle);
                                $section = $this->getSectionName($properties, $redirect_urlLifeCycle);
                            }
                        } else {
                            $params = $this->getSectionField($properties, $redirect_url);
                            $section = $this->getSectionName($properties, $redirect_url);
                        }

                    }


                    /**Get Section Name For FieldSet**/
                    if (!empty($section)) {
                        foreach ($section as $item) {
                            $legend = preg_split('/(?=[A-Z])/', $item);
                            if (!empty($legend[0]) && !empty($legend[1])) {
                                $legend = ucfirst($legend[0]).' '.ucfirst($legend[1]);
                            } else {
                                $legend = ucfirst($item);
                            }
                            $builder->add(
                                $item,
                                'fieldset',
                                [
                                    'label' => false, // You probably don't want a label as well as a legend.
                                    'legend' => $legend,
                                    'fields' => function (FormBuilderInterface $builder) use (
                                        $params,
                                        $helper,
                                        $item,
                                        $data,
                                        $client,
                                        $sessionId,
                                        $veevaUrl,
                                        $veevaApi
                                    ) {
                                        if (!empty($params)) {
                                            foreach ($params as $key => $propertie) {
                                                if ($propertie->section == $item) {
                                                    /**Add star if required field**/
                                                    if ($propertie->required == true) {
                                                        $star = '*';
                                                    } else {
                                                        $star = '';
                                                    }
                                                    /**Add Help text if exist**/
                                                    if (isset($propertie->helpContent) && !empty($propertie->helpContent)) {
                                                        $help = $propertie->helpContent;
                                                    } else {
                                                        $help = '';
                                                    }
                                                    if (isset($propertie->maxLength) && !empty($propertie->maxLength)) {
                                                        $maxLength = $propertie->maxLength;
                                                    } else {
                                                        $maxLength = '';
                                                    }
                                                    if (isset($propertie->type) && $propertie->type == "ObjectReference") {
                                                        try {
                                                            $response = $client->get(
                                                                $veevaUrl.'/api/'.$veevaApi.'/vobjects/'.$propertie->objectType,
                                                                [
                                                                    'headers' => ['Authorization' => $sessionId],
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
                                                        } catch (BadResponseException $e) {
                                                            trigger_error($e->getMessage());
                                                        }
                                                        $filed_label = $propertie->name;
                                                        $options = $options->data;
                                                        $opts = array();
                                                        if (!empty($options)) {
                                                            foreach ($options as $option) {

                                                                $opts[$option->id] = $option->name__v;
                                                            }
                                                        } else {
                                                            $opts = array('no_data_found' => 'No Data Found');
                                                        }

                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        if ($propertie->repeating == true) {
                                                            $multiple = true;
                                                        } else {
                                                            $multiple = false;
                                                        }
                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'choices' => array(
                                                                    'Please Select' => $opts,
                                                                ),
                                                                'mapped' => false,
                                                                'required' => $propertie->required,
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'multiple' => $multiple,
                                                                'attr' => array('class' => 'form-control'),
                                                                'help' => $help,
                                                            )
                                                        );

                                                    }

                                                    if (isset($propertie->type) && $propertie->type == "String") {
                                                        $filed_label = $propertie->name;
                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'mapped' => false,
                                                                'required' => $propertie->required,
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'data' => !empty($data[$filed_label]) ? $data[$filed_label] : '',
                                                                'attr' => array(
                                                                    'class' => 'form-control',
                                                                    'maxlength' => $maxLength,
                                                                ),
                                                                'invalid_message' => 'You entered an invalid value, it should include %string% ',
                                                                'invalid_message_parameters' => array('%string%' => 'String'),
                                                                'help' => $help,
                                                            )
                                                        );
                                                    }
                                                    if (isset($propertie->type) && $propertie->type == "URL") {
                                                        $filed_label = $propertie->name;
                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        if (!empty($propertie->defaultValue)) {
                                                            $default_value = $propertie->defaultValue;
                                                        } else {
                                                            $default_value = '';
                                                        }
                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'mapped' => false,
                                                                'required' => $propertie->required,
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'data' => !empty($data[$filed_label]) ? $data[$filed_label] : $default_value,
                                                                'attr' => array(
                                                                    'class' => 'form-control',
                                                                    'maxlength' => $maxLength,
                                                                ),
                                                                'invalid_message' => 'You entered an invalid value, it should include %string% ',
                                                                'invalid_message_parameters' => array('%string%' => 'String'),
                                                                'help' => $help,
                                                            )
                                                        );
                                                    }
                                                    if (isset($propertie->type) && $propertie->type == "Number") {
                                                        $filed_label = $propertie->name;
                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'mapped' => false,
                                                                'required' => $propertie->required,
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'data' => !empty($data[$filed_label]) ? $data[$filed_label] : null,
                                                                'attr' => array('class' => 'form-control'),
                                                                'invalid_message' => 'You entered an invalid value, it should include %num% ',
                                                                'invalid_message_parameters' => array('%num%' => 'Number'),
                                                                'help' => $help,
                                                            )
                                                        );
                                                    }
                                                    if (isset($propertie->type) && $propertie->type == "Date") {
                                                        $filed_label = $propertie->name;
                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'widget' => 'single_text',
                                                                'format' => 'yyyy-MM-dd',
                                                                'required' => $propertie->required,
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'data' => !empty($data[$filed_label]) ? new \DateTime(
                                                                    $data[$filed_label]
                                                                ) : new \DateTime('now'),
                                                                'attr' => array('class' => 'form-control'),
                                                                'help' => $help,

                                                            )
                                                        );
                                                    }
                                                    if (isset($propertie->type) && $propertie->type == "Picklist") {
                                                        $filed_label = $propertie->name;
                                                        $options = $propertie->entryLabels;
                                                        $opts = array();
                                                        foreach ($options as $option) {
                                                            $opts[$option] = $option;
                                                        }
                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        if ($propertie->repeating == true) {
                                                            $multiple = true;
                                                            $data = array();
                                                        } else {
                                                            $multiple = false;
                                                            $data = !empty($data[$filed_label]) ? $data[$filed_label] : '';
                                                        }

                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'choices' => array(
                                                                    'Please Select' => $opts,
                                                                ),
                                                                'mapped' => false,
                                                                'required' => $propertie->required,
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'data' => $data,
                                                                'multiple' => $multiple,
                                                                'attr' => array('class' => 'form-control'),
                                                                'help' => $help,
                                                            )
                                                        );
                                                    }
                                                    if (isset($propertie->type) && $propertie->type == "Boolean") {
                                                        $filed_label = $propertie->name;
                                                        $filed_type = $helper->CustomFieldType($propertie->type);
                                                        $builder->add(
                                                            $filed_label,
                                                            $filed_type,
                                                            array(
                                                                'label' => $propertie->label.' '.$star.':',
                                                                'choices' => array(
                                                                    'Please Select (Yes/No)' => array(
                                                                        'true' => 'Oui',
                                                                        'false' => 'Non',
                                                                    ),
                                                                ),
                                                                'multiple' => false,
                                                                'expanded' => false,
                                                                'mapped' => false,
                                                                'required' => $propertie->required,
                                                                'data' => !empty($data[$filed_label]) ? $data[$filed_label] : '',
                                                                'attr' => array('class' => 'form-control bool-controler'),
                                                                'help' => $help,
                                                            )
                                                        );
                                                    }
                                                }
                                            }
                                        }
                                    },
                                ]
                            );
                        }
                    }
                    /**End**/
                }
                break;
        }
    }

    /**
     * {@inheritdoc}
     */

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'redirect_url' => null,
                'allow_extra_fields' => true,
            )
        );
    }

    /***
     * @return string
     */
    public function getBlockPrefix()
    {
        return 'CreateBinderStep1';
    }

    /***
     * @param $a
     * @param $b
     * @return int
     * Sort By Section
     */
    public function cmpSection($a, $b)
    {
        return strcmp($b->section, $a->section);
    }

    /**
     * @param $properties
     * @param $redirect_url
     * @return array
     * Return Clean Section Name
     */
    public function getSectionName($properties, $redirect_url)
    {
        $array = array();
        if (!empty($properties)) {
            foreach ($properties as $key => $propertie) {
                if (!empty($propertie->section)) {
                    /**IF Field not hidden**/
                    if ($propertie->hidden == false) {
                        /**Get Field appaer in this content***/
                        $array_appear = array();
                        if (!empty($propertie->usedIn)) {
                            $values = $propertie->usedIn;
                            foreach ($values as $key => $value) {
                                $array_appear[] = $value->key;
                            }
                        }
                        /**END***/
                        /**If Filed Defined In this content Or Filed apper in this content**/
                        if ((!$propertie->disabled) && (!empty($propertie->definedIn) && $propertie->definedIn == $redirect_url) || ((!$propertie->disabled) && !empty($array_appear) && in_array(
                                    $redirect_url,
                                    $array_appear
                                ))
                        ) {
                            $array[] = $propertie->section;
                        }

                        if ((!$propertie->disabled) && empty($propertie->definedIn) && empty($array_appear)) {
                            $array[] = $propertie->section;
                        }
                    }
                }

            }
        }

        if (!empty($array)) {
            return array_unique($array);
        }
    }

    /**
     * @param $properties
     * @param $redirect_url
     * @return mixed
     */
    public function getSectionField($properties, $redirect_url)
    {
        $params = array();
        if (!empty($properties)) {
            /**Sort Array Data***/
            foreach ($properties as $key => $propertie) {
                /**IF Field not hidden**/
                if ($propertie->hidden == false) {
                    /**Get Field appaer in this content***/
                    $array_appear = array();
                    if (!empty($propertie->usedIn)) {
                        $values = $propertie->usedIn;
                        foreach ($values as $key => $value) {
                            $array_appear[] = $value->key;
                        }
                    }
                    /**END***/
                    /**If Filed Defined In this content Or Filed apper in this content**/

                    if ((!$propertie->disabled) && (!empty($propertie->definedIn) && $propertie->definedIn == $redirect_url) ||
                        ((!$propertie->disabled) && !empty($array_appear) && in_array(
                                $redirect_url,
                                $array_appear
                            ))
                    ) {

                        $params[] = $propertie;
                    }
                    if ((!$propertie->disabled) && empty($propertie->definedIn) && empty($array_appear)) {
                        $params[] = $propertie;
                    }
                }
            }
            /**Sort Array Data***/
            if (!empty($params)) {
                usort($params, array($this, "cmpSection"));
            }
        }

        return $params;
    }

}