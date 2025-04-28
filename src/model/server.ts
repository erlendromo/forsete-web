import { config } from '../config/config.js';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
// Utilities
import { handleApiOrMock } from "../services/apiService.js"
// Services
import uploadRouter from "../services/uploadService.js";
import atrRouter from "../services/atrService.js";
import { MenuService } from '../services/menuService.js';
// Config
import { ApiEndpoints } from "../config/endpoint.js";
import { Models } from "../interfaces/modelInterface.js";


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
  .then(names => { app.locals.modelNames = names; })
  .catch(err => { console.error(err); process.exit(1); });


app.get('/', async (req, res) => {
  //res.render('index'); // Express will look for views/index.ejs
  res.render('index', { } )
});

// Results page
// This page will be used to show the results of the transcription
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

