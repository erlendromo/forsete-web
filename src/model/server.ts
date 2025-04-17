import { config } from '../config/config.js';
import express from "express";
import multer from "multer";
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
// Where files get stored
const uploadDir = "uploads";
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

// Configure multer to store in 'uploads/'
const upload = multer({ dest: uploadDir + "/" });
app.use("/"+uploadDir, express.static(uploadDir));

app.get('/', async (req, res) => {
  //res.render('index'); // Express will look for views/index.ejs
  try {
    const modelEndPoint = config.urlBackend+ApiEndpoints.MODEL_ENDPOINT;

    const response = await handleApiOrMock(modelEndPoint, config.useMock)
    const names = await getModelNames(response as Models);
    // Render EJS template and pass modelNames
    res.render('index', {
      modelNames:names
      //modelNames:['ExampleModel1', 'ExampleModel2', 'ExampleModel3']
     });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// Create a POST endpoint that matches the fetch("/upload")
app.use(uploadRouter);

// Transcribe endpoint.
// Sends to the atr-endpoint
app.use(atrRouter);

// Start server on port and log
app.listen(config.port, () => {
  console.log(`Server running: http://localhost:${config.port}`);
});

