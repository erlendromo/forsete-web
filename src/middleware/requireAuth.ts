// middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import { getAuthToken } from '../util/cookieUtil.js';

export function requireAuth(
  req: Request,
  res: Response,
) {
  const token = getAuthToken(req);
  if (!token) return res.redirect('/login');
  }
