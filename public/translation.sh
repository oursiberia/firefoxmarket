#!/bin/bash

#extract all the nodes that need translating into .pot files
grunt nggettext_extract

cd pot
for f in *.pot;
do
    echo "Processing $f file..."
    msginit --input=$f --output="../po/${f%.*}.po"
done