<?php
/**
 * Created by PhpStorm.
 * User: developper
 * Date: 29/06/17
 * Time: 12:54.
 */

namespace ArgoMCMBuilder\BackOfficeBundle\Services;

use phpseclib\Crypt\RSA;
use phpseclib\Net\SSH2;

class DecktapeService
{
    private $container;
    private $ssh;

    public function __construct($container)
    {
        $this->container = $container;

        $key = new RSA();
        $key->loadKey(file_get_contents($this->container->getParameter('decktapes_connection.key_path')));

        $this->ssh = new SSH2($this->container->getParameter('decktapes_connection.host'));
        if (!$this->ssh->login($this->container->getParameter('decktapes_connection.user'), $key)) {
            exit('Login Failed');
        }

        /*
         Example
         $decktape = new DecktapeService($this->container);

          echo $decktape->exec('pwd');
          echo $decktape->exec('ls -la');
          echo $decktape->exec('ls -la /var/www/html');
          */
    }

    /**
     * @param string $command
     *
     * @return string
     */
    public function exec($command)
    {
        return $this->ssh->exec($command);
    }
}
