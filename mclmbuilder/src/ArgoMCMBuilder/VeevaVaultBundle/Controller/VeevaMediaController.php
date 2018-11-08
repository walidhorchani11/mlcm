<?php

namespace ArgoMCMBuilder\VeevaVaultBundle\Controller;

use ArgoMCMBuilder\PresentationBundle\Entity\Revision;
//use ArgoMCMBuilder\PresentationBundle\Entity\Slider;
use ArgoMCMBuilder\VeevaVaultBundle\Entity\Veeva;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use ArgoMCMBuilder\VeevaVaultBundle\Helper;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use ArgoMCMBuilder\VeevaVaultBundle\Form\FormZip\CreateBinderStep1Form;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use GuzzleHttp\Client;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use ArgoMCMBuilder\PresentationBundle\Objects\Catcher;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use GuzzleHttp\RequestOptions;
use Symfony\Component\Process\Process;

/****
 * Class VeevaMediaController
 * @package ArgoMCMBuilder\VeevaVaultBundle\Controller
 */
class VeevaMediaController extends Controller
{
    /**
     * @Route("/retrieve-media" ,name="retrieve_media_vault")
     */
    public function retrieveMediaVaultAction()
    {
        $helper = $this->get('veeva_vault.helper.tools');
        $sessionId = $helper->token_instance();
        $user = $this->get('security.context')->getToken()->getUser();
        $company = !empty($user->getCompany()) ? $user->getCompany() : '';
        $veevaUrl = !empty($company->getVeevaUrl()) ? $company->getVeevaUrl() : '';
        $veevaApi = !empty($company->getVeevaApi()) ? $company->getVeevaApi() : '';

        if ($sessionId) {


            $path = __DIR__.'/../../../../web/download';
            /*  $resource = fopen($path.'/ddd', 'w');
                $stream = \GuzzleHttp\Psr7\stream_for($resource);*/
            /*  $file_path = fopen($path.'/test.png', 'w');*/
            /*  dump($file_path);die;*/
            $client = new \GuzzleHttp\Client();
            $response = $client->get(
                $veevaUrl.'/api/'.$veevaApi.'/objects/documents/2462/attachments/2464/file',
                [

                    'headers' => ['Authorization' => $sessionId],
                    'save_to' => $path.'/test2',
                ]

            );


        }

        return new Response(
            '<html><body>'.$response->getBody().'</body></html>'
        );
    }
    
}
