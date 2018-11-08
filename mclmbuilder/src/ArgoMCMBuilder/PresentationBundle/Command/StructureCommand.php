<?php

namespace ArgoMCMBuilder\PresentationBundle\Command;

//use ArgoMCMBuilder\PresentationBundle\Entity\Slider;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class StructureCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('mcm:generate:structure')
            ->setDescription('Generate structure')
            ->setHelp('This command allows you to Generate structure')
            ->addArgument('path', InputArgument::OPTIONAL, 'Enter you path, please');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            '<fg=black>========================',
            'Generate Structure',
            '========================</>',
            '',
        ]);
//#TODO fix the $mainDirectory  'benMacha'
        $mainDirectory = '/home/su/h.zitoun/projects/mclmbuilder/web/command';

        $div = '<div>';
        $closeDiv = '<div>';

        $em = $this->getContainer()->get('doctrine')->getManager();
        $reposSlider = $em->getRepository('PresentationBundle:Slider');

        $slider = $reposSlider->find('19');

        $contentHMTL = $div.$slider->getContent().$closeDiv;

        $fs = new Filesystem();
        try {
            $path = $input->getArgument('path');
            $file = $mainDirectory.'/screen/S1_10/index.html';

            if ($path) {
                $file = $mainDirectory.$path;
            }
            $fs->dumpFile($file, $contentHMTL);
        } catch (IOExceptionInterface $e) {
            echo 'An error occurred while creating your directory at '.$e->getPath();
        }
    }
}
