#!/bin/sh

# Packages the app up into a zip file for installation
# currently, it seems that things don't work in a local enviroment, so for now, this doesn't matter

#make sure stuff gets built
grunt default

#make a temp folder
mkdir compile_temp

#copy all the app folders
cp -rf bower_components compile_temp/app
cp -rf build compile_temp/build
cp -rf css compile_temp/css
cp -rf img compile_temp/img
cp -rf js compile_temp/js
cp -rf index.html compile_temp/index.html
cp -rf manifest.webapp compile_temp/manifest.webapp
cp -rf install.html compile_temp/install.html

#zip it up
zip package.zip compile_temp/

#remove temp folder
rm -rf compile_temp

#create the deploy folder
rm -rf deploy
mkdir deploy

cp -rf bower_components deploy/bower_components
cp -rf build deploy/build
cp -rf css deploy/css
cp -rf img deploy/img
cp -rf index.html deploy/index.html
cp -rf install.html deploy/install.html
cp -rf package.zip deploy/package.zip
cp -rf manifest.webapp deploy/manifest.webapp
cp -rf fonts deploy/fonts

