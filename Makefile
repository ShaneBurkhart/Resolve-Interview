all: run

boot:
	touch .env.local
	$(MAKE) clean
	$(MAKE) build
	$(MAKE) npm
	$(MAKE) run
	$(MAKE) logs

build:
	docker-compose build

run: 
	docker-compose up -d

clean:
	docker-compose down
	docker-compose rm -f

restart:
	$(MAKE) clean
	$(MAKE) run
	$(MAKE) logs

logs:
	docker-compose logs -f

test:
	docker-compose run --rm next npm run test-watcher

c:
	docker-compose run --rm next bash

npm:
	docker-compose run --rm next npm install

download:
	mkdir -p ./data
	docker-compose run --rm next wget -O ./data/props.db https://resolve-dev-public.s3.amazonaws.com/sample-data/interview/props.db 

prod:
	docker-compose -f docker-compose.prod.yaml up -d --build

prod_logs:
	docker-compose -f docker-compose.prod.yaml logs