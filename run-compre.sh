RED='\033[0;31m'
NC='\033[0m' # No Color

args="--env-file ./config/.env -f ./docker-compose-local.yaml"

docker compose ${args} up -d compreface --force-recreate 