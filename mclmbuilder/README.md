.checkout
=========

A Symfony project created on August 17, 2016, 4:44 pm.

1 - Clone Project
----------------------------------

To clone project in your local machine, you should execute this command line in terminal :
    git clone https://mbouchala@bitbucket.org/argolife/mclmbuilder.git
    
> **Careful**  you should copy your specific link to project

2 - Configuration Environment
----------------------------------

#### First Step : Install Vendors

To install vendors you should execute this command line in terminal :
     php composer.phar install

#### Second Step : Install assets (css, js, images, etc...)

To install assets you should execute this command line in terminal :
     php app/console assets:install --symlink --relative
     
#### Third Step : Dumping Asset Files

To install assets you should execute this command line in terminal :
     php app/console assetic:dump

#### Finaly Step : Clear Cache
         
To clear cache you should execute this command line in terminal :
     php app/console cache:clear
     
> **Careful**  you should execute all commands from root of the project
     

