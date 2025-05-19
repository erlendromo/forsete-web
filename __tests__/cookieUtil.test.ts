import type { Response, Request } from 'express';
import { setAuthCookie, getAuthToken, clearAuthCookie } from '../src/utils/cookieUtil';
import { tokenStorage } from '../src/config/constants';


// Mocking the express Response and Request objects
function makeMockRes(): Response {
  const res: Partial<Response> = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res as Response;
}

function makeMockReq(cookies?: Record<string, string>): Request {
  return {
    cookies: cookies
  } as Request;
}

// Positive test case for setAuthCookie
describe('Cookie Utils', () => {
  describe('setAuthCookie', () => {
    it('sets the auth cookie with correct options', () => {
      const res = makeMockRes();
      const token = 'test-token';

      setAuthCookie(res, token);

      expect(res.cookie).toHaveBeenCalledWith(tokenStorage.TOKEN_KEY, token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000
      });
    });
  });

  // Positive test case for getAuthToken
  describe('getAuthToken', () => {
    it('returns token when cookie exists', () => {
      const token = 'test-token';
      const req = makeMockReq({ [tokenStorage.TOKEN_KEY]: token });

      const result = getAuthToken(req);

      expect(result).toBe(token);
    });

    // Positive test case for clearAuthCookie
    describe('clearAuthCookie', () => {
      it('clears the auth cookie with correct options', () => {
        const res = makeMockRes();

        clearAuthCookie(res);

        expect(res.clearCookie).toHaveBeenCalledWith(tokenStorage.TOKEN_KEY, {
          httpOnly: true,
          sameSite: 'strict'
        });
      });
    });

    // Negative test case for getAuthToken
    it('returns undefined when cookie does not exist', () => {
      const req = makeMockReq();

      const result = getAuthToken(req);

      expect(result).toBeUndefined();
    });
  });
});
