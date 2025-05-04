// src/routes/router.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { handleLogin, handleRegister } from '../services/userHandlingService.js';

const router = Router();
const homePage = '/';
const resultsPage = '/results';
const loginPage = '/login';
const registerPage = '/register';

// Login route
router.post(loginPage, (req, res) => {
  const { email, password } = req.body;
  return handleLogin(email, password, res);
});

// Register route
router.post(registerPage, (req, res) => {
  const { email, password } = req.body;
  return handleRegister(email, password, res);
});

// Home page route
router.get(homePage, requireAuth, (req, res) => {
  res.render('login', { });
});

// Results page route
router.get(resultsPage, requireAuth, (req, res) => {
  const fileName = req.query.file;
  try {
    // Render EJS template and pass modelNames
    res.render('results', {
      fileName,
    });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});
export default router;
