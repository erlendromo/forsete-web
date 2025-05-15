
import { AllowedMimeType } from "../../config/constants.js";
import { transcribe, ensurePng } from "../utils/transcribe.js";
import { initDragAndDrop, enableElement, disableElement } from "../utils/ui/indexElements.js";

const MAX_FILE_SIZE_BYTES = 32 * 1024 * 1024; // 32 MB

export interface Elements {
  submitBtn: HTMLButtonElement;
  cancelBtn: HTMLButtonElement;
  inputDoc: HTMLInputElement;
  fileNameID: HTMLElement;
  spinner: HTMLElement;
  uploadArea: HTMLElement;
  errorMessage: HTMLElement;
}

const htmlId = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const showError = (() => {
  let timeout: number | undefined;
  return (el: HTMLElement, msg: string, temporary = true) => {
    el.textContent = msg;
    el.classList.remove("hidden");

    if (temporary) {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => el.classList.add("hidden"), 5_000);
    }
    console.error(msg);
  };
})();

const hideError = (el: HTMLElement) => el.classList.add("hidden");

// Helper for validating file type
const isAllowedType = (type: string): type is AllowedMimeType =>
  Object.values(AllowedMimeType).includes(type as AllowedMimeType);

const validateFile = (file: File, errEl: HTMLElement): boolean => {
  if (!isAllowedType(file.type)) {
    showError(errEl, `Invalid file type: ${file.type}`);
    return false;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    showError(
      errEl, `File too large: (max ${(MAX_FILE_SIZE_BYTES / 1_048_576)}) MB)`
    );
    return false;
  }
  return true;
};


document.addEventListener("DOMContentLoaded", () => {
  // Grab UI elements once
  const components: Elements = {
    submitBtn: htmlId("submitBtn"),
    cancelBtn: htmlId("cancelBtn"),
    inputDoc: htmlId("inputDocument"),
    fileNameID: htmlId("fileName"),
    spinner: htmlId("spinnerId"),
    uploadArea: htmlId("uploadArea"),
    errorMessage: htmlId("errorMessage") ?? createErrorElement(),
  };

  enum UiState { Idle, Loading, Submitting }
  function setUi(state: UiState) {
    if (state === UiState.Idle) {
      components.spinner.classList.add("hidden");
      enableElement(components.uploadArea);
      disableElement(components.submitBtn);
      disableElement(components.cancelBtn);
    } else if (state === UiState.Loading) {
      components.spinner.classList.remove("hidden");
      disableElement(components.uploadArea);
      disableElement(components.submitBtn);
      enableElement(components.cancelBtn);
    } else {
      components.spinner.classList.add("hidden");
      enableElement(components.uploadArea);
      enableElement(components.submitBtn);
      enableElement(components.cancelBtn);
    }
  }


  // Dynamic creation for error placeholder (if missing in markup)
  function createErrorElement(): HTMLElement {
    const div = document.createElement("div");
    div.id = "errorMessage";
    div.className = "mt-2 text-red-600 text-sm hidden";
    document.querySelector("form")?.appendChild(div);
    return div;
  }
  // Initial state
  setUi(UiState.Idle);
  initDragAndDrop(components.uploadArea, (droppedFiles: FileList) => {
    const dt = new DataTransfer();
    Array.from(droppedFiles).forEach(f => dt.items.add(f));
    components.inputDoc.files = dt.files;
    components.inputDoc.dispatchEvent(new Event("change"));
    setUi(UiState.Submitting);
  });

  components.cancelBtn.addEventListener("click", () => handleCancel(components));

  // file is selcted
  components.inputDoc.addEventListener("change", () => {
    hideError(components.errorMessage);

    const file = components.inputDoc.files?.[0];
    components.fileNameID.textContent = file?.name ?? "No file chosen";
    // Validation
    if (file && validateFile(file, components.errorMessage)) {
      setUi(UiState.Submitting);
    } else {
      disableElement(components.submitBtn);
      // Enable the cancel button only if a file is selected; otherwise, disable it
      file ? enableElement(components.cancelBtn) : disableElement(components.cancelBtn);
    }
  });

  // Cancel button
  function handleCancel(components: Elements): void {
  components.inputDoc.value = "";
  components.fileNameID.textContent = "No file chosen";
  setUi(UiState.Idle);
}

  // Submit button
  components.submitBtn.addEventListener("click", async () => {
    hideError(components.errorMessage);

    const originalFile = components.inputDoc.files?.[0];
    if (!originalFile) {
      showError(components.errorMessage, "Please select a file first.");
      return;
    }

    if (!validateFile(originalFile, components.errorMessage)) return;

    setUi(UiState.Loading);;

    try {
      const uploadFile = await ensurePng(originalFile);
      const result = await transcribe(uploadFile);

      // Save to localstorage
      localStorage.setItem("transcribedData", JSON.stringify(result));
    const imageId = Array.isArray(result)? result[0]?.image_id: result.image_id;
      if (!imageId) throw new Error("Unexpected response format (no image_id)");

      // Go to result page
      handleCancel(components);
      window.location.href = `results?file=${encodeURIComponent(imageId)}`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Failed to fetch")) {
        showError(components.errorMessage, "Network error: cannot reach server.");
      } else {
        showError(components.errorMessage, msg, false);
      }
      setUi(UiState.Idle);
    }
  });
  

  // Global unhandled promise rejection fallback
  window.addEventListener("unhandledrejection", (ev) => {
    console.error("Unhandled promise:", ev.reason);
    showError(components.errorMessage, "An unexpected error occurred.");
    setUi(UiState.Idle);
  });
});
