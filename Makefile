# Run in development mode
run:
	@npm run dev
.PHONY: run

# Build docker image
build:
	@docker build -t forsete-web .
.PHONY: build

# Run the dockerized image
launch:
	@docker run -d -p 3000:3000 forsete-web
.PHONY: launch