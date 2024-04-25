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

# cd /home/openphoto/@photogate/media-exif-sdk
# npm run dev &
# pids+=($!)

cd /home/openphoto/@photogate/api
npm run dev &
pids+=($!)

cd /home/openphoto/@photogate/api
./run.sh &
pids+=($!)

cd /home/openphoto/@photogate/explore-ui
npm start

killbg