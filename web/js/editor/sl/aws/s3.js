// Import the AWS SDK
var AWS         = require('aws-sdk'),
    _           = require('lodash'),
    accountType = 'admin',
    s3user      = _.find(process.env.AWSUSERSLIST[TWIG.companyParentName.replace(/\s/g, '+')], accountType),
    account     = s3user[accountType];

// Set credentials and region,
AWS.config.update({
    region: process.env.REGION,
    credentials: {
        accessKeyId     : account.id,
        secretAccessKey : account.key
    }
});

var s3 = new AWS.S3({
    apiVersion  : process.env.apiVersion,
    params      : {
        Bucket : process.env.ENV_BUCKET
    }
});
// Export the handler function
module.exports = { AWS, s3 };