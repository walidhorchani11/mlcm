#!/bin/bash
echo "clearing cache and doing sf2 magic"

#Symfony DB Sync
#php app/console doctrine:generate:entities ArgoMCMBuilder
#php app/console doctrine:schema:update --force

#used to install the web assets (CSS, JavaScript, images) for the production application.
php app/console assets:install --symlink --relative
php app/console assetic:dump --env=prod --no-debug

echo "clearing cache and doing sf2 magic"
mv app/cache/dev app/cache/dev_bak
mv app/cache/prod app/cache/prod_bak
#php app/console cache:clear --env=dev
#php app/console cache:clear --env=prod
rm -rf app/cache/*_bak
#find app/cache/* -type d -exec chown :g_mcm {} +
#chmod -R 777 app/cache

echo 'all good...'
echo "¯\_(ツ)_/¯"