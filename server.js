import express  from 'express';
import multer from 'multer';
import path from 'path';
import { sendATRRequest } from './public/js/services/http/post.js';
import { saveJsonToFile } from './public/js/utils/json/jsonFormatter.js';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Create __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();
const PORT = process.env.PORT || 3000;
const URL = 'http://${ATRENDPOINT}:${ATRPORT}/forsete-atr/v1/atr/basic-documents/';
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
app.post(transcribeEndpoint, express.json(), async (req, res) => {
  try {
    console.log("Received transcribe request:", req.body);
    
    // Check if we have a filename in the request body
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }
    
    const filePath = path.join(__dirname, uploadDir, filename);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File not found: ${filename}` });
    }
    
    const models = {
      lineSegmentationModel: lineModel,
      textRecognitionModel: textModel
    };
    
    // Validate models before sending
    if (!models.lineSegmentationModel || !models.textRecognitionModel) {
      return res.status(400).json({ error: 'Model configuration is incomplete' });
    }
    
    console.log("Sending to ATR service:", {
      url: URL,
      file: filePath,
      models: models
    });
    
    const result = await sendATRRequest(
      URL,
      filePath,
      models
    );
    
    if (!result) {
      return res.status(500).json({ error: 'Empty response from ATR service' });
    }
    
    res.json({
      filename,
      atrResult: result.current
    });
    
    console.log("ATR Response received successfully");
    // Log only relevant parts to avoid overwhelming the console
    console.log("ATR Response summary:", {
      status: "success",
      fileProcessed: filename
    });
    
    // Save the result to a file
    await saveJsonToFile(result, filePath + ".json");
    
  } catch (error) {
    console.error("Error in transcribe endpoint:", error);
    
    // Provide more detailed error information
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = error.response?.status || 500;
    const responseData = error.response?.data || {};
    
    console.error("Error details:", {
      message: errorMessage,
      status: statusCode,
      data: responseData
    });
    
    // Send appropriate error response to client
    return res.status(statusCode).json({
      error: errorMessage,
      details: responseData
    });
  }
});


// Start server on port and log
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});