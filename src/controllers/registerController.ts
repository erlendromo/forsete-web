// src/controllers/registerController.ts
import { ApiRoute, AppRoute } from "../config/constants.js";
import { createAlert } from "./utils/ui/alert.js";
import { showSpinner, disableSpinner } from "./utils/ui/spinner.js";
/*
* This script handles the register functionality for the application.
* It listens for form submission, validates user credentials,
* and manages the display of messages based on the registration status.
*
* @module loginPage
*/
const spinner = document.getElementById("loginLoader") as HTMLElement;
const button = document.getElementById("submitBtn") as HTMLButtonElement;
const text = document.getElementById("buttonText") as HTMLElement;
const form = document.querySelector<HTMLFormElement>('#registerForm')!;
const alertContainer = document.getElementById('reg-alert-container');
const endpoint = ApiRoute.Register;

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  if (!form) {
    console.error("registerController: #registerForm not found in DOM");
    return;
  }

  const { email, password } = Object.fromEntries(
    new FormData(form).entries(),
  ) as Record<string, string>;
  showSpinner(spinner, text, button);
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    showError('Network error: check your connection and try again.');
    disableSpinner(spinner, text, button);
    return;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    showError(data.message ?? `Server returned: ${response.status}`);
    disableSpinner(spinner, text, button);
    return;
  }
  disableSpinner(spinner, text, button);
  window.location.replace(AppRoute.Login);
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
    .querySelector<HTMLButtonElement>("#close-alert-button")
    ?.addEventListener("click", () => (alertContainer.innerHTML = ""));
}
