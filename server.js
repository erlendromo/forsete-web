import express from 'express';
import multer from 'multer';
import path from 'path';
import { sendATRRequest } from './public/js/services/http/post.js';
import { saveJsonToFile } from './public/js/utils/json/jsonFormatter.js';

const app = express();
const PORT = process.env.PORT || 3000;
const URL = 'http://10.212.172.171:8080/forsete-atr/v1/atr/basic-documents/';
const lineModel = 'yolov9-lines-within-regions-1';
const textModel = 'TrOCR-norhand-v3';
const uploadDir = "uploads";
const publicDir = "public";
const viewDir = "views";

// Endpoint
const transcribeEndpoint = "/transcribe";
const statusEndpoint = "/status";
const uploadEndpoint = "/upload";

// Serves the public folder and views
app.use(express.static(publicDir));
app.use(express.static(publicDir+"/"+ viewDir))

// Configure multer to store in 'uploads/'
const upload = multer({ dest: uploadDir + "/" });
app.use("/"+uploadDir, express.static(uploadDir));

// Status endpoint
app.get(statusEndpoint, (request, response) => {
  const status = {
    "Status": "Running"
  };
response.send(status);
});

// Create a POST endpoint that matches the fetch("/upload")
app.post(uploadEndpoint, upload.single("document"), (req, res) => {
  // Logs the submitted file
  console.log("Submitted file info:", req.file);
  // Sending back to front-end
  res.status(200);
  res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename
  });
});

// Transcribe endpoint.
// Sends to the atr-endpoint
app.post(transcribeEndpoint, upload.single("document"), express.json(), async (req, res) => {
  console.log("Sent to atr:", req.file);

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
    
    const result = await sendATRRequest(URL, filePath, models);
    
    res.json({
      filename,
      atrResult: result.current
    });

    console.log("ATR Response Body:", JSON.stringify(result, null, 2));
    saveJsonToFile(result, filePath + ".json");

  } catch (error) {
    console.error("Error in /transcribe:", error);
    res.status(500).json({ error: "Something went wrong during transcription." });
  }
});


// Start server on port and log
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});