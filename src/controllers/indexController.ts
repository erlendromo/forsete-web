import { AllowedMimeType, MAX_FILE_SIZE } from "../config/constants.js";
import { transcribe, ensurePng } from "./utils/transcribeHelper.js";
import { initDragAndDrop, enableElement, disableElement } from "./utils/ui/indexElements.js";
import { createDangerAlert, createSuccessAlert } from './utils/ui/alert.js';

export interface Elements {
  submitBtn: HTMLButtonElement;
  cancelBtn: HTMLButtonElement;
  inputDoc: HTMLInputElement;
  fileNameID: HTMLElement;
  spinner: HTMLElement;
  uploadArea: HTMLElement;
  errorMessage: HTMLElement;
}

// State of the ui
enum UiState { Idle, Loading, Submitting }

const showError = (() => {
  let timeout: number;
  return (el: HTMLElement, msg: string, temporary = true) => {
    el.textContent = msg;
    el.classList.remove("hidden");
    console.error(msg);

    if (temporary) {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => el.classList.add("hidden"), 5_000);
    }
  };
})();

const hideError = (el: HTMLElement) => el.classList.add("hidden");

const isAllowedType = (type: string): type is AllowedMimeType =>
  Object.values(AllowedMimeType).includes(type as AllowedMimeType);

const validateFile = (file: File, errEl: HTMLElement): boolean => {
  if (!isAllowedType(file.type)) {
    showError(errEl, `Invalid file type: ${file.type}`);
    return false;
  }
  if (file.size > MAX_FILE_SIZE) {
    showError(errEl, `File too large (max ${MAX_FILE_SIZE / 1_048_576} MB)`);
    return false;
  }
  return true;
};

/**
 * Manages the file upload and transcription workflow.
 * Sets up drag-and-drop
 * Handles file selection, cancellation, and submission
 * Displays alerts and processes file upload before transcription.
 */
class FileUploader {
  private elements: Elements;

  // Constructor for initalizing the class.
  constructor() {
    this.elements = this.htmlElements();
    this.createErrorPlaceholder();
    this.setupDragAndDrop();
    this.bindEvents();
    this.setUiState(UiState.Idle);
    window.addEventListener("unhandledrejection", this.onUnhandledRejection);
  }

  /**
  * Query and type-cast all necessary DOM elements.
  * If the error-message container is missing, it creates it.
  *
  * @private
  * @returns {Elements} An object mapping element IDs to their corresponding HTMLElements
  */
  private htmlElements(): Elements {
    return {
      submitBtn: document.getElementById("submitBtn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancelBtn") as HTMLButtonElement,
      inputDoc: document.getElementById("inputDocument") as HTMLInputElement,
      fileNameID: document.getElementById("fileName") as HTMLParagraphElement,
      spinner: document.getElementById("spinnerId") as HTMLDivElement,
      uploadArea: document.getElementById("uploadArea") as HTMLLabelElement,
      errorMessage: (document.getElementById("errorMessage") ?? this.createErrorElement()) as HTMLDivElement,

    };
  }

  /**
   * Creates an error placeholder if it does not exist.
   * 
   * @private
   * @returns {void}
   */
  private createErrorPlaceholder(): void {
    if (!document.getElementById("errorMessage")) {
      document.querySelector("form")?.appendChild(this.createErrorElement());
    }
  }

  /**
   * Creates an error element with red text
   * 
   * @private
   * @returns {HTMLElement}
   */
  private createErrorElement(): HTMLElement {
    const div = document.createElement("div");
    div.id = "errorMessage";
    div.className = "mt-2 text-red-600 text-sm hidden";
    return div;
  }

  /**
 * Initialize drag-and-drop on the upload area.
 * Takes only a single file.
 *
 * @private
 * @returns {void}
 */
  private setupDragAndDrop(): void {
    initDragAndDrop(this.elements.uploadArea, (files) => {
      const dataTransfer = new DataTransfer();
      const firstFile = Array.from(files)[0];
      if (!firstFile) return;
      dataTransfer.items.add(firstFile);
      this.elements.inputDoc.files = dataTransfer.files;
      this.onFileSelected();
      this.setUiState(UiState.Submitting);
    });
  }

  /**
   * Attach all DOM event listeners.
   * @private
   * @returns {void}
   */
  private bindEvents(): void {
    this.elements.inputDoc.addEventListener("change", () => this.onFileSelected());
    this.elements.cancelBtn.addEventListener("click", () => this.onCancel());
    this.elements.submitBtn.addEventListener("click", () => this.onSubmit());
  }

  /**
   * Update the UI controls (spinner, buttons, drop-area) based on the current state.
   *
   * @private
   * @param {UiState} newState — one of Idle, Loading, or Submitting
   * @returns {void}
   */
  private setUiState(newState: UiState): void {
    const { spinner, uploadArea, submitBtn, cancelBtn } = this.elements;

    // show spinner only when loading
    spinner.classList.toggle("hidden", newState !== UiState.Loading);

    if (newState === UiState.Idle) {
      enableElement(uploadArea);
      disableElement(submitBtn);
      disableElement(cancelBtn);
    } else if (newState === UiState.Loading) {
      disableElement(uploadArea);
      disableElement(submitBtn);
      enableElement(cancelBtn);
    } else {
      // Submitting state
      enableElement(uploadArea);
      enableElement(submitBtn);
      enableElement(cancelBtn);
    }
  }

  /**
   * Handle when the user selects (or drops) a file:
   *  - Clear any previous error
   *  - Display the selected file’s name
   *  - Validate the file type & size
   *  - Transition to “submitting” if valid, otherwise disable submit
   *
   * @private
   * @returns {void}
   */
  private onFileSelected(): void {
    const { inputDoc, fileNameID, errorMessage, submitBtn, cancelBtn } = this.elements;
    hideError(errorMessage);

    const file = inputDoc.files?.[0];
    fileNameID.textContent = file?.name ?? "No file chosen";

    if (file && validateFile(file, errorMessage)) {
      this.setUiState(UiState.Submitting);
    } else {
      disableElement(submitBtn);
      file ? enableElement(cancelBtn) : disableElement(cancelBtn);
    }
  }

  /**
   * Reset the file input and UI to its initial (Idle) state:
   *  - Clear the chosen file
   *  - Reset displayed file name
   *  - Transition UI to Idle
   *
   * @private
   * @returns {void}
   */
  private onCancel(): void {
    const { inputDoc, fileNameID } = this.elements;
    inputDoc.value = "";
    fileNameID.textContent = "No file chosen";
    this.setUiState(UiState.Idle);
  }

  /**
   * Handle the file if the user presses submit.
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async onSubmit(): Promise<void> {
    const { inputDoc, errorMessage } = this.elements;
    hideError(errorMessage);

    const file = inputDoc.files?.[0];
    // Check if its a file
    if (!file) {
      showError(errorMessage, "Please select a file first.");
      return;
    }
    // Validate file
    if (!validateFile(file, errorMessage)) return;
    // Set ui state to loading
    this.setUiState(UiState.Loading);

    try {
      await this.uploadAndTranscribe(file);
    } catch (err: any) {
      const msg = err.message?.includes("Failed to fetch")
        ? "Network error: cannot reach server."
        : err.message || String(err);
      showError(errorMessage, msg, false);
      this.setUiState(UiState.Idle);
    }
  }

  /**
   * Converts the given file to PNG (if needed), displays a success alert,
   * and resets the page to default.
   *
   * @private
   * @async
   * @param {File} originalFile - The file to upload and transcribe.
   * @returns {Promise<void>} Resolves once the PNG conversion and alert setup are complete.
   */
  private async uploadAndTranscribe(originalFile: File) {
    const container = document.getElementById("alert-container");
    // Ensures that the file is an actual png
    const pngFile = await ensurePng(originalFile);
    // Creates an success alert.
    if (container) {
      container.innerHTML = createSuccessAlert(
        "Successfully uploaded the file. Transcription in progress…"
      );
      document.getElementById("close-alert-button")?.addEventListener("click", () => {
        container.innerHTML = "";
      });
    }

    const result = await transcribe(pngFile);
    localStorage.setItem("transcribedData", JSON.stringify(result));

    const imageId = Array.isArray(result) ? result[0]?.image_id : result.image_id;
    if (!imageId) throw new Error("Unexpected response format (no image_id)");
    const resetUi = this.onCancel();
    resetUi;
    window.location.href = `results?file=${encodeURIComponent(imageId)}`;
  }
  /**
   * Global handler for any unhandled promise rejections.
   *
   * Logs the rejection reason to the console, displays a generic error alert,
   * and resets the UI back to the Idle state.
   *
   * @private
   * @function onUnhandledRejection
   * @param {PromiseRejectionEvent} event - The unhandledrejection event with the rejection reason.
   * @returns {void}
   */
  private onUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise:", event.reason);
    showError(this.elements.errorMessage, "An unexpected error occurred.");
    this.setUiState(UiState.Idle);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  new FileUploader();
});
