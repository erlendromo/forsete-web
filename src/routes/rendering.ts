// src/routes/rendering.ts
import { Router } from 'express';
import { config } from '../config/config.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const homeRoute = '/';
const resultsRoute = '/results';
const loginRoute = '/login';
const registerRoute = '/register';

// Login route
router.get(loginRoute,    (_req, res) => res.render('login'));
router.get(registerRoute, (_req, res) => res.render('register'));


// Protected routes
// Home page route
router.get(homeRoute, requireAuth, (_req, res) => {
  res.render('index', { config });
});
// Results page route
router.get(resultsRoute, requireAuth, (req, res) => {
  const fileName = req.query.file;
  res.render('results', { fileName });
});

export default router;