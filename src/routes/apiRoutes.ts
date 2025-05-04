// src/routes/router.ts
import { Router } from 'express';
import { ApiRoute } from '../config/apiRoutes.js';
import { handleLogin, handleRegister } from '../services/userHandlingService.js';

const router = Router();

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

export default router;
