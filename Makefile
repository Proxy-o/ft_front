RUNDIR = ./postgres_data ./vault_data


all: build up
	@echo ""
	@echo "\033[0;32m######################### \033[0m"
	@echo "\033[0;32mSERVER IS READY TO USE \033[0m"
	@echo "\033[0;32m######################### \033[0m"
	@echo ""
	@echo "\033[0;31mServer address: https://$(shell grep SERVER_HOST .env | cut -d '=' -f 2) \033[0m"
	@echo ""

up:
	docker-compose -f ./docker-compose.yml up -d

build:
	bash tools/init.sh
	docker-compose -f ./docker-compose.yml build

down:
	docker-compose -f ./docker-compose.yml down

stop:
	docker-compose -f ./docker-compose.yml stop

logs:
	docker-compose -f ./docker-compose.yml logs $(s)

test_waf:
	./nginx/tools/test_waf.sh

clean:
	docker-compose -f ./docker-compose.yml down --rmi all --volumes
	rm -rf $(RUNDIR)

oup:
	docker-compose build $(s)
	docker-compose up $(s) -d

oclean:
	docker-compose stop $(s)
	docker-compose rm -f $(s)
	docker images -q $(s):local | xargs $(if $(filter $(shell uname),Linux),-r,) docker rmi
	docker volume ls -qf dangling=true | xargs $(if $(filter $(shell uname),Linux),-r,) docker volume rm

fclean:
	docker stop $$(docker ps -qa) 2>/dev/null || true
	docker rm $$(docker ps -qa) 2>/dev/null || true
	docker rmi -f $$(docker images -qa) 2>/dev/null || true
	docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	docker network rm $$(docker network ls -q) 2>/dev/null || true
	rm -rf $(RUNDIR)

delenv:
	@rm -f .env frontend/.env
	echo "Environment files removed"

deldir:
	rm -rf $(RUNDIR)

re:	clean deldir all

.PHONY	: all build down re clean fclean logs test_waf oclean start stop up delenv deldir obuild