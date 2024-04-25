echo $1
echo $2

SCAN_COUNT=$2 SCAN_DIR=$1 nodemon --ignore ./sample/ ./scan-and-extract.js
