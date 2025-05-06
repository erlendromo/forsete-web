// src/routes/renderingRoutes.ts
import { Router } from 'express';
import { config } from '../config/config.js';
import { AppRoute, AppPages } from '../config/constants.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// Login route
router.get(AppRoute.Login,    (_req, res) => res.render(AppPages.Login));
// Register route
router.get(AppRoute.Register, (_req, res) => res.render(AppPages.Register));


// Protected routes
// Home page route
router.get(AppRoute.Home, requireAuth, (_req, res) => {
  res.render(AppPages.Home, { config });
});
// Results page route
router.get(AppRoute.Results, requireAuth, (req, res) => {
  const fileName = req.query.file;
  res.render(AppPages.Results, { fileName });
})

export default router;