// src/routes/renderingRoutes.ts
import { Router } from 'express';
import { config } from '../config/config.js';
import { AppRoute, AppPages } from '../config/constants.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiRoute } from '../config/constants.js';
import {MenuService} from  '../services/menuService.js';

const router = Router();
const menuService = new MenuService(config);

// Login route
router.get(AppRoute.Login,    (_req, res) => res.render(AppPages.Login));
// Register route
router.get(AppRoute.Register, (_req, res) => res.render(AppPages.Register));

// Protected routes
// Home page route
router.get(AppRoute.Home, requireAuth, async (_req, res) => {
  try {
    let { textModels, lineModels } = await menuService.loadAllModels();
    res.render(AppPages.Home, { config, textModels, lineModels, logoutUrl: ApiRoute.Logout });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
// Results page route
router.get(AppRoute.Results, requireAuth, async (req, res) => {
 try {
    const { textModels, lineModels } = await menuService.loadAllModels();
    res.render(AppPages.Home, { config, textModels, lineModels, logoutUrl: ApiRoute.Logout });
  } catch (err) {
    res.status(500).send('Server Error');
  }
})

export default router;