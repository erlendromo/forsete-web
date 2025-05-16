// middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import { getAuthToken } from '../utils/cookieUtil.js';
import { AppRoute } from '../config/constants.js';

/**
 * Express middleware that ensures a user is authenticated before allowing access
 * to protected routes. It checks for an auth token on the incoming request,
 * and if none is found, redirects the client to the login page.
 *
 * @param {import('express').Request} req The Express request object, used to retrieve the auth token.
 * @param {import('express').Response} res The Express response object, used to send a redirect if authentication fails.
 * @param {import('express').NextFunction} next The next middleware function in the chain, called when authentication succeeds.
 *
 * @returns {void | import('express').Response} If no token is present, ends the response with a redirect to the login route. 
 * Otherwise does not return a value and passes control to the next handler.
 *
 * @example
 * // Protect this route:
 * router.get('/home', requireAuth, (req, res) => {
 *   res.render('home');
 * });
 * ```
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getAuthToken(req);
  if (!token) {
    return res.redirect(AppRoute.Login);
  }
  next();
}