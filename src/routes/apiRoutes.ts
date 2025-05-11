// src/routes/router.ts
import multer from 'multer';
import { Router } from 'express';
import { ApiRoute } from '../config/constants.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { clearAuthCookie } from "../utils/cookieUtil.js";
import { handleLogin, handleRegister } from '../services/userHandlingService.js';
import { handlePdfToImage } from '../services/index/handlepdfToImageService.js';
import { AppPages } from '../config/constants.js';
import { handleTranscribe, handleGetImageFile, hadleGetOutputData } from '../services/atrApiHandler.js';
import { getAuthToken } from '../utils/cookieUtil.js';

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

      // Calling the service to process the file and send to ATR
      const result = await handleTranscribe(imageFile, token);

      res.json(result); // Send the result back
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Server error' });
    }
  })();
});

apiRouter.post(ApiRoute.Images, requireAuth, async (req, res) => {
  const token = getAuthToken(req);
  
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { data, mimeType } = await handleGetImageFile(req.body.image_id, token); 
    console.log("Image data:", data);
    console.log("MIME type:", mimeType);
    res.setHeader('Content-Type', mimeType);
    res.send(Buffer.from(data));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});


apiRouter.post(ApiRoute.Outputs, requireAuth, (req, res) => {
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

export default apiRouter;

