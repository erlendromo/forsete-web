// src/routes/router.ts
import { Router } from 'express';
import { ApiRoute } from '../config/apiRoutes.js';
import { handleLogin, handleRegister } from '../services/userHandlingService.js';
import { handleTranscribe, handleGetImageFile, hadleGetOutputData } from '../services/atrApiHandler.js';
import multer from 'multer';
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

// Transcribe route - with multer handling the file upload
apiRouter.post(ApiRoute.Transcribe, uploadMemory.single('file'), (req, res) => {
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

apiRouter.get(ApiRoute.Images, (req, res) => {

  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const result = handleGetImageFile(req.body.image_id, token); // Call the service to get image by ID
  res.json(result); 
});


apiRouter.post(ApiRoute.Outputs, (req, res) => {
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

