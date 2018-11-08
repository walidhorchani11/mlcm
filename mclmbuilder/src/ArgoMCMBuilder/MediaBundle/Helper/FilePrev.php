<?php

namespace ArgoMCMBuilder\MediaBundle\Helper;

/**
 * Class FilePrev.
 */
class FilePrev extends Controller
{
    public function afficheAction()
    {
        $file = 'filename.xlsx';
        $chemin = 'C:/filepath/';

        $response = new Response();
        $response->setContent(file_get_contents($chemin.$file));
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); // modification du content-type pour forcer le téléchargement (sinon le navigateur internet essaie d'afficher le document)
        $response->headers->set('Content-disposition', 'filename='.$file);

        return $response;
    }
}
