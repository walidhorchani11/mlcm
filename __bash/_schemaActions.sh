#!/bin/bash
echo "-----> Symfony DB Sync"
php app/console doctrine:generate:entities ArgoMCMBuilder
php app/console doctrine:schema:update --force
echo "-----> Symfony DB Sync :: Done **** "