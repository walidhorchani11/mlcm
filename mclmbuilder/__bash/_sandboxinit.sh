#!/bin/bash
echo "████████████████████████████████"
echo "██ Post-commit script running ██"
echo "████████████████████████████████"

echo "Clone Project"
git clone git@bitbucket.org:argolifetunis/mclmbuilder.git $1
cd $1
git checkout Sand-Box

echo "Remove parametres.yml"
rm -rf app/config/parameters.yml
cd app/config/
ln -s parameters.yml.sandbox parameters.yml
#cp app/config/parameters.yml.sandbox app/config/parameters.yml
cd ../..

mkdir -p web/S3/_Mediatheque
mkdir -p web/S3/_PDF
mkdir -p web/S3/_Thumbs
mkdir -p web/S3/_Zip

ln -s  web/S3/_PDF slides-pdf
ln -s  web/S3/_Thumbs _Thumbs
ln -s  web/S3/_Mediatheque uploads
ln -s  web/S3/_Zip zip_output

echo "Prepare env"
php composer.phar install
npm install
/usr/local/bin/timeout.bash 2m npm start

echo "Update project"
php app/console doctrine:schema:update --force
php app/console doctrine:generate:entities ArgoMCMBuilder

php app/console fos:user:create beyrem.chouaieb@argolife.fr beyrem.chouaieb@argolife.fr Azerty123
php app/console fos:user:promote beyrem.chouaieb@argolife.fr ROLE_SUPER_ADMIN

php app/console fos:user:create nada.dhaouadi@argolife.com nada.dhaouadi@argolife.com Azerty123
php app/console fos:user:promote nada.dhaouadi@argolife.com ROLE_MANAGER

php app/console fos:user:create demo@demo.fr demo@demo.fr Azerty123
php app/console fos:user:promote demo@demo.fr ROLE_BASIC_USER

sh __bash/cls.sh

echo "Add presentation"
dbname=$(grep "database_name" ./app/config/parameters.yml | cut -d " " -f 6)
dbuser=$(grep "database_user" ./app/config/parameters.yml | cut -d " " -f 6)
dbpassword=$(grep "database_password" ./app/config/parameters.yml | cut -d " " -f 6)
mysql -u"$dbpassword" -p"$dbuser" "$dbname" < __bash/sandobox.sql

echo "████████████████████████████████"
echo "██      **** all good ****    ██"
echo "████████████████████████████████"


