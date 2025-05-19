import { config } from '../config/config.js';
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import { MenuService } from '../services/menuService.js';
import apiRouter from "../routes/apiRoutes.js";
import renderRouter from "../routes/renderingRoutes.js";
import { ModelsSingelton } from "../services/atrModels.js";

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
};
// Loads the models
const loadModels = async () => {
  const menuService = new MenuService(config);
  try {
    const modelsToMenu = await menuService.loadAllModels();
    app.locals.modelNames = modelsToMenu;
  } catch (err) {
    console.error('Error loading models:', err);
    process.exit(1); // Terminate the server if model loading fails
  }
};

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`Server running: http://localhost:${config.port}`);
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