tput rmam
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1
export DOCKER_GID=$(id --group)
export DOCKER_UID=$(id --user)
case $1 in
  build)
    docker-compose --file docker-compose.yml --project-name hiring-dashboard build
    ;;
  up)
    docker-compose --file docker-compose.yml --project-name hiring-dashboard up --build --remove-orphans
    docker-compose --file docker-compose.yml --project-name hiring-dashboard down
    ;;
  down)
    docker-compose --file docker-compose.yml --project-name hiring-dashboard down
    ;;
  rm)
    docker-compose --file docker-compose.yml --project-name hiring-dashboard rm --force --stop --volumes
    ;;
  *)
    docker-compose --file docker-compose.yml --project-name hiring-dashboard "$@"
    ;;
esac
