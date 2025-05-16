
type AlertFactory = (message: string) => string;

/**
 * 
 * @param message - The message to be displayed in the alert.
 * @description This function creates an alert box with a message and a close button.
 * The alert is red for indicating an error or warning.
 * The alert box is styled with Tailwind CSS classes for a consistent look and feel.
 * The alert box includes an icon, a message, and a close button.
 * The close button has an event listener that removes the alert box when clicked.
 * @returns 
 */
export function createDangerAlert(message: string): string {
  return `
      <div id="alert-border-2" class="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
        <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <div class="ms-3 text-sm font-medium">
          ${message}
        </div>
        <button type="button" id="close-alert-button" class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" aria-label="Close">
          <span class="sr-only">Dismiss</span>
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    `;
}
/**
 * 
 * @param message - The message to be displayed in the alert.
 * @description This function creates an alert box with a message and a close button.
 * The alert is green for indicating an success.
 * The alert box is styled with Tailwind CSS classes for a consistent look and feel.
 * The alert box includes an icon, a message, and a close button.
 * The close button has an event listener that removes the alert box when clicked.
 * @returns 
 */
export function createSuccessAlert(message: string): string {
  return `
    <div
      class="flex items-center p-4 mb-4
             text-green-800 border-t-4 border-green-400
             bg-green-100
             dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
      role="alert"
    >
      <svg class="shrink-0 w-4 h-4" aria-hidden="true" fill="currentColor"
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M16.707 5.293a1 1 0 ...Z"/>
      </svg>
      <div class="ms-3 text-sm font-medium">
        ${message}
      </div>
      <button
        type="button" id="close-alert-button"
        class="ms-auto -mx-1.5 -my-1.5
               bg-green-100 text-green-500 rounded-lg
               focus:ring-2 focus:ring-green-500
               p-1.5 hover:bg-green-200
               inline-flex items-center justify-center
               h-8 w-8
               dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        aria-label="Close"
      >
        <span class="sr-only">Dismiss</span>
        <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Creates a reusable status‐display function that injects alert HTML into a container
 * and wires up its close button.
 *
 * @param {AlertFactory} alertFactory
 *   A factory function that takes a message string and returns an HTML string
 *   representing the alert (example: createSuccessAlert or createDangerAlert)
 *
 * @param {() => HTMLElement | null} getContainer
 *   A zero‐argument function which returns the target container element
 *   (or `null` if not found) into which the alert HTML will be injected.
 *
* @returns {(message: string) => void}
*   A function which, when called with a `statusMessage`, injects an alert
*   into the container and wires up its close button.
 */

export function makeShowStatus(alertFactory: AlertFactory, getContainer: () => HTMLElement | null) {
  return function showStatus(statusMessage: string) {
    const alertContainer = getContainer();
    if (!alertContainer) return;

    alertContainer.innerHTML = alertFactory(statusMessage);
    document
      .getElementById("close-alert-button")
      ?.addEventListener("click", () => {
        alertContainer.innerHTML = "";
      });
  };
}
