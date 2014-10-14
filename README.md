Firefox marketplace
==========

Beta version of what Firefox marketplace could be

Setup
==========
a Node.js based project using Express. It's technically a client-side project but requires
Node in order to prepare translations, generate documentation, and compile/minify scripts used
in the application.



To get started, run
```javascript
  npm install
```

to install all the node packages.


There are some client side dependencies like Angular.js which should already be included. In the event they are missing you should be able to run

```javascript
  bower install
```

from within the public directory to get the necessary libraries.

run 
```javascript
node app.js
```
from within the root of the project. The server will start at localhost:3000

To run as Open Web App
============
To install the app, run the deploy script called compilie.sh,  which will create a folder in the "public" directory called "deploy" and generate a static version of the website into that folder. You should have two html files, a index.html and a install.html which can be used to trigger the installation of the Marketplace. Remember to change the script in the install.html file to point to the final destination of the manifest.webapp file. 

When trying to install as a package, remember to change the package_path field to point to the location of the package.zip set.

Currently, it seems that trying to deploy a packaged app doesn't quite work on a local machine. 

Packaging for deployment
============
See above.


Preparing translation files 
==============
Preparing translations is handled using the angular plugin [angular-gettext](www.angular-gettext.rocketeer.be/)


You will also require node.js + grunt in order to handle extracting the desired strings for translation.


Additionally, you will need gettext which can be easily installed via homebrew or macports. After installing you might need to run

```javascript
    
    brew link gettext --force

```
as mentioned here http://superuser.com/questions/747324/brew-install-gettext-should-i-force-link-it.
It should be noted that it's entirely possible you already have gettext on your machine.


__Specifying locales__
Right now, all translations are set up to go into a single .pot file.

You can change this behavior in the Gruntfile
````javascript
   nggettext_extract :{
            pot:{
                files:{
                    "public/pot/en-US.pot":[
                        __dirname + "/public/build/templates/*.html"
                    ]
                    
                    // you could specify more locales like so to make seperate .pot files
                    "public/pot/zh-TW.pot":[
                                __dirname + "/public/build/templates/*.html"
                    ]
                }
            }
        },
````

More documentation can be found on the angular-gettext website.

__Extracting text for translation__
To prepare a page for translation, you need to append the Angular directive "translate" to all the nodes that require translation.


After that's complete, you can then run the translation.sh script. The script extracts those node's content(with the -e flag), turns them into .pot files, then creates .po files from them(with the -c flag). 
<br/>
<br/>
The .pot files will end up in public/pot and the .po files will end up in public/po

Once you have the compiled files, you can configure the Main.js file to display the translated strings using the "gettextCatalog.setCurrentLanguage" method like so

```javascript
angular.module('myApp').run(function (gettextCatalog) {
    gettextCatalog.setCurrentLanguage('nl');
});
```

Please note that currently, the language settings have not been adjusted aside from getting translation .po files. Please see the [angular-gettext website](https://angular-gettext.rocketeer.be/dev-guide/configure/) for more information on implementation.


Documentation
=========
Documentation is generated via grunt by running 
````javascript
grunt ngdocs

````

Documentation will appear in the "docs" folder when complete.
The generator uses Angular to create the documentation site so 
you'll have to be running some kind of a server setup to see the docs.


Editorial Generator
============
This files for this can be found at in the editorial folder.

You will need the node server running in order to be able to save this out because
the filesystem api is apparently going to be deprecated soon so things have 
shifted to a server setup so we can actually save out the json file.


The way it works is that each box represents one editorial box. You can add as many 
editorial items as you want in addition to as many application ids you want, but 
for the purposes of this beta, we will only be taking the first 3 editorial boxes.
