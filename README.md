# Installation of the project
Make sure you have ["make"](https://www.gnu.org/software/make/) and ["docker"](https://docs.docker.com/) installed.

```bash
make build # Build the docker image
make launch # Launch the docker image
```
# Running the project
After that your project should be running at http://localhost:3000/, or your configured port.

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