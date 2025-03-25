# Compiles the typscript files to javascript
comp:
	@tsc

# Run in development mode
run: comp
	@npm run dev
.PHONY: run

# Build docker image
build: comp
	@docker build --no-cache -t forsete-web .
.PHONY: build

# Test the application
test:
	@npx jest
.PHONY: test

# Run the dockerized image
launch: 
	@docker run -d -p 3000:3000 forsete-web
.PHONY: launch