
let debug     = require('debug')('myapp:server'),
    http      = require('http'),
    fs        = require("fs"),
    awsConfig = require('./awsConfig'),
    aws4      = require('aws4'),
    S3Zipper  = require ('aws-s3-zipper');

var config ={
    accessKeyId    : awsConfig.aws_access_key_id,
    secretAccessKey: awsConfig.aws_secret_access_key,
    region         : awsConfig.region,
    bucket         : awsConfig.upload_bucket
};

var zipper  = new S3Zipper(config);
var zipName = 'testZip';
zipper.zipToS3File ({
        s3FolderName : 'testZip',
        startKey     : '',
        s3ZipFileName: 'zipoutput/Mi-deep/' + zipName + ".zip",
        recursive    : true
    }
    ,function(err,result){
        if(err)
            console.error(err);
        else{
            var lastFile = result.zippedFiles[result.zippedFiles.length-1];
            if(lastFile)
                console.log('last key ', lastFile.Key);
        }
    });



