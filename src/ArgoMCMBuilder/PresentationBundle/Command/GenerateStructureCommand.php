<?php

namespace ArgoMCMBuilder\PresentationBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

class GenerateStructureCommand extends Command
{
    protected function configure()
    {
        $this
            // the name of the command (the part after "bin/console")
            ->setName('app:generate:structure')

            // the short description shown while running "php app/console list"
            ->setDescription('Generate structure')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('This command allows you to Generate structure')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // outputs multiple lines to the console (adding "\n" at the end of each line)
        $output->writeln([
            '<fg=green>========================',
            'Generate Structure',
            '========================</>',
            '',
        ]);
        // outputs a message followed by a "\n"
        $fs = new Filesystem();
//#TODO fix the $mainDirectory  'benMacha'
        try {
            $mainDirectory = '/home/su/m.mejri/projects/mclmbuilder/web/command';
            $contentParametersXml = '<!--ID unique-->
<Sequence Id="Amarel_DZ_201600301_v1" xmlns="urn:param-schema">
    <Pages>
        <Page pageid="S1_10"/>
    </Pages>
</Sequence>';

            $contentHMTL = "<section data-id='d4437834b6cbf86a5590b872a16266aa' class='has-light-background' data-background-color='#93c47d'><div class='sl-block' data-block-type='text' style='width: 800px; left: 10px; top: 350px; height: auto;' data-block-id='a2a06bfbd7257a3ea599d5598042431e'><div class='sl-block-content' data-placeholder-tag='h1' data-placeholder-text='Title Text' style='position: relative; z-index: 11; background-color: rgb(230, 145, 56);' dir='ui'><h1>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; dsfsdd</h1>
<p>dfgfdgfdgfdf</p>
</div></div><div class='sl-block' data-block-type='shape' data-block-id='903baf8602099df6cf1066d276340b35' style='min-width: 4px; min-height: 4px; width: 290px; height: 337px; left: 459px; top: 0px;'><div class='sl-block-content' data-shape-type='arrow-down' data-shape-fill-color='#000000' data-shape-stretch='true' style='z-index: 12;'><svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100%' height='100%' preserveAspectRatio='none' viewBox='0 0 290 337'><polygon points='145,337 290,168.5 203,168.5 203,0 87,0 87,168.5 0,168.5 145,337' class='shape-element' fill='#000000'></polygon></svg></div></div><div class='sl-block' data-block-type='line' data-block-id='135eaff72386d8ee4abd2be244317de2' style='width: auto; height: auto; min-width: 1px; min-height: 1px; left: 240px; top: 513px;'><div class='sl-block-content' data-line-x1='-136' data-line-y1='0' data-line-x2='264' data-line-y2='0' data-line-color='#000000' data-line-start-type='none' data-line-end-type='none' style='z-index: 13;'><svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='xMidYMid' width='400' height='1' viewBox='-136 0 400 1'><line stroke='rgba(0,0,0,0)' stroke-width='15' x1='-136' y1='0' x2='264' y2='0'></line><line stroke='#000000' stroke-width='2' x1='-136' y1='0' x2='264' y2='0'></line></svg></div></div><div class='sl-block' data-block-type='text' data-block-id='553260575a513902a6fdcdad1f8179fe' style='height: auto; min-width: 30px; min-height: 30px; width: 600px; left: 180px; top: 584px;'><div class='sl-block-content' data-placeholder-tag='p' data-placeholder-text='Text' style='z-index: 14; position: relative;'><p>Text</p></div></div><div class='sl-block' data-block-type='image' data-block-id='b780db1823884d5633e6fff323f95520' style='min-width: 30px; min-height: 30px; width: 360px; height: 270px; left: 0px; top: 0px;'><div class='sl-block-content' style='z-index: 15;'><img style='' data-natural-width='2048' data-natural-height='1536' data-src='http://m.mejri.clm-builder.dev/uploads/1_60.10 ref.jpg'></div></div></section>";
//#TODO check the HTML code 'benMacha'
            $div = '<div class="content active" id="S1_10">';
            $closeDiv = '</div>';
            $contentHMTL = $div.$contentHMTL.$closeDiv;
        /*    $fs->mkdir($mainDirectory);
            $fs->mkdir($mainDirectory.'/js');
            $fs->mkdir($mainDirectory.'/css');
            $fs->mkdir($mainDirectory.'/export');
            $fs->mkdir($mainDirectory.'/media');

            $fs->mkdir($mainDirectory.'/parameters');
            $fs->touch($mainDirectory.'/parameters/parameters.xml');
            $fs->dumpFile($mainDirectory.'/parameters/parameters.xml', $contentParametersXml);

            $fs->mkdir($mainDirectory.'/screen');
            $fs->mkdir($mainDirectory.'/theme');
            $fs->touch($mainDirectory.'/index.html');
        */
          //$fs->mirror('/home/su/m.mejri/projects/mclmbuilder/web/template-rendering', $mainDirectory.'/');
            $fs->dumpFile($mainDirectory.'/parameters/parameters.xml', $contentParametersXml);
            $fs->dumpFile($mainDirectory.'/screen/S1_10/index.html', $contentHMTL);
            $fs->copy('/home/su/m.mejri/projects/mclmbuilder/web/template-rendering/screen/S1_10/main.css', $mainDirectory.'/screen/S1_10/main.css', true);
        } catch (IOExceptionInterface $e) {
            echo 'An error occurred while creating your directory at '.$e->getPath();
        }
    }
}
