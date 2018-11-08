<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Twig\Extension;

use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use GuzzleHttp\Client;


class VeevaCleanWordExtension extends \Twig_Extension
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * Constructor
     *
     * @param ContainerInterface $container
     */
    public function __construct($container)
    {
        $this->container = $container;

    }

    /**
     * Return the functions registered as twig extensions.
     *
     * @return array
     */
    public function getFunctions()
    {

        return array(
            'veeva_clean_word' => new \Twig_Function_Method($this, 'veeva_clean_word'),
        );

    }

    public function veeva_clean_word($key, $endPoint)
    {

        $helper = $this->container->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        if ($sessionId) {
            $client = new Client();
            $user = $this->container->get('security.context')->getToken()->getUser();
            $company = $user->getCompany();
            $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
            $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';
            try {
                $response_options = $client->get(
                    $veevaUrl.'/api/'.$veevaApi.'/vobjects/'.$endPoint,
                    [
                        'headers' => ['Authorization' => $sessionId],
                    ]
                );
                if (!empty($response_options)) {
                    $reponse = @json_decode(
                        $response_options->getBody()->getContents(),
                        false,
                        512,
                        JSON_BIGINT_AS_STRING
                    );
                    $options = (isset($reponse->data)) ? $reponse->data : '';
                    $opts_ = array();
                    if (!empty($options)) {
                        foreach ($options as $option) {
                            $opts_[$option->id] = $option->name__v;
                        }
                    } else {
                        return false;
                    }

                    $vars = '';
                    if (strpos($key, ',') == true) {
                        $vars = explode(',', $key);
                    }
                    if (!empty($vars)) {
                        $output = '';
                        foreach ($vars as $var) {
                            $output .= $opts_[$var].',';
                        }

                        return $output;
                    } else {
                        return $opts_[$key];
                    }
                }
            } catch (BadResponseException $e) {
                trigger_error($e->getMessage());
            }

        }

    }

    public function getName()
    {
        return 'twig_veeva_clean_word_extension';
    }
}
