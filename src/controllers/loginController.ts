// src/controllers/loginController.ts
import { createAlert } from "./utils/ui/alert.js";
/*
* This script handles the login functionality for the application.
* It listens for form submission, validates user credentials,
* and manages the display of messages based on the login status.
*
* @module loginPage
*/
const form = document.querySelector<HTMLFormElement>('form')!;
const LOGIN_API = '/api/login';
form.addEventListener('submit', async ev => {
  ev.preventDefault();

  const { email, password } = Object.fromEntries(
    new FormData(form).entries()
  ) as Record<string, string>;


  try {
    const response = await fetch(LOGIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Login failed');
    }
    window.location.replace("/");
  }
  catch (err) {
    const container = document.getElementById('login-alert-container');
    if (!container) return;

    // Fallback message if the error is not an instance of Error
    // or if it doesn't have a message property
    const message = err instanceof Error ? err.message : 'Login failed';

    // Create and display the alert
    container.innerHTML = createAlert(message);
    const closeBtn = document.getElementById('close-alert-button');
    closeBtn?.addEventListener('click', () => {
      container.innerHTML = ''; // removes the whole container content
    });
  }
});
