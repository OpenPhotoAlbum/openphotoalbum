#!/bin/bash
cwd=${pwd}

killbg() {
        for p in "${pids[@]}" ; do
                echo "$p";
                kill "$p";
                cd $cwd;
        done
}

trap killbg EXIT

pids=()

# cd /home/openphoto/@photogate/compreface-sdk
# npm run dev &
# pids+=($!)

cd /home/openphoto/@photogate/media-exif-sdk
./scan.sh $1 $2

killbg