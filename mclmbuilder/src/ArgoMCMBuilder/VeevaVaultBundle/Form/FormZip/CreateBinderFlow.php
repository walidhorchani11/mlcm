<?php
/**
 * Created by PhpStorm.
 * User: argo
 * Date: 31/03/17
 * Time: 11:20
 */

namespace ArgoMCMBuilder\VeevaVaultBundle\Form\FormZip;


use Craue\FormFlowBundle\Form\FormFlow;
use Craue\FormFlowBundle\Form\FormFlowEvents;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Craue\FormFlowBundle\Event\PostBindRequestEvent;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;

/**
 * Class CreateBinderFlow
 * @package AppBundle\Form
 */
class CreateBinderFlow extends FormFlow implements EventSubscriberInterface
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * {@inheritDoc}
     */
    protected function loadStepsConfig()
    {
        return array(
            array(
                'label' => 'Step 1',
                'form_type' => 'ArgoMCMBuilder\VeevaVaultBundle\Form\FormZip\CreateBinderStep1Form',
            ),

            array(
                'label' => 'Step 2',
                'form_type' => 'ArgoMCMBuilder\VeevaVaultBundle\Form\FormZip\CreateBinderStep1Form',
            ),
            array(
                'label' => 'confirmation',
            ),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getFormOptions($step, array $options = array())
    {
        $options = parent::getFormOptions($step, $options);
        $session = new Session();
        $helper = $this->container->get('veeva_vault.helper.tools');
        $current_path = $helper->ParseCleanUrl();
        $user = $this->container->get('security.token_storage')->getToken()->getUser();
        $type = $helper->getTypeFromPath();
        $em = $this->container->get('doctrine')->getManager();
        $id_binder = $this->container->get('request')->get('id_binder');
        if ($step === 2) {
            $array_data = $this->getRequest()->request->all();
            if (isset($array_data['CreateBinderStep1']['type__v'])) {
                $options['redirect_url'] = $array_data['CreateBinderStep1']['type__v'];
                /**Set Session Steps**/
                /**Get Current Presentation Data**/
                if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                    $idPress = $current_path[2];
                    $session->set(
                        'data_steps_'.$type.'_'.$user->getId().'_'.$step.'_'.$idPress,
                        $array_data['CreateBinderStep1']
                    );
                    /**Generate Zip S3**/
                    if ($id_binder) {
                        $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres(
                            $idPress
                        );
                        $helper->rendVeevaZip($id_rev, 'veeva', 'wide', $this->getRequest());
                    }
                }
                /**end**/

            }

        }
        if ($step > 2) {

            $array_data = $this->getRequest()->request->all();

            if (isset($array_data['CreateBinderStep1'])) {
                /**unset token from array data sent***/
                unset($array_data['CreateBinderStep1']['_token']);


                /***end****/
                if ($id_binder) {
                    foreach ($array_data['CreateBinderStep1'] as $key => $data) {
                        $array = array();
                        foreach ($data as $key2 => $val) {
                            $array = array_merge($array, $data[$key2]);
                        }
                        $cleanArray = $helper->cleanArrayToSendVault($array);
                        if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                            $idPress = $current_path[2];
                            $session->set(
                                'data_steps_'.$type.'_'.$user->getId().'_'.$step.'_'.$key.'_'.$idPress,
                                $cleanArray
                            );
                        }
                    }
                } else {
                    /**merge array data step 2**/
                    $array = array();
                    foreach ($array_data['CreateBinderStep1'] as $key => $data) {
                        $array = array_merge($array, $array_data['CreateBinderStep1'][$key]);

                    }
                    $cleanArray = $helper->cleanArrayToSendVault($array);
                    if (!empty($current_path[2]) && is_numeric($current_path[2])) {
                        $idPress = $current_path[2];
                        $session->set('data_steps_'.$type.'_'.$user->getId().'_'.$step.'_'.$idPress, $cleanArray);
                    }
                    /***end****/
                    /**Get Country & Products Of Veeva**/
                    $veevaCountry = $helper->getNameCountryByKey($array['country__v']);
                    $prod = '';
                    foreach ($array['product__v'] as $prd) {
                        $prod .= $helper->getNameProductByKey($prd).' ';
                        $veevaProduct[] = strtoupper($helper->getNameProductByKey($prd));
                    }
                    /**Get Country & Products Of Presentation**/

                    $id_rev = $em->getRepository('PresentationBundle:Revision')->getLastVersionRevisionByPres($idPress);
                    $revision = $em->getRepository('PresentationBundle:Revision')->find($id_rev);
                    $country = $revision->getPresentation()->getTerritory()->getCode();
                    $productsRev = $revision->getPresentation()->getProducts();

                    $products = '';
                    $mcmProduct = array();
                    foreach ($productsRev as $product) {
                        $products .= $product->getName().' ';
                        $mcmProduct[] = strtoupper($product->getName());
                    }
                    $products = !empty($products) ? $products : 'No Product Choice.';
                    if (!empty(array_diff($veevaProduct, $mcmProduct))) {
                        $productDiff = array_diff($veevaProduct, $mcmProduct);
                    } elseif (!empty(array_diff($mcmProduct, $veevaProduct))) {
                        $productDiff = array_diff($mcmProduct, $veevaProduct);
                    } else {
                        $productDiff = '';
                    }
                    $country = !empty($country) ? $helper->getNameCountryByKey($country) : 'No Country Choice.';
                    $output = '';


                    if ($veevaCountry != $country) {
                        $output .= '<div>Country of the CLM presentation is:</div>
                         <ul><li>MCM Builder: '.$country.'</li><li>Veeva Vault: '.$veevaCountry.'</li></ul>.';
                    }
                    if (!empty($productDiff)) {
                        $output .= '<div>Product of the CLM presentation is:</div>
                         <ul><li>MCM Builder: '.$products.'</li><li>Veeva Vault: '.$prod.'</li></ul>.';
                    }

                    if (($veevaCountry != $country) || (!empty($productDiff))) {
                        $this->container->get('session')->getFlashBag()->add(
                            'warning-differ',
                            '<div class="title-warning-differ">Notification</div>'.$output
                        );
                    }
                }
            }
        }

        return $options;
    }

    /**
     * {@inheritDoc}
     */
    public function setEventDispatcher(EventDispatcherInterface $dispatcher)
    {
        parent::setEventDispatcher($dispatcher);
        $dispatcher->addSubscriber($this);
    }

    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FormFlowEvents::POST_BIND_REQUEST => 'onPostBindRequest',
        );
    }

    public function onPostBindRequest(PostBindRequestEvent $event)
    {

    }

}



