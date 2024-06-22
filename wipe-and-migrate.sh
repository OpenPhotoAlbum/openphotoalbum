find /home/openphoto/logs/ -type d -prune -exec rm -rf {} \;
mkdir /home/openphoto/logs/

cd /home/openphoto/services/database/init

find /home/uploads/ -type d -name scans -prune -exec rm -rf {} \;

knex migrate:down && knex migrate:up && knex seed:run