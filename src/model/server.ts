import { config } from '../config/config.js';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
// Utilities
import { handleApiOrMock } from "../model/services/apiService.js"
// Index
import { getModelNames } from "../controllers/menuHandler.js";
// Services
import uploadRouter from "./services/uploadService.js";
import atrRouter from "./services/atrService.js";
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



app.get('/', async (req, res) => {
  //res.render('index'); // Express will look for views/index.ejs
  try {
    loadMenu().then((names) => {
      console.log("Model names loaded successfully:", names);
      // Render EJS template and pass modelNames
      res.render('index', {
        //modelNames:['ExampleModel1', 'ExampleModel2', 'ExampleModel3']
        modelNames: names
      });
    }).catch((error) => {
      res.status(500).send((error as Error).message);
    });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// Results page
// This page will be used to show the results of the transcription
app.get('/results', async (req, res) => {
  const fileName = req.query.file;
  try {
    const names = await loadMenu();
    console.log("Model names loaded successfully:", names);
    // Render EJS template and pass modelNames
    res.render('results', {
      fileName,
      modelNames: names
    });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

async function loadMenu() {
    const modelEndPoint = config.urlBackend+ApiEndpoints.MODEL_ENDPOINT;
    const response = await handleApiOrMock(modelEndPoint, config.useMock)
    const names = await getModelNames(response as Models);
    return names;
}

// upload endpoint
app.use(uploadRouter);

// atr endpoint
app.use(atrRouter);

// Start server on port and log
app.listen(config.port, () => {
  console.log(`Server running: http://localhost:${config.port}`);
});

