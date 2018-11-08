<?php

namespace ArgoMCMBuilder\MediaBundle\Helper;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Class FileUploader.
 */
class FileUploader
{
    private $targetDir;
    private $media_directory_pdf;
    private $media_directory_image;

    /**
     * FileUploader constructor.
     *
     * @param string $targetDir
     * @param string $media_directory_image
     * @param string $media_directory_pdf
     * @param string $dropzone_pdf_size
     * @param string $dropzone_video_size
     * @param string $dropzone_image_size
     */
    public function __construct(
        $targetDir,
        $media_directory_image,
        $media_directory_pdf,
        $dropzone_pdf_size,
        $dropzone_video_size,
        $dropzone_image_size
    ) {
        $this->targetDir = $targetDir;
        $this->media_directory_image = $media_directory_image;
        $this->media_directory_pdf = $media_directory_pdf;
        $this->dropzone_pdf_size = $dropzone_pdf_size;
        $this->dropzone_video_size = $dropzone_video_size;
        $this->dropzone_image_size = $dropzone_image_size;
    }

    /**
     * @param UploadedFile $file
     * @param string       $path
     *
     * @return null|string
     */
    public function upload(UploadedFile $file, $path)
    {
        $fileName = $file->getClientOriginalName();
        $unwantedArray = array(
            'Š' => 'S',
            'š' => 's',
            'Ž' => 'Z',
            'ž' => 'z',
            'À' => 'A',
            'Á' => 'A',
            'Â' => 'A',
            'Ã' => 'A',
            'Ä' => 'A',
            'Å' => 'A',
            'Æ' => 'A',
            'Ç' => 'C',
            'È' => 'E',
            'É' => 'E',
            'Ê' => 'E',
            'Ë' => 'E',
            'Ì' => 'I',
            'Í' => 'I',
            'Î' => 'I',
            'Ï' => 'I',
            'Ñ' => 'N',
            'Ò' => 'O',
            'Ó' => 'O',
            'Ô' => 'O',
            'Õ' => 'O',
            'Ö' => 'O',
            'Ø' => 'O',
            'Ù' => 'U',
            'Ú' => 'U',
            'Û' => 'U',
            'Ü' => 'U',
            'Ý' => 'Y',
            'Þ' => 'B',
            'ß' => 'Ss',
            'à' => 'a',
            'á' => 'a',
            'â' => 'a',
            'ã' => 'a',
            'ä' => 'a',
            'å' => 'a',
            'æ' => 'a',
            'ç' => 'c',
            'è' => 'e',
            'é' => 'e',
            'ê' => 'e',
            'ë' => 'e',
            'ì' => 'i',
            'í' => 'i',
            'î' => 'i',
            'ï' => 'i',
            'ð' => 'o',
            'ñ' => 'n',
            'ò' => 'o',
            'ó' => 'o',
            'ô' => 'o',
            'õ' => 'o',
            'ö' => 'o',
            'ø' => 'o',
            'ù' => 'u',
            'ú' => 'u',
            'û' => 'u',
            'ý' => 'y',
            'þ' => 'b',
            'ÿ' => 'y',
            ' ' => '',
        );
        //return $originFileName.'#'.$width.'#'.$height.'#'.$fileName;
        $originFileName = strtr($fileName, $unwantedArray);
        $responseData['originalFileName'] =  $originFileName;

        $fileName = strtr($fileName, $unwantedArray);
        if (file_exists($path.'/'.$fileName)) {
            $info = pathinfo($fileName);
            $fileName = basename($fileName, '.'.$info['extension']);
            $nb = uniqid();
            $fileName = $fileName.'_'.$nb.'.'.$info['extension'];
        }
        $responseData['fileName'] =  $fileName;
        $contentType = $file->getMimeType();
        $extimage = array('image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp');
        /* read the source image */
        if (in_array($contentType, $extimage)) {
            $file->move($path, $fileName);

            switch ($contentType) {
                case 'image/jpg':
                    $source_image = imagecreatefromjpeg($path.$fileName);
                    break;
                case 'image/jpeg':
                    $source_image = imagecreatefromjpeg($path.$fileName);
                    break;
                case 'image/png':
                    $source_image = imagecreatefrompng($path.$fileName);
                    break;
                case 'image/gif':
                    $source_image = imagecreatefromgif($path.$fileName);
                    break;
                case 'image/bmp':
                    $source_image = imagecreatefromwbmp($path.$fileName);
                    break;
            }

            $width = imagesx($source_image);
            $height = imagesy($source_image);
            $responseData['width']  = $width;
            $responseData['height'] = $height;
            $desired_height = floor($height * (132 / $width));

            $virtual_image = imagecreatetruecolor(132, $desired_height);

            $black = imagecolorallocate($virtual_image, 0, 0, 0);

            imagecolortransparent($virtual_image, $black);

            imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, 132, $desired_height, $width, $height);

            imagepng($virtual_image, $path.'thumbnail'.$fileName);

        } else {
            $file->move($path, $fileName);
            $responseData['width']  = 0;
            $responseData['height'] = 0;
        }
        return $responseData;
    }

    /**
     * @param UploadedFile $file
     * @param string       $comp
     *
     * @return array
     */
    public function getDirectory(UploadedFile $file, $comp, $presDef = 'Default')
    {
        $unwantedArray = array(
            'Š' => 'S',
            'š' => 's',
            'Ž' => 'Z',
            'ž' => 'z',
            'À' => 'A',
            'Á' => 'A',
            'Â' => 'A',
            'Ã' => 'A',
            'Ä' => 'A',
            'Å' => 'A',
            'Æ' => 'A',
            'Ç' => 'C',
            'È' => 'E',
            'É' => 'E',
            'Ê' => 'E',
            'Ë' => 'E',
            'Ì' => 'I',
            'Í' => 'I',
            'Î' => 'I',
            'Ï' => 'I',
            'Ñ' => 'N',
            'Ò' => 'O',
            'Ó' => 'O',
            'Ô' => 'O',
            'Õ' => 'O',
            'Ö' => 'O',
            'Ø' => 'O',
            'Ù' => 'U',
            'Ú' => 'U',
            'Û' => 'U',
            'Ü' => 'U',
            'Ý' => 'Y',
            'Þ' => 'B',
            'ß' => 'Ss',
            'à' => 'a',
            'á' => 'a',
            'â' => 'a',
            'ã' => 'a',
            'ä' => 'a',
            'å' => 'a',
            'æ' => 'a',
            'ç' => 'c',
            'è' => 'e',
            'é' => 'e',
            'ê' => 'e',
            'ë' => 'e',
            'ì' => 'i',
            'í' => 'i',
            'î' => 'i',
            'ï' => 'i',
            'ð' => 'o',
            'ñ' => 'n',
            'ò' => 'o',
            'ó' => 'o',
            'ô' => 'o',
            'õ' => 'o',
            'ö' => 'o',
            'ø' => 'o',
            'ù' => 'u',
            'ú' => 'u',
            'û' => 'u',
            'ý' => 'y',
            'þ' => 'b',
            'ÿ' => 'y',
            ' ' => '',
        );
        $orFilename = strtr($file->getClientOriginalName(), $unwantedArray);
        $comp = strtr($comp, $unwantedArray);
        $info = pathinfo($orFilename);
        $filename = basename($orFilename, '.'.$info['extension']);
        $path = $this->targetDir.$comp;
        if (!file_exists($this->targetDir.$comp)) {
            mkdir($this->targetDir.$comp, 0777);
        }
        if (!file_exists($this->targetDir.$comp.'/'.$presDef)) {
            mkdir($this->targetDir.$comp.'/'.$presDef, 0777);
        }
        $typeFile = strstr($file->getMimeType(), '/', true);

        if ($typeFile == 'application') {
            $typeFile = 'pdf';
        }

        $path .= '/'.$presDef.'/'.$typeFile;
        if (!file_exists($this->targetDir.$comp.'/'.$presDef.'/'.$typeFile)) {
            mkdir($this->targetDir.$comp.'/'.$presDef.'/'.$typeFile, 0777);
        }

        $first = substr($filename, 0, 1);
        $path .= '/'.$first.'/';
        if (!file_exists($this->targetDir.$comp.'/'.$presDef.'/'.$typeFile.'/'.$first)) {
            mkdir($this->targetDir.$comp.'/'.$presDef.'/'.$typeFile.'/'.$first, 0777);
        }
        $url = $comp.'/'.$presDef.'/'.$typeFile.'/'.$first;
        if (strlen($filename) > 1) {
            $second = substr($filename, 1, 1);
            $path .= $second.'/';
            $url .= '/'.$second;
            if (!file_exists($this->targetDir.$comp.'/'.$presDef.'/'.$typeFile.'/'.$first.'/'.$second)) {
                mkdir($this->targetDir.$comp.'/'.$presDef.'/'.$typeFile.'/'.$first.'/'.$second, 0777);
            }
        }

        return array('path' => $path, 'url' => $url);
    }

    /**
     * Format bytes to kb, mb, gb, tb.
     *
     * @param int $size
     *
     * @return int
     */
    public function formatBytes($size)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

        for ($i = 0; $size > 1024; ++$i) {
            $size /= 1024;
        }

        return round($size, 2).' '.$units[$i];
    }

    /**
     * @param string $type
     *
     * @return float
     */
    public function getMaxfile($type)
    {
        if ($type == 'pdf') {
            return $this->dropzone_pdf_size * 1024 * 1024;
        } elseif ($type == 'video') {
            return $this->dropzone_video_size * 1024 * 1024;
        } elseif ($type == 'image') {
            return $this->dropzone_image_size * 1024 * 1024;
        }
    }

    /**
     * @return string
     */
    public function getMediaDirectoryImage()
    {
        return $this->media_directory_image;
    }
}
