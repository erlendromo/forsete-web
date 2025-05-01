import { login, LoginError } from '../src/services/loginService';

const globalAny: any = global;

describe('login()', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    globalAny.fetch = fetchMock;   // stub fetch for every test
    fetchMock.mockReset();
  });

  // Positive test case
  it('returns the token on 200', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ token: 'jwt-123' }), { status: 200 }),
    );
    const data = await login({ email: 'me', password: 'pw' });
    expect(data).toEqual({ token: 'jwt-123' });
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
    // Negative test case, wrong token
   it('throws LoginError on 401', async () => {
    fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 'bad-token' }), { status: 200 }),
    );
    const data = await login({ email: 'me', password: 'pw' });
    expect(data).not.toEqual({ token: 'bad' });
  });
});