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


You'll also need to run

```javascript
  bower install
```

from within the public directory as the site uses Angular for very client side management.

run 
```javascript
node app.js
```
from within the root of the project. The server will start at localhost:3000


To run as Open Web App
============
To install the app, once you start the Node server,  open up Firefox and from within Firefox, navigate to localhost:3000/install and you should be prompted to install the "FirefoxMarketBeta" app in Firefox.~~

Currently, it seems that trying to deploy a packaged app doesn't quite work on a local machine. The same install process will happen but instead of things 
being a seperate package, the app will end up "hosted" on the node server.

Packaging
============
Once the app is complete, you can run the compilie.sh script which will generate a deploy folder within the "public" directory. That folder should contain 
all the app files along with a package.zip in case you were planning on deploying the app as a packaged app. The install.html will probably need to be modified
prior to compilation.


Preparing translation files 
==============
Preparing translations is handled using the angular plugin http://angular-gettext.rocketeer.be/
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
After that's complete, you can then run the translation.sh script. The script extracts those node's content, turns them into .pot files, then 
creates .po files from them. 
<br/>
<br/>
The .pot files will end up in public/pot and the .po files will end up in public/po


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