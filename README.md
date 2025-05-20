# FORSETE-WEB

## Configuring
Configure your ".env" after the ".env.example" file.

## Installation of the project
Make sure you have, ["docker"](https://docs.docker.com/) installed.

```bash
docker compose up -d --build # Build and run the container using Docker Compose
docker compose down --volumes --remove-orphans # Remove the container using Docker Compose
docker compose logs -f # See the logs of the container using Docker Compose

```
## Running the project
After that your project should be running at http://localhost:{PORT}/.

## Folder hierarchy
```
forsete-web
    ├── Dockerfile
    ├── LICENSE
    ├── Makefile
    ├── README.md
    ├── __tests__
    │   ├── dummyData.json
    │   ├── dummyData.pdf
    │   ├── jsonFormatter.test.ts
    │   └── pdf2pic.test.ts
    ├── jest.config.js
    ├── package-lock.json
    ├── package.json
    ├── public
    │    ├── flowbite
    │    │   ├── flowbite.min.js
    │    │   └── flowbite.min.js.map
    │    ├── images
    │    │   ├── favicon_io
    │    │   │   └── favicon.ico
    │    │   └── image-placeholder.jpg
    │    ├── userManual
    │    │   └── userManual.pdf
    │    └── views
    │        ├── index.ejs
    │        ├── login.ejs
    │        ├── partials
    │        │   ├── drawer
    │        │   │   ├── configurationSetting
    │        │   │   │   ├── configurationSetting.ejs
    │        │   │   │   └── modelArea.ejs
    │        │   │   ├── drawer.ejs
    │        │   │   └── drawerLogin.ejs
    │        │   ├── header.ejs
    │        │   └── loader.ejs
    │        ├── register.ejs
    │        └── results.ejs
    ├── server.js
    ├── tsconfig.json
    ├── src
    │    ├── config
    │    │   ├── apiConfig.ts
    │    │   ├── config.ts
    │    │   ├── constants.ts
    │    │   └── util.ts
    │    ├── controllers
    │    │   ├── components
    │    │   │   ├── compResult.ts
    │    │   │   ├── documentEditor
    │    │   │   │   ├── documentEditor.ts
    │    │   │   │   ├── imageContainer.ts
    │    │   │   │   └── lineEditor.ts
    │    │   │   └── zoomImage.ts
    │    │   ├── indexController.ts
    │    │   ├── loginController.ts
    │    │   ├── registerController.ts
    │    │   ├── settingsController.ts
    │    │   └── utils
    │    │       ├── transcribeHelper.ts
    │    │       └── ui
    │    │           ├── alert.ts
    │    │           ├── indexElements.ts
    │    │           └── spinner.ts
    │    ├── interfaces
    │    │   ├── atrResult.types.ts
    │    │   ├── config.types.ts
    │    │   ├── lineSegment.types.ts
    │    │   ├── modelInterface.types.ts
    │    │   └── userInterface.types.ts
    │    ├── middleware
    │    │   └── requireAuth.ts
    │    ├── mocks
    │    │   ├── atrResponse.json
    │    │   ├── mockutil.ts
    │    │   └── modelResponse.json
    │    ├── model
    │    │   └── server.ts
    │    ├── routes
    │    │   ├── apiRoutes.ts
    │    │   ├── renderingRoutes.ts
    │    │   └── utils
    │    │       └── export
    │    │           ├── exportHandler.ts
    │    │           ├── jsonExport.ts
    │    │           ├── pdfExport.ts
    │    │           └── txtExport.ts
    │    ├── services
    │    │   ├── apiService.ts
    │    │   ├── atrApi
    │    │   │   ├── apiATRService.ts
    │    │   │   ├── apiImageService.ts
    │    │   │   └── apiOutputService.ts
    │    │   ├── atrApiHandler.ts
    │    │   ├── atrModels.ts
    │    │   ├── index
    │    │   │   ├── handlepdfToImageService.ts
    │    │   │   └── validationService.ts
    │    │   ├── menuService.ts
    │    │   ├── results
    │    │   │   └── document-manager.ts
    │    │   └── userHandlingService.ts
    │    ├── styles
    │    │   ├── input.css
    │    │   ├── results.css
    │    │   └── util.css
    │    └── utils
    │        ├── cookieUtil.ts
    │        ├── error-handling.ts
    │        └── pdfUtils.ts
```
