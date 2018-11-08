'use strict';

var awsConfig = require('./awsConfig');

const webpackEnvConfig = {
    'ISPROD'                    : true,
    'SAVEAUTO'                  : false,
    'AWSUSERSLIST'              : JSON.stringify(awsConfig.awsUsersList),
    'ENV_BUCKET'                : JSON.stringify(awsConfig.ENV_BUCKET),
    'AWS_ACCESS_KEY_ID'         : JSON.stringify(awsConfig.aws_access_key_id),
    'AWS_SECRET_ACCESS_KEY'     : JSON.stringify(awsConfig.aws_secret_access_key),
    'REGION'                    : JSON.stringify(awsConfig.region),
    'BUCKET'                    : JSON.stringify(awsConfig.upload_bucket),
    'RESIZEBUCKET'              : JSON.stringify(awsConfig.resize_bucket),
    'COMPANYBUCKET'             : JSON.stringify(awsConfig.company_bucket),
    'APIVERSION'                : JSON.stringify(awsConfig.apiVersion),
    'APIHOSTVIDEOTHUMB'         : JSON.stringify(awsConfig.apiHostVideothumb),
    'APIHOSTPRESTHUMB'          : JSON.stringify(awsConfig.apiHostPresentationthumb),
    'APIHOSTPRESALLTHUMB'       : JSON.stringify(awsConfig.apiHostAllPresentationthumb),
    'APIHOSTPRESALLPOPINTHUMB'  : JSON.stringify(awsConfig.apiHostAllPresentationPopin),
    'FRAMEWORK_MI_DEEP'         : JSON.stringify(awsConfig.FRAMEWORK_MI_DEEP),
    'FRAMEWORK_VEEVA_WIDE'      : JSON.stringify(awsConfig.FRAMEWORK_VEEVA_WIDE),
    'SURVEY_JS_IN_ZIP'          : JSON.stringify(awsConfig.SURVEY_JS_IN_ZIP),
    'ZIP_OUTPUT_MI_DEEP'        : JSON.stringify(awsConfig.ZIP_OUTPUT_MI_DEEP),
    'ZIP_OUTPUT_VEEVA_WIDE'     : JSON.stringify(awsConfig.ZIP_OUTPUT_VEEVA_WIDE),
    'STATICURL'                 : JSON.stringify(awsConfig.staticUrl)
};

module.exports = webpackEnvConfig;