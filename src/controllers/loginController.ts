import { login, storeToken, LoginError } from '../services/userHandlingService.js';

/*
* This script handles the login functionality for the application.
* It listens for form submission, validates user credentials,
* and manages the display of messages based on the login status.
*
* @module loginPage
*/
const form  = document.querySelector<HTMLFormElement>('form')!;
const msg   = document.createElement('div');
msg.id      = 'login-msg';
form.append(msg);

form.addEventListener('submit', async ev => {
  ev.preventDefault();
  msg.textContent = 'Signing in…';

  const creds = Object.fromEntries(new FormData(form).entries());

  try {
    const { token } = await login(creds as any);
    storeToken(token);
    msg.textContent = 'Welcome!';
    window.location.replace('/');
  } catch (err) {
    msg.textContent =
      err instanceof LoginError ? err.message : 'Login failed';
  }
});