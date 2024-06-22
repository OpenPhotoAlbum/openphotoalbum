# nodemon ./dist/index.cjs
fuser -k 9447/tcp
nodemon -r source-map-support/register ./dist/index.cjs
