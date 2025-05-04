// middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import { getAuthToken } from '../utils/cookieUtil.js';
import { AppRoute } from '../config/constants.js';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getAuthToken(req);
  if (!token) {
    return res.redirect(AppRoute.Login);
  }
  next();
}