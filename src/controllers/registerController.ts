import { ApiRoute } from "../config/apiRoutes.js";
import { createAlert } from "./utils/ui/alert.js";
/*
* This script handles the register functionality for the application.
* It listens for form submission, validates user credentials,
* and manages the display of messages based on the registration status.
*
* @module loginPage
*/
const form = document.querySelector<HTMLFormElement>('#registerForm')!;
const alertContainer = document.getElementById('reg-alert-container');
const endpoint = ApiRoute.Register;


form.addEventListener('submit', async ev => {
  ev.preventDefault();

  if (!form) {
    console.error('registerController: #registerForm not found in DOM');
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