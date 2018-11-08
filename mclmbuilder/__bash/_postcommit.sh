#!/bin/bash

echo "████████████████████████████████"
echo "██ Post-commit script running ██"
echo "████████████████████████████████"
date
date=$(date +%Y%m%d%H%M)

echo "#Mise en maintenance ${date}" > ./web/.htaccess
echo "<IfModule mod_rewrite.c> " >> ./web/.htaccess
echo "RewriteEngine On" >> ./web/.htaccess
echo "RewriteRule ^(app\.php)$ /index.html [L]" >> ./web/.htaccess
echo "RewriteRule ^((app\.php).+)$ /index.html [L]" >> ./web/.htaccess
echo "RewriteRule ^((en).+)$ /index.html [L]" >> ./web/.htaccess

echo "</IfModule>" >> ./web/.htaccess

#rm -rf ../node_modules/
npm install
/usr/local/bin/timeout.bash 2m npm start
#php composer.phar self-update
#php composer.phar install

#sh __bash/_schemaActions.sh
sh __bash/cls.sh
date
echo "████████████████████████████████"
echo "██      **** all good ****    ██"
echo "████████████████████████████████"