
let debug     = require('debug')('myapp:server'),
    http      = require('http'),
    fs        = require("fs"),
    awsConfig = require('./awsConfig'),
    aws4      = require('aws4'),
    when      = require('when'),
    rest      = require('rest'),
    S3Zipper  = require ('aws-s3-zipper'),
    Promise   = require('promise'),
    AWS       = require('aws-sdk'),
    JSZip     = require('jszip'),
    forEach   = require('async-foreach').forEach;

var zip = new JSZip();
var cpt = 0;
var cpt2 = 0;
AWS.config.update({
    region: awsConfig.region,
    credentials: {
        accessKeyId         : awsConfig.aws_access_key_id,
        secretAccessKey     : awsConfig.aws_secret_access_key
    }
});
var s3 = new AWS.S3();
var params = {
    Bucket: awsConfig.upload_bucket,
    Prefix: 'testZip/'
};

    return new Promise(function (resolve, reject) {
        s3.listObjects(params, function (err, data) {

            forEach(data.Contents, function (file) {
                var params = {
                    Bucket: awsConfig.upload_bucket,
                    Key: file.Key
                };
                if (file.Size > 0) {
                    cpt2 ++;
                    s3.getObject(params, function (err, data) {

                        if (err) {
                            console.log('file', file.Key);
                            console.log('get image files err', err, err.stack);
                        } else {

                            var key = file.Key;
                            key = key.replace('testZip/', '');
                            test = zip.file(key, data.Body);
                            if(test){
                                cpt ++;
                                console.log(key + " zipped");
                                if(cpt === cpt2){
                                    resolve("finish");
                                }
                            }
                        }

                    });
                }
            });

        });
    }).then(function(result) {
    console.log(result);
        var content = zip.generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true
         });
    var params = {
        Bucket: awsConfig.upload_bucket,
        Key: 'zipoutput/Mi-deep/testZip1.zip',
        Body: content,
        ACL: 'public-read'
    };
    s3.upload(params, function (err, data) {
        if (err) {
            console.log('upload zip to s3 err', err, err.stack);
        } else {
            console.log("success upload");
        }
    });
});
