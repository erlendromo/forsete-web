import { config } from '../config/config.js';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
// Services
import uploadRouter from "../services/uploadService.js";
import atrRouter from "../services/atrService.js";
import { MenuService } from '../services/menuService.js';
// Config
import { ApiEndpoints } from "../config/endpoint.js";


const app = express();
// Public directory, where users will have access
const publicDir = "public";
// Where html are stored
const viewDir = "views";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set(viewDir, path.join(__dirname, "..", "..", viewDir));

// Serves the public folder and views
app.use(express.static(publicDir));
app.use(express.static(publicDir+"/"+ viewDir))

const menuService = new MenuService(config, ApiEndpoints.MODEL_ENDPOINT);
menuService.loadModelNames()
  .then(modelsToMenu => { app.locals.modelNames = modelsToMenu; })
  .catch(err => { console.error(err); process.exit(1); });

// Render home page
app.get('/', async (req, res) => {
  res.render('index');
});

// Render results page
app.get('/results', async (req, res) => {
  const fileName = req.query.file;
  try {
    // Render EJS template and pass modelNames
    res.render('results', {
      fileName,
    });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// upload endpoint
app.use(uploadRouter);

// atr endpoint
app.use(atrRouter);

// Start server on port and log
app.listen(config.port, () => {
  console.log(`Server running: http://localhost:${config.port}`);
});

