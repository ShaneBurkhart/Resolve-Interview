all: run

boot:
	$(MAKE) clean
	$(MAKE) build
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

c:
	docker-compose run --rm next bash