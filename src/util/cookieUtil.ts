// util/setAuthCookie.ts
import { Response } from 'express';

export function setAuthCookie(res: Response, token: string) {
  res.cookie('auth.token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
}