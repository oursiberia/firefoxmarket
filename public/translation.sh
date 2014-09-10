#!/bin/bash

#this script serves 2 purposes
# 1 . It can extract all the strings in the templates marked for translation
# 2. It can also take .pot files and convert them into .po files
# 3. It finally can build the .po files into something useable by angular.

while getopts ":ecb:" opt; do
  case $opt in
    e)
        #extract all the nodes that need translating into .pot files
        grunt nggettext_extract
      ;;
    c)
        echo "here"
        cd pot
            for f in *.pot;
            do
            echo "Processing $f file..."
            msginit --input=$f --output="../po/${f%.*}.po"
        done
    ;;

    b)
        grunt nggettext_compile
    ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

exit 0