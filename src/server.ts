import config from "./config/config.js";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
// Utilities
import { pdfToImage } from "./util/pdfUtils.js";
import { sendATRRequest } from "./util/post.js";
import { saveJsonToFile, extractTextMapping } from "./util/jsonFormatter.js";
import { handleApiOrMock, handleMockEndpoints } from "./util/apiService.js"
// Index
import { getModelNames } from "./index/drawerHandler.js";
// Config
import { ApiEndpoints } from "./config/endpoint.js";
import { url } from "inspector";
import { Models } from "@interfaces/modelInterface.js";


const app = express();
const lineModel = 'yolov9-lines-within-regions-1';
const textModel = 'TrOCR-norhand-v3';
// Where files get stored
const uploadDir = "uploads";
// Public directory, where users will have access
const publicDir = "public";
// Where html are stored
const viewDir = "views";
// Endpoint
const transcribeEndpoint = "/transcribe";
const statusEndpoint = "/status";
const uploadEndpoint = "/upload";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set(viewDir, path.join(__dirname, "..", viewDir));

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
    const names = await getModelNames(modelEndPoint, response as Models);
    const modelNames = JSON.stringify(names);
    // Render EJS template and pass modelNames
    res.render('index', {
      modelNames:names
      //modelNames:['ExampleModel1', 'ExampleModel2', 'ExampleModel3']
     });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

// Status endpoint
app.get(statusEndpoint, (request, response) => {
  const status = {
    "Status": "Running"
    
  };
response.send(status);
});

// Create a POST endpoint that matches the fetch("/upload")
app.post(uploadEndpoint, upload.single("document"), async (req, res) => {
  try {
    console.log("Submitted file info:", req.file);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return; // exit after sending response
    }

    // If you want to check the extension, use 'originalname'
    if (req.file.originalname.toLowerCase().endsWith(".pdf")) {
      const pages = 1;
      const dpi = 300;

      // Convert PDF to image (pdfToImage expects the path on disk)
      //   The second arg can be a base name for the output file 
      //   (like req.file.filename).
      //   The third arg is the server path to the PDF.
      await pdfToImage(pages, req.file.filename, req.file.path, dpi);
    }

    res.status(200).json({
      message: "File uploaded successfully!",
      filename: req.file.filename // hashed name in ./uploads
    });
  } catch (err) {
    console.error('Error in /upload route:', err);
    res.status(500).json({ error: 'Server Error', details: String(err) });
  }
});

// Transcribe endpoint.
// Sends to the atr-endpoint
app.post(transcribeEndpoint, express.json(), async (req, res) => {

  const { filename } = req.body;
  console.log("Sent to atr:", filename);

  try {
    const { filename } = req.body;
    if (!filename) {
      res.status(400).json({ error: 'No filename provided' });
      return;
    }
    
    const filePath = path.join(__dirname, uploadDir, filename);
    const models = {
      lineSegmentationModel: lineModel,
      textRecognitionModel: textModel
    };
    
    const result = await sendATRRequest(
      ApiEndpoints.ATR_ENDPOINT,
      filePath,
      models
    );
    
    res.json({
      filename,
      atrResult: result.original
    });
    console.log("ATR Response Body:", JSON.stringify(result, null, 2));
    // Extracting the important data
    saveJsonToFile(extractTextMapping(result), filePath + ".json")

  } catch (error) {
    console.error("Error in"+ transcribeEndpoint +":", error);
    res.status(500).json({ error: "Something went wrong during transcription." });
  }
});

// Start server on port and log
app.listen(config.port, () => {
  console.log(`Server running: http://localhost:${config.port}`);
});

