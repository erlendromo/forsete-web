import { ApiRoute, AppRoute } from "../config/constants.js";
import { createDangerAlert, makeShowStatus } from "./utils/ui/alert.js";
import { showSpinner, disableSpinner } from "./utils/ui/spinner.js";

/*
 * This script handles the register functionality for the application.
 * It listens for form submission, validates user credentials,
 * and manages the display of messages based on the registration status.
 *
 * @module registerController
 */

const endpoint = ApiRoute.Register;
const spinner = document.getElementById("loginLoader") as HTMLElement;
const button = document.getElementById("submitBtn") as HTMLButtonElement;
const text = document.getElementById("buttonText") as HTMLElement;
const form = document.querySelector<HTMLFormElement>("#registerForm")!;
const topLevelAlertContainer = document.getElementById("alert-container");
const showError = makeShowStatus(
  createDangerAlert,
  () => topLevelAlertContainer,
);

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
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const errorMessage = data.error ?? "Registration failed";
      showError(errorMessage);
      disableSpinner(spinner, text, button);
      return;
    }
  } catch {
    showError("Network error: check your connection and try again.");
    disableSpinner(spinner, text, button);
    return;
  }
  disableSpinner(spinner, text, button);
  window.location.replace(AppRoute.Login);
});
