#!/bin/bash
#used to install the web assets (CSS, JavaScript, images) for the production application.
echo "clearing cache and doing sf2 magic"
php app/console assets:install --symlink --relative
php app/console assetic:dump --env=prod --no-debug
date=$(date +%Y%m%d%H%M)
mv app/cache/dev app/cache/dev_${date}_bak
mv app/cache/prod app/cache/prod_${date}_bak
#mv app/logs/*.log app/logs/*_${date}.bak
echo "---> Bak created"
rm -rf app/cache/*_bak
rm -f app/logs/*.log
rm -rf app/logs/*.bak
git checkout web/.htaccess
echo "cls Done"
echo "        '''''' "
echo "__ooo___( 00 )___ooo__"