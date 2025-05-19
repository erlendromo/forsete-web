import { ApiRoute, AppRoute } from "../config/constants.js";
import { createDangerAlert, makeShowStatus } from "./utils/ui/alert.js";
import { showSpinner, disableSpinner } from "./utils/ui/spinner.js";

/*
* This script handles the login functionality for the application.
* It listens for form submission, validates user credentials,
* and manages the display of messages based on the login status.
*
* @module loginController
*/

const endpoint = ApiRoute.Login;
const spinner = document.getElementById("loginLoader") as HTMLElement;
const button = document.getElementById("submit") as HTMLButtonElement;
const text = document.getElementById("buttonText") as HTMLElement;
const form = document.querySelector<HTMLFormElement>('#loginForm')!;
const alertContainer = document.getElementById('login-alert-container');
const showError = makeShowStatus(createDangerAlert, () => alertContainer);

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  showSpinner(spinner, text, button);

  if (!form) {
    console.error('loginController: #loginForm not found in DOM');
    disableSpinner(spinner, text, button);
    return;
  }

  const { email, password } = Object.fromEntries(
    new FormData(form).entries(),
  ) as Record<string, string>;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    disableSpinner(spinner, text, button);
    showError('Network error: check your connection and try again.');
    return;
  }

  if (!response.ok) {
    const data = await response.json();
    showError(data.message ?? `Server returned: ${response.status}`);
    disableSpinner(spinner, text, button);
    return;
  }
  disableSpinner(spinner, text, button);
  window.location.replace(AppRoute.Home);
});

