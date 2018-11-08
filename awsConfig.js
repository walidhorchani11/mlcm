'use strict';

var awsUsersList = require('./awsUsersList');

const awsConfig = {
    awsUsersList                : awsUsersList,
    region                      : 'eu-west-1',
    ENV_BUCKET                  : 'veeva-summit',
    upload_bucket               : 'mcm-media-librairie-dev',
    resize_bucket               : 'mcm-media-resize',
    company_bucket              : 'mcm-companies',
    aws_access_key_id           : 'AKIAIBJ5TEFCI26MLU2A',
    aws_secret_access_key       : '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',
    apiVersion                  : '2006-03-01',
    apiHostVideothumb           : 'u1k7jthaja.execute-api.eu-west-1.amazonaws.com',
    apiHostPresentationthumb    : '4k607czcfd.execute-api.eu-west-1.amazonaws.com',
    apiHostAllPresentationthumb : '83vqnzeunc.execute-api.eu-west-1.amazonaws.com',
    apiHostAllPresentationPopin : 'kusm35ymx0.execute-api.eu-west-1.amazonaws.com',
    staticUrl                   : 'http://mcm-media-resize.s3-website-eu-west-1.amazonaws.com',
    FRAMEWORK_MI_DEEP           : 'zip_input/frameworkMiDeep',
    FRAMEWORK_VEEVA_WIDE        : 'zip_input/frameworkVeevaWide',
    SURVEY_JS_IN_ZIP            : 'zip_input/Mcm_survey',
    ZIP_OUTPUT_MI_DEEP          : 'zipoutput/Mi-deep',
    ZIP_OUTPUT_VEEVA_WIDE       : 'zipoutput/veeva-wide'
};

module.exports = awsConfig;