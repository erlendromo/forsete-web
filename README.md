# Configuring
Configure your ".env" after the ".env.example" file.

# Installation of the project
Make sure you have, ["docker"](https://docs.docker.com/) installed.

```bash
docker compose up -d --buil # Build and run the container using Docker Compose
docker compose down --volumes --remove-orphans # Remove the container using Docker Compose
docker compose logs -f # See the logs of the container using Docker Compose

```
# Running the project
After that your project should be running at http://localhost:{PORT}/.

# Folder hierarchy
```
forsete-web
    ├── Dockerfile
    ├── LICENSE
    ├── Makefile
    ├── README.md
    ├── __tests__                      # Tests
    │   ├── dummyData.json
    │   ├── dummyData.pdf
    │   ├── jsonFormatter.test.ts
    │   └── pdf2pic.test.ts
    ├── jest.config.js
    ├── package-lock.json
    ├── package.json
    ├── public                         # Files that are served
    │   ├── dowload-pdf.js
    │   ├── images
    │   │   └── imgPlaceholder.jpg
    │   ├── js                         # Compiled typescript
    │   │   ├── filehandler.js
    │   │   ├── ham-menu.js
    │   │   ├── jsonFormatter.js
    │   │   ├── jsonLoader.js
    │   │   ├── pdf2img.js
    │   │   ├── post.js
    │   │   └── queryreader.js
    │   ├── styles                     # Compiled css
    │   │   └── output.css
    │   └── views                      # Views for end user
    │       ├── index.html
    │       └── results.html
    ├── server.js
    ├── src                            # Source code
    │   ├── styles
    │   │   └── input.css
    │   └── ts
    │       ├── filehandler.ts
    │       ├── ham-menu.ts
    │       ├── jsonFormatter.ts
    │       ├── jsonLoader.ts
    │       ├── pdf2img.ts
    │       ├── post.ts
    │       └── queryreader.ts
    └── tsconfig.json

```