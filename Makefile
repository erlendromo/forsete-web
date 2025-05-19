# Compiles the typscript files to javascript
comp:
	@tsc

# Run in development mode
run: comp
	@npm run dev
.PHONY: run

# Test the application
test:
	@npx jest
.PHONY: test

# Build and run the container using Docker Compose
launch:
	@docker compose up -d --build
.PHONY: launch

# Remove the container using Docker Compose
remove:
	@docker compose down --volumes --remove-orphans
.PHONY: remove

# See the logs of the container using Docker Compose
log:
	@docker compose logs -f                        
.PHONY: log
