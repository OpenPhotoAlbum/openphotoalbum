#!/bin/bash

UPLOADS_DIRECTORY="/home/uploads/"

# Rename all files and directories to lowercase
# echo "Renaming all files and directories to lowercase..."
# find $UPLOADS_DIRECTORY -name "*" \( -type f -o -type d \) -execdir rename -v 'y/A-Z/a-z/' {} +

echo ""
echo "Replacing spaces with underscores..."
# Replace all spaces with underscores
find $UPLOADS_DIRECTORY -name "* *" \( -type f -o -type d \) #-execdir rename -v 's/ /_/g' {} +

echo ""
echo "Removing thumbs.db files..."
# Remove all thumbs.db files
find $UPLOADS_DIRECTORY -name thumbs.db -delete

echo ""
echo "Converting all HEIC files to JPG..."
# Convert all HEIC files to JPG
. /home/openphoto/heic-to-jpg.sh $UPLOADS_DIRECTORY