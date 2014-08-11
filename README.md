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
~~With the exception of the install.hjs file thats in the views folder, in order to create a Open Web App, all thats really needed are the files within the public folder. The Node backend is really more of a shell for testing.

To compile everything as a Open Web App, run the compile.sh script inside of the public folder. That will produce a package.zip file.

To install the app, open up Firefox and from within Firefox, navigate to localhost:3000/install and you should be prompted to install the "FirefoxMarketBeta" app in Firefox.~~

Currently, it seems that trying to deploy a packaged app doesn't quite work on a local machine. The same install process will happen but instead of things 
being a seperate package, the app will end up "hosted" on the node server.

