import express from 'express';
import path from "path";
import { postATRRequest } from "../atrApiService.js";
import { ApiEndpoints } from "../../config/constants.js";
import { AppRoute } from '../../config/constants.js';




const router = express.Router();
const uploadDir = "uploads";


// Models
const lineModel = 'yolov9-lines-within-regions-1';
const textModel = 'TrOCR-norhand-v3';

router.post(AppRoute.Transcribe, express.json(), async (req, res) => {

  const { filename } = req.body;
  console.log("Sent to atr:", filename);

  try {
    const { filename } = req.body;
    if (!filename) {
      res.status(400).json({ error: 'No filename provided' });
      return;
    }
 
    const result = await postATRRequest(
      ApiEndpoints.ATR_ENDPOINT,
      path.join(__dirname, uploadDir, filename),
       {
      lineSegmentationModel: lineModel,
      textRecognitionModel: textModel}
    );
    
    res.json({
      filename,
      atrResult: result.original
    });
    console.log("ATR Response Body:", JSON.stringify(result, null, 2));
    // Extracting the important data

  } catch (error) {
    console.error("Error in"+ AppRoute.Transcribe +":", error);
    res.status(500).json({ error: "Something went wrong during transcription." });
  }
});


router.put(AppRoute.Update, express.json(), async (req, res) => {

});

export default router;