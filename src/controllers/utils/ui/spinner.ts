/**
 * A simple function for making a spinner appear on a button element.
 * 
 * @param spinner The spinner element to be shown.
 * @param buttonText The button text to be removed.
 * @param button The button element where the spinner should appear.
 */
export function showSpinner(spinner: HTMLElement, buttonText: HTMLElement, button: HTMLButtonElement): void {
    const hidden = "hidden";
    const visible = "flex";
    const invisible = "invisible";
    spinner.classList.replace(hidden, visible);
    buttonText.classList.add(invisible);
    button.disabled = true;
}

/**
 * A simple function for removing a spinner on a button element.
 * 
 * @param spinner The spinner element to be removed.
 * @param buttonText The button text to be displayed.
 * @param button The button element where the spinner should be removed.
 */
export function disableSpinner(spinner: HTMLElement, buttonText: HTMLElement, button: HTMLButtonElement): void {
    const hidden = "hidden";
    const visible = "flex";
    const invisible = "invisible";
    spinner.classList.replace(visible, hidden);
    buttonText.classList.remove(invisible);
    button.disabled = false;
}

