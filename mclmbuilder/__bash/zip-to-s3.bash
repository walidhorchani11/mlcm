#!/bin/bash

pathUrl=$1
folderName=$2
pathToS3=$3
zipName=$4
cd /tmp/export-zip
aws s3 cp $pathUrl $folderName --recursive --profile argo
zip -r $zipName $folderName
aws s3 cp $zipName $pathToS3 --acl public-read --profile argo
rm -rf $zipName $folderName