import express from 'express';
import path from "path";
import { sendATRRequest } from "../services/http/post.js";
import { ApiEndpoints } from "../../config/endpoint.js";
import { saveJsonToFile, extractTextMapping } from "../../util/json/jsonFormatter.js";



const router = express.Router();
const uploadDir = "uploads";
const transcribeEndpoint = "/transcribe";

// Models
const lineModel = 'yolov9-lines-within-regions-1';
const textModel = 'TrOCR-norhand-v3';

router.post(transcribeEndpoint, express.json(), async (req, res) => {

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
    saveJsonToFile(result, filePath)

  } catch (error) {
    console.error("Error in"+ transcribeEndpoint +":", error);
    res.status(500).json({ error: "Something went wrong during transcription." });
  }
});

export default router;