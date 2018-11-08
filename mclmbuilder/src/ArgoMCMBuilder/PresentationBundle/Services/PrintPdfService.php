<?php

namespace ArgoMCMBuilder\PresentationBundle\Services;

use ArgoMCMBuilder\BackOfficeBundle\Services\DecktapeService;
use Doctrine\ORM\Query\AST\InstanceOfExpression;
use Symfony\Component\DependencyInjection\Dump\Container;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Security\Core\SecurityContext;

/**
 * Class PrintPdfService allow to print pdf.
 */
class PrintPdfService
{
    private $directoryPdf;
    private $mainDirectory;
    private $fileSystem;
    private $mailer;
    private $templating;
    private $context;

    /**
     * PrintPdfService constructor.
     *
     * @param string $directoryPdf
     * @param string $mainDirectory
     * @param Filesystem $fileSystem
     * @param Container $container
     */
    public function __construct(
        $directoryPdf,
        $mainDirectory,
        $fileSystem,
        $container,
        $mailer,
        $templating,
        SecurityContext $context
    ) {
        $this->directoryPdf = $directoryPdf;
        $this->mainDirectory = $mainDirectory;
        $this->fileSystem = $fileSystem;
        $this->container = $container;
        $this->mailer = $mailer;
        $this->templating = $templating;
        $this->context = $context;

        return $this;
    }

    /**
     *  Print Pdf with decktape.
     *
     * @param string $urlPres
     * @param int $idRev
     * @param string $pdfName
     * @param int $slides
     *
     * @return string
     */
    public function deckPdf($urlPres, $idRev, $pdfName, $slides)
    {
        $fs = $this->fileSystem;
        $dir = $this->directoryPdf.$idRev;

        try {
            if (!$fs->exists($dir)) {
                $fs->mkdir($dir);
            }
        } catch (IOExceptionInterface $e) {
            // for debug uncomment $e->getPath()
            echo "An error occurred while creating your pdf directory \n"; //.$e->getPath();
        }

        $fullName = "$dir/$pdfName.pdf";

        // cd to decktape directory
        $cmd1 = 'cd '.$this->mainDirectory.'decktape;';
        // generate PDF file
        $cmd2 = "./phantomjs decktape.js -p 0 --slides 1-$slides reveal $urlPres $fullName";

        exec($cmd1.$cmd2, $output, $returnVar);

        if (0 == $returnVar) {
            return $fullName;
        }

        exit("An error occurred while generating your pdf ($returnVar)");
    }

    public function getUser()
    {
        return $this->context->getToken()->getUser();
    }

    public function sendMailer($objectPdfEmail, $body)
    {
        $user = $this->getUser();
        $message = \Swift_Message::newInstance($objectPdfEmail)
            ->setFrom('noreply@mcm-builder.com', 'mcm-builder')
            ->setTo($user->getEmail())
            ->setBody($body, 'text/html');
        $this->mailer->send($message);
    }

    /**
     * @param int    $idRev
     * @param int    $idPres
     * @param string $pdfName
     * @param string $tabChecked
     * @param array  $rcpList
     * @param string $plateform
     * @param string $urlPDF
     *
     * @return boolean
     */
    public function printPdf($idRev, $idPres, $pdfName, $tabChecked, $rcpList, $plateform, $urlPDF, $sendEmailer)
    {
        //Generate preview url
        $route = $this->container->get('router');
        $url1 = $route->generate('presentations_first_page_preview_pdf', array('idRev' => $idRev), true);
        if (strrpos($tabChecked, 'flow-diagram') == false) {
            $url2 = "null";
        } else {
            $url2 = $route->generate('presentations_flow_diagram_pdf', array('idPres' => $idPres, 'idRev' => $idRev),true);
        }
        $url3 = $route->generate('presentations_note_preview_pdf', array('idRev' => $idRev, 'plateform' => $plateform, 'tabChecked' => $tabChecked),true);
        if (strrpos($tabChecked, 'list-ref') == false && strrpos($tabChecked, 'list-rcp') == false && strrpos($tabChecked,'survey') == false
        ) {
            $url4 = "null";
        } else {
            $url4 = $route->generate('presentations_last_page_preview_pdf', array('idRev' => $idRev, 'plateform' => $plateform, 'tabChecked' => $tabChecked),true);
        }
        set_time_limit(0);  // Uniquement pour le POC !!
//        $decktape = new DecktapeService($this->container);
//        $result = $decktape->exec("bash /home/argo/Bureau/mcm-merck/__bash/decktape-to-s3_Argolife.bash $url1 $url2 $url3 $url4 $pdfName $idRev $idPres '$rcpList';");

        $ssh_key_path = '/home/sites/qa.mcm-builder.com/ssh';
        $cmd = "bash /var/www/html/DECK/decktape-to-s3.bash $url1 $url2 $url3 $url4 $pdfName $idRev $idPres '$rcpList';";
        $connection = ssh2_connect('ec2-34-238-252-13.compute-1.amazonaws.com', 22, array('hostkey' => 'ssh-rsa'));

        if (ssh2_auth_pubkey_file(
            $connection,
            'ubuntu',
            "${ssh_key_path}/id_rsa.pub",
            "${ssh_key_path}/id_rsa"
        )) {
            $stream = ssh2_exec($connection, $cmd);
            stream_set_blocking($stream, true);
            $stream_out = stream_get_contents($stream);
            if ($stream_out) {
                if ($sendEmailer == "1") {
                    $objectPdfEmail = $this->container->get('translator')->trans(
                        'presentation.object.pdfemail',
                        array(),
                        'presentations'
                    );
                    $body = $this->templating->render(
                        'PresentationBundle:Presentation:sendUrlPDF.html.twig',
                        array(
                            'urlPDF' => $urlPDF,
                            'fullName' => $this->getUser()->getFullName(),
                            'hostUrl' => 'http://'.$this->container->get('router')->getContext()->getHost(),
                        )
                    );
                    $this->sendMailer($objectPdfEmail, $body);
                }
                 return true;
            }
            else {
                return false;
            }
        }
    }
}
