
let debug     = require('debug')('myapp:server'),
    http      = require('http'),
    fs        = require("fs"),
    awsConfig = require('./awsConfig'),
    aws4      = require('aws4'),
    when      = require('when'),
    rest      = require('rest'),
    S3Zipper  = require ('aws-s3-zipper'),
    Promise   = require('promise'),
    AWS       = require('aws-sdk');

var config ={
    accessKeyId    : awsConfig.aws_access_key_id,
    secretAccessKey: awsConfig.aws_secret_access_key,
    region         : awsConfig.region,
    bucket         : awsConfig.upload_bucket
};


var region = awsConfig.region;
var bucket = awsConfig.upload_bucket;
var folder = 'testZip/';
var params = {
    Bucket: bucket,
    Prefix: folder,
    Delimiter: '/'
};
AWS.config.update({
    region: region,
    credentials: {
        accessKeyId         : awsConfig.aws_access_key_id,
        secretAccessKey     : awsConfig.aws_secret_access_key
    }
});
var s3 = new AWS.S3();

var zipper  = new S3Zipper(config);

function zipInside() {
    return new Promise(function(resolve, reject) {

        s3.listObjects(params, function (err, data) {
            if (err)throw err;
            var cpt =  data.CommonPrefixes.length;
            var cpt2 = 0;
            for (var i = 0; i < data.CommonPrefixes.length; i++) {
                var key = data.CommonPrefixes[i].Prefix;
                key = key.substring(0, key.length - 1);
                var j = i + 1;
                zipper.zipToS3File({
                        s3FolderName: key,
                        startKey: '',
                        s3ZipFileName: 'preparedZip/zip' + j + '.zip',
                        recursive: true
                    }
                    , function (err, result) {
                        if (err){
                            console.error(err);
                        }
                        else {

                            var lastFile = result.zippedFiles[result.zippedFiles.length - 1];
                            if (lastFile) {
                                cpt2 = cpt2 + 1;
                            }

                            if(lastFile && cpt === cpt2){
                                resolve("finished");
                            }
                        }
                    });
            }
        });

    });
}

function zipOutside() {

    zipInside().then(function(result) {
        zipper.zipToS3File ({
                s3FolderName : 'preparedZip',
                startKey     : '',
                s3ZipFileName: 'zipoutput/veeva-wide/testZZip.zip',
                recursive    : true
            }
            ,function(err,result){
                if(err)
                    console.error(err);
                else{
                    var lastFile = result.zippedFiles[result.zippedFiles.length-1];
                    if(lastFile){

                        /* *********************************Remove tmp ************************************* */
                        var params = {
                            Bucket: awsConfig.upload_bucket,
                            Prefix: 'preparedZip/'
                        };

                        s3.listObjects(params, function(err, data) {
                            if (err) return console.log(err);

                            params = {Bucket: awsConfig.upload_bucket};
                            params.Delete = {};
                            params.Delete.Objects = [];

                            data.Contents.forEach(function(content) {
                                params.Delete.Objects.push({Key: content.Key});
                            });

                            s3.deleteObjects(params, function(err, data) {
                                if (err) return console.log(err);
                                return console.log(data.Deleted.length);
                            });
                        });
                        /* ********************************************************************************* */
                    }
                }
            });
    });
}

zipOutside();
// handlerObject();