<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * Class Util.
 */
class Util
{
    public $container;

    /**
     * Util constructor.
     *
     * @param Container $container
     */
    public function __construct($container)
    {
        $this->container = $container;

        return $this;
    }

    /**
     * Returns a rendered view.
     *
     * @param string $view       The view name
     * @param array  $parameters An array of parameters to pass to the view
     *
     * @return string The rendered view
     */
    public function renderView(string $view, array $parameters = array())
    {
        if ($this->container->has('templating')) {
            return $this->container->get('templating')->render($view, $parameters);
        }

        if (!$this->container->has('twig')) {
            throw new \LogicException('You can not use the "renderView" method if the Templating Component or the Twig Bundle are not available.');
        }

        return $this->container->get('twig')->render($view, $parameters);
    }

    /**
     * Remove an html element.
     *
     * @param Crawler $crawler
     * @param string  $selector A CSS selector
     */
    public function removeElement(Crawler $crawler, string $selector)
    {
        $crawler->filter($selector)->each(function ($crawler) {
            foreach ($crawler as $node) {
                $node->parentNode->removeChild($node);
            }
        });
    }

    /**
     * @param string $text
     *
     * @return mixed|string
     */
    public function slugify(string  $text)
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
     * @param string $html
     *
     * @return \DOMDocument
     */
    public function newDomDocument(string $html)
    {
        libxml_use_internal_errors(true) && libxml_clear_errors(); // for html5
        $document = new \DOMDocument('1.0', 'UTF-8');
        $content = str_replace("\n", '', $html);
        $document->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));

        return $document;
    }

    /**
     * Transform parameter's presentation to an object (json string to php object).
     *
     * @param string $json
     *
     * @return PresentationParameter
     */
    public function getPresentationParameter(string $json): PresentationParameter
    {
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        $presParam = $serializer->deserialize($json, PresentationParameter::class, 'json');

        return $presParam;
    }

    public function cleanFileName($string) {
        $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
        $string = preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.

        return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
    }

    public function getFileNameByPattern($url, $dir, $type) {
        $pattern = '/.*\/(.*?)\.(.*)/';
        $matches = array();
        $sourceName = '';
        $fileName = '';
        if (preg_match($pattern, $url, $matches)) {
            $sourceName = "/$type/$matches[1].$matches[2]";
            $matches[1] = $this->cleanFileName($matches[1]);
            $fileName = "$dir/$matches[1].$matches[2]";
            $cleanFileName = "$matches[1].$matches[2]";
            return array('sourceName' => $sourceName, 'fileName' => $fileName, 'cleanFileName' => $cleanFileName);
        }

        return null;
    }
}
