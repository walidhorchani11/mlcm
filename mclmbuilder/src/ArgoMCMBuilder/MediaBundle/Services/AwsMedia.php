<?php

namespace ArgoMCMBuilder\MediaBundle\Services;

use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;

class AwsMedia
{
    public $em;
    public $clientPrivateKey;
    public $adminPrivateKey;
    public $serverPublicKey;
    public $serverPrivateKey;
    public $expectedBucketName;
    public $resizeBucketName;
    public $expectedHostName; // v4-only
    public $expectedMaxSize;
    public $version;
    public $region;
    public $companyName;

    public function __construct($em, $awsConfig)
    {
        $this->em = $em;
        $this->clientPrivateKey = $awsConfig['aws_secret_access_key'];
        $this->serverPublicKey = $awsConfig['aws_access_key_id'];
        $this->serverPrivateKey = $awsConfig['aws_secret_access_key'];
        $this->expectedBucketName = $awsConfig['env_bucket'];
        $this->resizeBucketName = $awsConfig['resize_bucket'];
        $this->expectedHostName = $awsConfig['expectedHostName'];
        $this->expectedMaxSize = $awsConfig['sizeLimit'];
        $this->version = $awsConfig['apiVersion'];
        $this->region = $awsConfig['region'];
        $this->adminPrivateKey = $awsConfig['aws_admin_secret_key'];
    }


    public function getRequestMethod()
    {
        global $HTTP_RAW_POST_DATA;
        if (isset($HTTP_RAW_POST_DATA)) {
            parse_str($HTTP_RAW_POST_DATA, $_POST);
        }
        if (isset($_REQUEST['_method'])) {
            return $_REQUEST['_method'];
        }

        return $_SERVER['REQUEST_METHOD'];
    }

    function handleCorsRequest()
    {
        header('Access-Control-Allow-Origin: http://s.aouini.clm-builder.dev/app_dev.php/en/media');
    }

    function handlePreflight()
    {
        $this->handleCorsRequest();
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    function getS3Client()
    {

        return new \Aws\S3\S3Client(
            [
                'version'     => $this->version,
                'region'      => $this->region,
                'credentials' => [
                    'key'    => $this->serverPublicKey,
                    'secret' => $this->serverPrivateKey,
                ],
            ]
        );
    }

    function deleteObject()
    {
        $this->getS3Client()->deleteObject(
            array(
                'Bucket' => $_REQUEST['bucket'],
                'Key'    => $_REQUEST['key'],
            )
        );
    }

    function signRequest()
    {
        header('Content-Type: application/json');
        $responseBody = file_get_contents('php://input');
        $contentAsObject = json_decode($responseBody, true);
        $jsonContent = json_encode($contentAsObject);

        if (!empty($contentAsObject["headers"])) {
            $this->signRestRequest($contentAsObject["headers"]);
        } else {
            $this->signPolicy($jsonContent);
        }
    }

    function signRestRequest($headersStr)
    {
        $version = isset($_REQUEST["v4"]) ? 4 : 2;
        if ($this->isValidRestRequest($headersStr, $version)) {
            if ($version == 4) {
                $response = array('signature' => $this->signV4RestRequest($headersStr));
            } else {
                $response = array('signature' => $this->sign($headersStr));
            }
            echo json_encode($response);
        } else {
            echo json_encode(array("invalid" => true));
        }
    }

    function isValidRestRequest($headersStr, $version)
    {
        if ($version == 2) {
            global $expectedBucketName;
            $pattern = "/\/$expectedBucketName\/.+$/";
        } else {
            global $expectedHostName;
            $pattern = "/host:$expectedHostName/";
        }
        preg_match($pattern, $headersStr, $matches);

        return count($matches) > 0;
    }

    function signPolicy($policyStr)
    {
        $policyObj = json_decode($policyStr, true);
        $test = $this->isPolicyValid($policyObj);
        if ($this->isPolicyValid($policyObj)) {
            $encodedPolicy = base64_encode($policyStr);
            if (isset($_REQUEST["v4"])) {
                $response = array(
                    'policy'    => $encodedPolicy,
                    'signature' => $this->signV4Policy($encodedPolicy, $policyObj),
                );
            } else {
                $response = array('policy' => $encodedPolicy, 'signature' => $this->sign($encodedPolicy));
            }
            echo json_encode($response);
        } else {
            echo json_encode(array("invalid" => true));
        }
    }

    function isPolicyValid($policy)
    {

        $conditions = $policy["conditions"];
        $bucket = null;
        $parsedMaxSize = null;

        for ($i = 0; $i < count($conditions); ++$i) {
            $condition = $conditions[$i];
            if (isset($condition["bucket"])) {
                $bucket = $condition["bucket"];
            } elseif (isset($condition[0]) && $condition[0] == "content-length-range") {
                $parsedMaxSize = $condition[2];
            }
        }

        return true;
    }

    function sign($stringToSign)
    {

        return base64_encode(
            hash_hmac(
                'sha1',
                $stringToSign,
                $this->adminPrivateKey,
                true
            )
        );
    }

    function signV4Policy($stringToSign, $policyObj)
    {
        $this->clientPrivateKey;

        foreach ($policyObj["conditions"] as $condition) {
            if (isset($condition["x-amz-credential"])) {
                $credentialCondition = $condition["x-amz-credential"];
            }
        }

        $pattern = "/.+\/(.+)\\/(.+)\/s3\/aws4_request/";
        preg_match($pattern, $credentialCondition, $matches);

        $dateKey = hash_hmac('sha256', $matches[1], 'AWS4'.$this->clientPrivateKey, true);
        $dateRegionKey = hash_hmac('sha256', $matches[2], $dateKey, true);
        $dateRegionServiceKey = hash_hmac('sha256', 's3', $dateRegionKey, true);
        $signingKey = hash_hmac('sha256', 'aws4_request', $dateRegionServiceKey, true);

        return hash_hmac('sha256', $stringToSign, $signingKey);
    }

    function verifyFileInS3()
    {


        $bucket = $_REQUEST["bucket"];
        $key = $_REQUEST["key"];

        if (isset($this->expectedMaxSize) && $this->getObjectSize($bucket, $key) > $this->expectedMaxSize) {

            header("HTTP/1.0 500 Internal Server Error");
            $this->deleteObject();
            echo json_encode(array("error" => "File is too big!", "preventRetry" => true));
        } else {

            $url = $this->getS3Client()->getObjectUrl($bucket, $key);
            $response = array(
                'url'    => $url,
                'bucket' => $bucket,
                'key'    => $key,
            );

            echo json_encode($response);
        }
    }

    function getObjectSize($bucket, $key)
    {
        $objInfo = $this->getS3Client()->headObject(
            array(
                'Bucket' => $bucket,
                'Key'    => $key,
            )
        );

        return $objInfo['ContentLength'];
    }

    function signV4RestRequest($rawStringToSign)
    {
        $this->clientPrivateKey;

        $pattern = "/.+\\n.+\\n(\\d+)\/(.+)\/s3\/aws4_request\\n(.+)/s";
        preg_match($pattern, $rawStringToSign, $matches);

        $hashedCanonicalRequest = hash('sha256', $matches[3]);
        $stringToSign = preg_replace(
            "/^(.+)\/s3\/aws4_request\\n.+$/s",
            '$1/s3/aws4_request'."\n".$hashedCanonicalRequest,
            $rawStringToSign
        );

        $dateKey = hash_hmac('sha256', $matches[1], 'AWS4'.$this->clientPrivateKey, true);
        $dateRegionKey = hash_hmac('sha256', $matches[2], $dateKey, true);
        $dateRegionServiceKey = hash_hmac('sha256', 's3', $dateRegionKey, true);
        $signingKey = hash_hmac('sha256', 'aws4_request', $dateRegionServiceKey, true);

        return hash_hmac('sha256', $stringToSign, $signingKey);
    }

    function isFileViewableImage($filename)
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $viewableExtensions = array("jpeg", "jpg", "gif", "png");

        return in_array($ext, $viewableExtensions);
    }

    function getTempLink($bucket, $key)
    {
        $client = $this->getS3Client();
        $url = "{$bucket}/{$key}";
        $request = $client->get($url);

        return $client->createPresignedUrl($request, '+15 minutes');
    }

    function shouldIncludeThumbnail()
    {
        $filename = $_REQUEST["name"];
        $isPreviewCapable = $_REQUEST["isBrowserPreviewCapable"] == "true";
        $isFileViewableImage = $this->isFileViewableImage($filename);

        return !$isPreviewCapable && $isFileViewableImage;
    }

    public function removeMedia($type, $request)
    {

        $id = $request->query->get('id');
        if ($type == 'img') {
            $media = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Image')->find($id);
            $rev = $media->getRevisionImage();
            if($media->getTitle() and $this->fileExistS3('thumb_media/'.$media->getTitle())):
                $this->getS3Client()->deleteObject(
                    array(
                        'Bucket' => $this->resizeBucketName,
                        'Key'    => 'thumb_media/'.$media->getTitle(),
                    )
                );
            endif;
            if($media->getTitle() and $this->fileExistS3('1024xnull/'.$media->getTitle())):
                $this->getS3Client()->deleteObject(
                    array(
                        'Bucket' => $this->resizeBucketName,
                        'Key'    => '1024xnull/'.$media->getTitle(),
                    )
                );
            endif;
            if ($rev) {
                foreach ($rev as $p) {
                    $p->removeImage($media);
                    $this->em->persist($p);
                }
            }
        } elseif ($type == 'pdf') {
            $media = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Pdf')->find($id);
            $rev = $media->getRevisionPdf();
            if ($rev) {
                foreach ($rev as $p) {
                    $p->removePdf($media);
                    $this->em->persist($p);
                }
            }
        } else {
            $media = $this->em->getRepository('ArgoMCMBuilderMediaBundle:Video')->find($id);
            $rev = $media->getRevisionVideo();
            if ($rev) {
                foreach ($rev as $p) {
                    $p->removeVideo($media);
                    $this->em->persist($p);
                }
            }
        }
        if($media->getKey() and $this->fileExistS3($media->getKey())):
            $this->getS3Client()->deleteObject(
                array(
                    'Bucket' => $this->expectedBucketName,
                    'Key'    => $media->getKey(),
                )
            );
        endif;
        $this->em->remove($media);
        $this->em->flush();
    }
    function fileExistS3(string $key, $params = array()): bool {
        $bucket = $this->expectedBucketName;
        $s3 = $this->getS3Client();
        $result = $s3->doesObjectExist($bucket, $key, $params);

        return $result;

    }
    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $content
     * @param $fileName
     */
    public function putFileVeevaInS3(S3Client $S3, $zipName, $content, $fileName)
    {

        $params = array(
            "Bucket" => $this->expectedBucketName,
            "Key"    => "$this->companyName/zip/veeva-wide/$zipName/$fileName",
            "Body"   => $content,
	        'ACL' => 'public-read',
        );
        try {
            $S3->putObject($params);
        } catch (S3Exception $e) {
            trigger_error($e->getAwsErrorMessage());
        }
    }

    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $content
     * @param $fileName
     */
    public function putFileInS3(S3Client $S3, $zipName, $content, $fileName)
    {
        $params = array(
            "Bucket" => $this->expectedBucketName,
            "Key"    => "$this->companyName/zip/mi-deep/$zipName/$fileName",
            "Body"   => $content,
	        'ACL' => 'public-read',
        );
        try {
            $S3->putObject($params);
        } catch (S3Exception $e) {
            trigger_error($e->getAwsErrorMessage());
        }
    }
    public function putJsonInS3(S3Client $S3, $zipName, $content, $fileName, $zipType = "mi-deep"){
        $params = array(
            "Bucket"       => $this->expectedBucketName,
            "Key"          => "$this->companyName/zip/$zipType/$zipName/$fileName",
            'ContentType'  => "application/json",
            "Body"         => json_encode((array)$content),
	        'ACL'          => 'public-read',
        );
        try{
            $S3->putObject($params);
        }catch (S3Exception $e){
            trigger_error($e->getAwsErrorMessage());
        }
    }
    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $sourceName
     * @param $fileName
     */
    public function copyFileVeevaInS3(S3Client $S3, $zipName, $sourceName, $fileName)
    {
        try {
            if($this->fileExistS3(urldecode(ltrim($this->companyName.$sourceName, '/')))):
                $S3->copyObject(
                    array(
                        "Bucket"     => $this->expectedBucketName,
                        "CopySource" => $this->expectedBucketName."/".$this->companyName.$sourceName,
                        "Key"        => "$this->companyName/zip/veeva-wide/$zipName/$fileName",
                        'ACL'        => 'public-read',
                    )
                );
            endif;
        } catch (S3Exception $e) {
            trigger_error($sourceName);
        }
    }

    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $sourceName
     * @param $fileName
     */
    public function copyFontsVeevaInS3(S3Client $S3, $zipName, $sourceName, $fileName)
    {
        try {
            if($this->fileExistS3(urldecode(ltrim($sourceName, '/')))):
                $S3->copyObject(
                    array(
                        "Bucket"     => $this->expectedBucketName,
                        "CopySource" => $this->expectedBucketName.$sourceName,
                        "Key"        => "$this->companyName/zip/veeva-wide/$zipName/$fileName",
                        'ACL'        => 'public-read',
                    )
                );
            endif;
        } catch (S3Exception $e) {
            trigger_error($sourceName);
        }
    }


    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $sourceName
     * @param $fileName
     */
    public function copyFromRacineVeevaInS3(S3Client $S3, $zipName, $sourceName, $fileName)
    {
        try {
            if($this->fileExistS3(urldecode(ltrim($sourceName, '/')))):
                $S3->copyObject(
                    array(
                        "Bucket"     => $this->expectedBucketName,
                        "CopySource" => $this->expectedBucketName.$sourceName,
                        "Key"        => "$this->companyName/zip/veeva-wide/$zipName/$fileName",
                        'ACL'        => 'public-read',
                    )
                );
            endif;
        } catch (S3Exception $e) {
            trigger_error($sourceName);
        }
    }

    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $sourceName
     * @param $fileName
     */
    public function copyFontInS3(S3Client $S3, $zipName, $sourceName, $fileName)
    {

        try {
            if($this->fileExistS3(urldecode(ltrim($sourceName, '/')))):
                $media = $S3->copyObject(
                    array(
                        "Bucket"     => $this->expectedBucketName,
                        "CopySource" => $this->expectedBucketName.$sourceName,
                        "Key"        => "$this->companyName/zip/mi-deep/$zipName/$fileName",
                        'ACL'        => 'public-read',

                    )
                );
            endif;
        } catch (S3Exception $e) {
            trigger_error($e->getAwsErrorMessage());
        }
    }

    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $sourceName
     * @param $fileName
     */
    public function copyFileInS3(S3Client $S3, $zipName, $sourceName, $fileName)
    {
        try {
	        if($this->fileExistS3(urldecode(ltrim($this->companyName.$sourceName, '/')))):
	            $media = $S3->copyObject(
	                array(
	                    "Bucket"     => $this->expectedBucketName,
	                    "CopySource" => $this->expectedBucketName."/".$this->companyName.$sourceName,
	                    "Key"        => "$this->companyName/zip/mi-deep/$zipName/$fileName",
		                'ACL'        => 'public-read',

	                )
	            );
	        endif;
        } catch (S3Exception $e) {
            trigger_error($e->getAwsErrorMessage());
        }
    }
    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $prefix
     * @param $keyParams
     * @return bool
     * todo one function for veeva & mi
     */
    public function cloneSourceVeeva(S3Client $S3, $zipName, $prefix, $keyParams)
    {
        $args = array(
            'Bucket' => $this->expectedBucketName,
            'Prefix' => $prefix,
        );
        $list = $S3->getIterator('ListObjects', $args);

        foreach ($list as $elt) {
            $key = $elt['Key'];
            $name = explode('/', $key);
            array_shift($name);
            array_shift($name);
            array_shift($name);
            $name = implode('/', $name);
            $param = array(
                "Bucket"     => $this->expectedBucketName,
                "CopySource" => $this->expectedBucketName."/$key",
                "Key"        => "$keyParams$zipName/$name",
	            'ACL' => 'public-read',
            );

            try {
                $S3->copyObject($param);
            } catch (S3Exception $e) {
                trigger_error($e->getAwsErrorMessage());
            }
        }

        return true;
    }

    public function cloneSource(S3Client $S3, $zipName)
    {
        $args = array(
            'Bucket' => $this->expectedBucketName,
            'Prefix' => 'zip_input/frameworkMiDeep',
        );
        $list = $S3->getIterator('ListObjects', $args);
        foreach ($list as $elt) {
	        $key = $elt['Key'];
        	if($this->fileExistS3(urldecode($key))):
	            $name = explode('/', $key);
	            array_shift($name);
	            array_shift($name);
	            $name = implode('/', $name);
	            //$name = urldecode($name);
	            $param = array(
	                "Bucket" => $this->expectedBucketName,
	                "CopySource" => $this->expectedBucketName."/$key",
	                "Key" => "$this->companyName/zip/mi-deep/$zipName/$name",
		            'ACL' => 'public-read',
	            );
		        try {
			        $S3->copyObject($param);

			        return true;
		        } catch (S3Exception $e) {
			        trigger_error($e->getAwsErrorMessage());
		        }
            endif;
        }

        return true;
    }
    /**
     * @param S3Client $S3
     * @param $zipName
     * @param $prefix
     * @param $keyParams
     * @return bool
     */
    public function cloneSourceMi(S3Client $S3, $zipName, $prefix, $keyParams)
    {
        $args = array(
            'Bucket' => $this->expectedBucketName,
            'Prefix' => $prefix,
        );
        $list = $S3->getIterator('ListObjects', $args);
        foreach ($list as $elt) {
            $key = $elt['Key'];
            $name = explode('/', $key);
            array_shift($name);
            array_shift($name);
            $name = implode('/', $name);
            $param = array(
                "Bucket"     => $this->expectedBucketName,
                "CopySource" => $this->expectedBucketName."/$key",
                "Key"        => "$keyParams$zipName/$name",
	            'ACL' => 'public-read',
            );

            try {
                $S3->copyObject($param);
            } catch (S3Exception $e) {
                trigger_error($e->getAwsErrorMessage());
            }
        }

        return true;
    }

    public function generateZipByLambda($path, $type){
        if($type == "mi"):
            $url = "https://ml9tu8aq1a.execute-api.eu-west-1.amazonaws.com/prod/zip?company=$this->companyName&path=$path";
        else:
            $url = "https://bq3tk5ajv2.execute-api.eu-west-1.amazonaws.com/prod/bigzip?companyName=$this->companyName&path=$path";
        endif;
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $url
        ));
        $resp = curl_exec($curl);
        curl_close($curl);

        return $resp;
    }

    /**
     * @param S3Client $S3
     * @param $key
     * @return bool
     */
    public function getExistFolderS3(S3Client $S3, $key)
    {
        try {
            $response = $S3->doesObjectExist(
                $this->expectedBucketName,
                $key
            );

            return $response;
        } catch (S3Exception $e) {
            trigger_error($e->getAwsErrorMessage());
        }
    }

    /**
     * @param S3Client $S3
     * @param $prefix
     */
    function deleteS3Object(S3Client $S3, $prefix)
    {
        try {
            $S3->deleteMatchingObjects($this->expectedBucketName, $prefix);

        } catch (S3Exception $e) {
            trigger_error($e->getAwsErrorMessage());
        }
    }

    public function cloneSourceSurvey(S3Client $S3, $zipName, $type, $folderName)
    {
        $args = array(
            'Bucket' => $this->expectedBucketName,
            'Prefix' => 'zip_input/Mcm_survey/',
        );
        $list = $S3->getIterator('ListObjects', $args);

        foreach ($list as $elt) {
            $key = $elt['Key'];
            $name = explode('/', $key);
            array_shift($name);
            array_shift($name);
            $name = implode('/', $name);
            $param = array(
                "Bucket" => $this->expectedBucketName,
                "CopySource" => $this->expectedBucketName."/$key",
                "Key" => "$this->companyName/zip/$type/$zipName/$folderName/js/$name",
                'ACL' => 'public-read',
            );
            try {
                $S3->copyObject($param);
            } catch (S3Exception $e) {
                trigger_error($e->getAwsErrorMessage());
            }
        }

        return true;
    }
}