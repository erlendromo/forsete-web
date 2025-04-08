# Run in development mode
run:
	@npm run dev
.PHONY: run

# Test the application
test:
	@npx jest
.PHONY: test

# Build the dockerized image
build:
	@docker compose up --build -d 
.PHONY: build

# Remove the dockerized image
remove:
	@docker compose down --volumes --remove-orphans
.PHONY: remove

# Remove the dockerized image
log:
	@docker compose logs -f                        
.PHONY: log