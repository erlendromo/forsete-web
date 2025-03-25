import express,{Request, Response} from 'express';
import multer from 'multer';
import path from 'path';
import { sendATRRequest } from './services/http/post';
import { saveJsonToFile } from './utils/json/jsonFormatter';
import { DocumentManager } from './services/document-manager';

// Create and export the express app
export function createApp() {
  const app = express();
  
  // Constants
  const URL = 'http://10.212.172.171:8080/forsete-atr/v1/atr/basic-documents/';
  const lineModel = 'yolov9-lines-within-regions-1';
  const textModel = 'TrOCR-norhand-v3';
  const uploadDir = "uploads";
  const publicDir = "public";
  const viewDir = "views";

  // Endpoint constants
  const transcribeEndpoint = "/transcribe";
  const statusEndpoint = "/status";
  const uploadEndpoint = "/upload";

  // Serves the public folder and views
  app.use(express.static(path.join(__dirname, '..', publicDir)));
  app.use(express.static(path.join(__dirname, '..', publicDir, viewDir)));

  // Configure multer to store in 'uploads/'
  const upload = multer({ dest: uploadDir + "/" });
  app.use("/" + uploadDir, express.static(uploadDir));

  // Status endpoint
  app.get(statusEndpoint, (request, response) => {
    const status = {
      "Status": "Running"
    };
    response.send(status);
  });



  // Create a POST endpoint that matches the fetch("/upload")
  app.post(uploadEndpoint, upload.single("document"), (req :Request , res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Submitted file info:", req.file);
    
    res.status(200).json({
      message: "File uploaded successfully!",
      filename: req.file?.filename
    });
    

  });

  // Transcribe endpoint.
  // Sends to the atr-endpoint
  app.post(transcribeEndpoint, express.json(), async (req: Request, res: Response): Promise<any> => {
    console.log("Sent to atr:", req.file);
  
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ error: 'No filename provided' });
      }
      
      const filePath = path.join(process.cwd(), uploadDir, filename);
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
        atrResult: result
      });
      console.log("ATR Response Body:", JSON.stringify(result, null, 2));
      // Extracting the important data
      saveJsonToFile(result, filePath + ".json");
      const documentManager = new DocumentManager(result);
  
    } catch (error) {
      console.error("Error in" + transcribeEndpoint + ":", error);
      res.status(500).json({ error: "Something went wrong during transcription." });
    }
  });

  return app;
}

