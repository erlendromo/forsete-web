// src/routes/router.ts
import { Router } from 'express';
import multer from 'multer';
import { ApiRoute } from '../config/apiRoutes.js';
import { handleLogin, handleRegister } from '../services/userHandlingService.js';
import { handlePdfToImage } from '../services/index/handlepdfToImageService.js';

const router = Router();
const uploadMemory = multer();

// Login route
router.post(ApiRoute.Login, (req, res) => {
  const { email, password } = req.body;
  return handleLogin(email, password, res);
});

// Register route
router.post(ApiRoute.Register, (req, res) => {
  const { email, password } = req.body;
  return handleRegister(email, password, res);
});

// PDF to Image route
router.post(ApiRoute.PdfToImage, uploadMemory.single("file"), async (req, res) => {
  await handlePdfToImage(req, res);
});

export default router;
