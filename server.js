const express = require('express');
const multer = require('multer');
const path = require('path');
const { pdfToImage } = require('./public/js/pdfUtils.js');
const { sendATRRequest } = require('./public/js/post.js');
const { saveJsonToFile } = require('./public/js/jsonFormatter.js');
const { extractTextMapping } = require('./public/js/jsonFormatter.js');

const app = express();
const PORT = process.env.PORT || 3000;
const URL = 'http://10.212.170.96:8080/forsete-atr/v1/atr/basic-documents/';
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

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set(viewDir, path.join(__dirname, publicDir, viewDir));

// Serves the public folder and views
app.use(express.static(publicDir));
app.use(express.static(publicDir+"/"+ viewDir))

// Configure multer to store in 'uploads/'
const upload = multer({ dest: uploadDir + "/" });
app.use("/"+uploadDir, express.static(uploadDir));

app.get('/', (req, res) => {
  res.render('index'); // Express will look for views/index.ejs
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
      return res.status(400).json({ error: 'No filename provided' });
    }
    
    const filePath = path.join(__dirname, uploadDir, filename);
    const models = {
      lineSegmentationModel: lineModel,
      textRecognitionModel: textModel
    };
    
    const result = await sendATRRequest(
      URL,
      filePath,
      models
    );
    
    res.json({
      filename,
      atrResult: result.current
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
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

