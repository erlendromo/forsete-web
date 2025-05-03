import { login, LoginError } from '../src/services/loginService';

const globalAny: any = global;

describe('login()', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    globalAny.fetch = fetchMock;
    fetchMock.mockReset();
  });

  // Positive test case
  it('returns the token on 200', async () => {
    const tokenValue = 'jwt-123';
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ token: tokenValue }), { status: 200 }),
    );
    const data = await login({ email: 'me', password: 'pw' });
    expect(data.token).toEqual(tokenValue);
  });

  // Negative test case
  it('throws LoginError on 401', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('Bad credentials', { status: 401 }),
    );
    await expect(
      login({ email: 'badEmail', password: 'nopePassword' }),
    ).rejects.toThrow(LoginError);
  });
});