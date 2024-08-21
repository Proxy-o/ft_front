
all:
	bash init.sh
	mkdir -p ./postgres
	docker-compose -f ./docker-compose.yml up -d
	@echo ""
	@echo "\033[0;32m######################### \033[0m"
	@echo "\033[0;32mSERVER IS READY TO USE \033[0m"
	@echo "\033[0;32m######################### \033[0m"
	@echo ""
	@echo "\033[0;31mServer adress: https://127.0.0.1 \033[0m"
	@echo ""

build:
	
	docker-compose -f ./docker-compose.yml build

down:
	
	docker-compose -f ./docker-compose.yml down

re:	down
	
	docker-compose -f ./docker-compose.yml up -d --build

clean: down
	
	docker system prune -a

fclean:
	rm -rf ./postgres  
	docker stop $$(docker ps -qa) 2>/dev/null || true
	docker rm $$(docker ps -qa) 2>/dev/null || true
	docker rmi -f $$(docker images -qa) 2>/dev/null || true
	docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	docker network rm $$(docker network ls -q) 2>/dev/null || true

.PHONY	: all build down re clean fclean