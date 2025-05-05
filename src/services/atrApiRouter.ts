import express from 'express';
import { postATRRequest } from "../atrApiService.js";
import { ApiEndpoints } from "../../config/constants.js";
import { AppRoute } from '../../config/constants.js';

const router = express.Router();
router.post(AppRoute.Transcribe, express.json(), async (req, res) => {

  try {
    const result = await postATRRequest(
    );
    
    res.json({
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