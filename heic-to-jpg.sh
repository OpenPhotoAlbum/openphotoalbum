#!/bin/bash
# Recursively converts all HEIC files to JPG for the specified directory. Skips any files that have already
# been converted. Requires tifig, download latest  release from github: 
# https://github.com/monostream/tifig/releases and install at /usr/bin/tifig
# (or add the install location you choose to your $PATH)
#
# usage: ./heicToJpg.sh [RootDirectory]
#
rootDir=$1
if [ -z "$rootDir" ]
then
    echo "Need to specify root directory."
    exit 1
fi

find $rootDir -type f -iname "*.heic" | while read f
do
    n=$(echo $f | sed 's/.heic/.jpg/I') 

    if [ -f $n ]; then
        rm $f
        continue
    fi

    mime=$(exiftool -S -s -MIMEType $f)

    echo "Converting $f to $n"
    if [[ "$mime" == "image/jpeg" ]]; then
        mv $f $n
    else
        tifig -i "$f" -o "$n" 
    fi

done