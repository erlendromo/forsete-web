//src/model/server.ts
import { config } from '../config/config.js';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
// Services
import uploadRouter from "../services/index/uploadService.js";
import atrRouter from "../services/index/atrService.js";
import { MenuService } from '../services/menuService.js';
// Config
import { ApiEndpoints } from "../config/constants.js";
import authRouter from "../routes/apiRoutes.js";
import renderRouter from "../routes/renderingRoutes.js";

const app = express();
// Public directory, where users will have access
const publicDir = "public";
// Where html are stored
const viewDir = "views";


// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'public/views'));



// Serves the public folder and views
app.use(express.static(publicDir));
app.use(express.static(publicDir+"/"+ viewDir));
app.use(cookieParser());

app.use(authRouter);
app.use(renderRouter);

const menuService = new MenuService(config, ApiEndpoints.MODELS_ENDPOINT);
menuService.loadModelNames()
  .then(modelsToMenu => { app.locals.modelNames = modelsToMenu; })
  .catch(err => { console.error(err); process.exit(1); });

// upload endpoint
app.use(uploadRouter);

// atr endpoint
app.use(atrRouter);

// Start server on port and log
app.listen(config.port, () => {
  console.log(`Server running: http://localhost:${config.port}`);
});

