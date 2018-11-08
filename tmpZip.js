
let
    awsConfig = require('./awsConfig'),
    AWS       = require('aws-sdk');


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


        s3.listObjects(params, function (err, data) {
            console.log(data);
        });


