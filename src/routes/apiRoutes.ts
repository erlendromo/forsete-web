import { Router } from 'express';
import { ApiRoute } from '../config/constants.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { clearAuthCookie } from "../utils/cookieUtil.js";
import { handleLogin, handleRegister } from '../services/userHandlingService.js';
import { handleTranscribe, handleGetImageFile, hadleGetOutputData, handlePostOutputData, handleGetOutputs } from '../services/atrApiHandler.js';
import { handlePdfToImage } from '../services/index/handlepdfToImageService.js';
import { AppPages } from '../config/constants.js';
import multer from 'multer';
import { getAuthToken } from '../utils/cookieUtil.js';
import { handleExport } from './utils/export/exportHandler.js';

const storage = multer.memoryStorage();
const uploadMemory = multer({ storage });
const apiRouter = Router();

// Login route
apiRouter.post(ApiRoute.Login, (req, res) => {
  const { email, password } = req.body;
  return handleLogin(email, password, res);
});

// Register route
apiRouter.post(ApiRoute.Register, (req, res) => {
  const { email, password } = req.body;
  return handleRegister(email, password, res);
});

// Logout route
apiRouter.post(ApiRoute.Logout, requireAuth, (req, res) => {
  clearAuthCookie(res);
  res.render(AppPages.Login);
});

// PDF to Image route
apiRouter.post(ApiRoute.PdfToImage, requireAuth, uploadMemory.single("file"), async (req, res) => {
  try {
    await handlePdfToImage(req, res);
  } catch (err) {
    console.error('Error in PDF to Image conversion:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transcribe route - with multer handling the file upload
apiRouter.post(ApiRoute.Transcribe, requireAuth, uploadMemory.single('file'), (req, res) => {
  const token = getAuthToken(req); // Get auth token from the request
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  (async () => {
    try {
      const imageFile = req.file as Express.Multer.File;
      const textModel = req.body.textModel as string;
      const lineModel = req.body.lineModel as string;
      // Calling the service to process the file and send to ATR
      const result = await handleTranscribe(imageFile, token, textModel, lineModel);

      res.json(result); // Send the result back
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Server error' });
    }
  })();
});

// Image route
apiRouter.post(ApiRoute.Images, requireAuth, async (req, res) => {
  const token = getAuthToken(req);
  
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { data, mimeType } = await handleGetImageFile(req.body.image_id, token); 
    res.setHeader('Content-Type', mimeType);
    res.send(Buffer.from(data));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Output route
apiRouter.post(ApiRoute.Outputs, async (req, res) => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const result = await handleGetOutputs(req.body.image_id, token);
    if (!result) {
      res.status(400).json({ error: "Missing image_id" });
      return;
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Output data route
apiRouter.post(ApiRoute.OutputData, (req, res) => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { image_id, id } = req.body;
  if (!image_id || !id) {
    res.status(400).json({ error: "Missing image_id or id" });
    return;
  }

  (async () => {
    try {
    
      const result = await hadleGetOutputData(image_id, id, token);
     
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  })();
});

// Export route
apiRouter.post(ApiRoute.Export, async (req, res) => {
  const { lineSegments, filename, format } = req.body;

  try {
    const { buffer, mimeType, filename: fullFilename } = await handleExport(lineSegments, filename, format);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fullFilename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).send('Failed to generate export file');
  }
});

// Save route
apiRouter.post(ApiRoute.Save, (req, res) => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const saveOutput = req.body;
  if (!saveOutput) {
    res.status(400).json({ error: "Missing saveOutput" });
    return;
  }
  (async () => {
    try {
      const result = await handlePostOutputData(req.body.saveData, req.body.imageId, req.body.outputId , token);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  })(); 
});



export default apiRouter;

