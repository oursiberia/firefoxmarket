#!/bin/sh

#make a temp folder
mkdir compile_temp

#copy all the app folders
cp -rf app compile_temp/app
cp -rf build compile_temp/build
cp -rf css compile_temp/css
cp -rf img compile_temp/img
cp -rf js compile_temp/js
cp -rf index.html compile_temp/index.html
cp -rf manifest.webapp compile_temp/manifest.webapp

#zip it up
zip package.zip compile_temp/

#remove temp folder
rm -rf compile_temp

