//src/model/server.ts
import { config } from '../config/config.js';
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
// Services
import uploadRouter from "../services/index/uploadService.js";
import atrRouter from "../services/index/atrService.js";
import { MenuService } from '../services/menuService.js';
// Config
import { ApiEndpoints } from "../config/constants.js";
import apiRouter from "../routes/apiRoutes.js";
import renderRouter from "../routes/renderingRoutes.js";

const app = express();
// Public directory, where users will have access
const publicDir = "public";
// Where html are stored
const viewDir = "views";

const setViews = () => {
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'public/views'));
}

// Serves the public folder and views
const configureMiddlewares = () => {
  app.use(express.static(publicDir));
  app.use(express.static(path.join(publicDir, viewDir)));
  app.use(cookieParser());
  app.use(express.json());
  app.use(apiRouter);
  app.use(renderRouter);
  app.use(uploadRouter);
  app.use(atrRouter);
};


const startServer = () => {
  const documentation = 'forsete-atr/v2/swaggo/index.html';
  app.listen(config.port, () => {
    console.log(`Server running: http://localhost:${config.port}`);
    console.log(`Backend documentation: ${config.urlBackend}${documentation}`);
  });
};

const setupServer = async () => {
  setViews();
  configureMiddlewares();
  //await loadModels();
  startServer();
};

setupServer();

