// src/controllers/loginController.ts

import { ApiRoute } from "../config/apiRoutes";

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
  
  const { email, password } = Object.fromEntries(
    new FormData(form).entries()
  ) as Record<string, string>;

  try {
    const response = await fetch(ApiRoute.Login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Login failed');
    }
    window.location.replace("/");
  } catch (err) {
    msg.textContent =
      err instanceof Error ? err.message : 'Login failed';
  }
});
