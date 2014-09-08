Firefox marketplace
==========

Beta version of what Firefox marketplace could be

Setup
==========
a Nodejs based project using express.

run
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
To install the app, open up Firefox and from within Firefox, navigate to localhost:3000/install and you should be prompted to install the "FirefoxMarketBeta" app in Firefox.~~

Currently, it seems that trying to deploy a packaged app doesn't quite work on a local machine. The same install process will happen but instead of things 
being a seperate package, the app will end up "hosted" on the node server.

Preparing translation files 
==============
Preparing translations is handled using the angular plugin http://angular-gettext.rocketeer.be/
You will also require node.js + grunt in order to handle extracting the desired strings for translation.
Additionally, you will need gettext which can be easily installed via homebrew or macports. After installing you might need to run

```javascript
    
    brew link gettext --force

```
as mentioned here http://superuser.com/questions/747324/brew-install-gettext-should-i-force-link-it

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

