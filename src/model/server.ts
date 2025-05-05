//src/model/server.ts
import { config } from '../config/config.js';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
// Services
import uploadRouter from "../services/index/uploadService.js";
import atrRouter from "../services/index/atrApiRouter.js";
import { MenuService } from '../services/menuService.js';
// Config
import { ApiEndpoints } from "../config/constants.js";
import authRouter from "../routes/apiRoutes.js";
import renderRouter from "../routes/renderingRoutes.js";
import { ModelsSingelton } from '../config/atrModels.js';

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
  app.use(authRouter);
  app.use(renderRouter);
  app.use(uploadRouter);
  app.use(atrRouter);
};

const loadModels = async () => {
  const menuService = new MenuService();
  try {
    const modelsToMenu = await menuService.loadModelNames();
    app.locals.modelNames = modelsToMenu;
  } catch (err) {
    console.error('Error loading models:', err);
    process.exit(1); // Terminate the server if model loading fails
  }
};

const startServer = () => {
  const documentation = 'forsete-atr/v2/swaggo/index.html';
  app.listen(config.port, () => {
    console.log(`Server running: http://localhost:${config.port}`);
    console.log(`Backend documentation: `);
  });
};

const setupServer = async () => {
  setViews();
  configureMiddlewares();
  const modelsSingelton = ModelsSingelton.getInstance();
  await modelsSingelton.init();
  await loadModels();
  startServer();
};

setupServer();