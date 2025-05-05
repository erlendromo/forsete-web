import express from 'express';
import multer from 'multer';
import { pdfToImage } from '../../utils/pdfUtils.js';
import { uploadImage } from '../../services/atr-api/apiImageService.js'; 
import { postATRRequest } from '../../services/atr-api/apiATRService.js'; 
import { AppRoute } from '../../config/constants.js';
import { ModelsSingelton } from '../../config/atrModels.js';
import { ImageProcessingConfig } from '../../interfaces/configInterface.js';

const atrRouter = express.Router();

// Set up memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create an in-memory route that doesn't save the file
atrRouter.post(AppRoute.Transcribe, upload.single("document"), async (req, res) => {
  try {
    console.log("Submitted file info:", req.file);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return; // exit after sending response
    }

    // If the file is a PDF, convert it to an image buffer in memory
    let imageBuffer;
    if (req.file.originalname.toLowerCase().endsWith(".pdf")) {
      const pages = 1;
      const dpi = 300;
      // Convert PDF to image buffer
      // imageBuffer = await pdfToImage(pages, req.file.originalname, req.file.buffer, dpi);
    } else {
      imageBuffer = req.file.buffer;
    }

    const imageUploadResponse = await uploadImage(imageBuffer, req.file.originalname); 

    if (!imageUploadResponse) {
      res.status(500).json({ error: "Failed to upload image" });
      return;
    }
    const atrConfig: ImageProcessingConfig = {
    image_ids: [imageUploadResponse.image_id],
    line_segmentation_model: ModelsSingelton.getInstance().getLineSegmentationModels()[0].name,
    text_recognition_model: ModelsSingelton.getInstance().getTextRecognitionModels()[0].name,};
    const atrResponse = await postATRRequest(atrConfig);

    // Send the ATR response back to the user
    res.status(200).json({
      message: "Image uploaded and ATR processing completed successfully!",
      atrResponse: atrResponse
    });
  } catch (err) {
    console.error('Error in /transcribe route:', err);
    res.status(500).json({ error: 'Server Error', details: String(err) });
  }
});

export default atrRouter;