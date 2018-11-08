<?php

namespace ArgoMCMBuilder\PresentationBundle\Objects;

/**
 * Class Catcher for catching errors.
 */
class Catcher
{
    /**
     * @param mixed  $severity
     * @param string $message
     * @param string $filename
     * @param int    $line
     *
     * @throws \ErrorException
     */
    public function exceptionsErrorHandler($severity, $message, $filename, $line)
    {
        if (error_reporting() == 0) {
            return;
        }

        if (error_reporting() & $severity) {
            throw new \ErrorException($message, 0, $severity, $filename, $line);
        }
    }
}
