// src/controllers/loginController.ts
import { ApiRoute } from "../config/apiRoutes.js";
import { createAlert } from "./utils/ui/alert.js";
/*
* This script handles the login functionality for the application.
* It listens for form submission, validates user credentials,
* and manages the display of messages based on the login status.
*
* @module loginPage
*/
const form = document.querySelector<HTMLFormElement>('#loginForm')!;
const alertContainer = document.getElementById('login-alert-container');
const endpoint = ApiRoute.Login;

form.addEventListener('submit', async ev => {
  ev.preventDefault();

  if (!form) {
    console.error('loginController: #loginForm not found in DOM');
    return;
  }

  const { email, password } = Object.fromEntries(
    new FormData(form).entries()
  ) as Record<string, string>;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    showError('Network error: check your connection and try again.');
    return;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    showError(data.message ?? `Server returned: ${response.status}`);
    return;
  }
  window.location.replace('/');
});

/**
 * Displays an error message in the alert container.
 *
 * @param {string} message - The error message to display.
 */
function showError(message: string) {
  if (!alertContainer) return;

  alertContainer.innerHTML = createAlert(message);
  alertContainer
    .querySelector<HTMLButtonElement>('#close-alert-button')
    ?.addEventListener('click', () => (alertContainer.innerHTML = ''));
}
