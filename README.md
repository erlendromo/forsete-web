# Configuring
Configure your ".env" after the ".env.example" file.

# Installation of the project
Make sure you have, ["docker"](https://docs.docker.com/) installed.

```bash
docker compose up -d --build # Build and run the container using Docker Compose
docker compose down --volumes --remove-orphans # Remove the container using Docker Compose
docker compose logs -f # See the logs of the container using Docker Compose

```
# Running the project
After that your project should be running at http://localhost:{PORT}/.
