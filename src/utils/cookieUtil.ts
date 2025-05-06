// util/setAuthCookie.ts
import { Response, Request } from 'express';
const COOKIE_NAME = 'auth.token';

/**
 * Sets the authentication token in the response cookies.
 * @param {Response} res - The Express response object.
 * @param {string} token - The authentication token to be set.
 */
export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'strict', // Helps prevent CSRF attacks
    maxAge: 60 * 60 * 1000, //1 hour
  });
}

/**
 * Retrieves the authentication token from the request cookies.
 * @param {Request} req - The Express request object.
 * @returns {string | undefined} - The authentication token or undefined if not found.
 */
export function getAuthToken(req: Request): string | undefined {
  return req.cookies?.[COOKIE_NAME];
}