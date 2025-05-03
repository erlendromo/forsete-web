// util/setAuthCookie.test.ts
import type { Response } from 'express';
import { setAuthCookie } from '../src/util/cookieUtil';

function makeMockRes(): Response {
  const res: Partial<Response> = {};
  res.cookie = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe('setAuthCookie', () => {
  it('writes the auth cookie with correct options', () => {
    const res = makeMockRes();
    const token = 'my-token';

    setAuthCookie(res, token);

    expect(res.cookie).toHaveBeenCalledWith('auth.token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  });
});
