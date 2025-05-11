// src/routes/router.ts
import { Router } from 'express';
import multer from 'multer';
import { ApiRoute } from '../config/constants.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { clearAuthCookie } from "../utils/cookieUtil.js";
import { handleLogin, handleRegister } from '../services/userHandlingService.js';
import { handlePdfToImage } from '../services/index/handlepdfToImageService.js';
import { AppPages } from '../config/constants.js';

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

// Logout route
router.post(ApiRoute.Logout, requireAuth, (req, res) => {
  clearAuthCookie(res);
  res.render(AppPages.Login);
});
// PDF to Image route
router.post(ApiRoute.PdfToImage, requireAuth, uploadMemory.single("file"), async (req, res) => {
  console.log('hit');
  try {
    await handlePdfToImage(req, res);
  } catch (err) {
    console.error('Error in PDF to Image conversion:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
