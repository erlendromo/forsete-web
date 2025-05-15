import {Elements} from "../../components/comp-index";

export function initDragAndDrop(area: HTMLElement, onFiles: (files: FileList) => void): void {
    area.addEventListener("dragover", ev => {
        ev.preventDefault();
    });
    area.addEventListener("drop", ev => {
        ev.preventDefault();
        const files = ev.dataTransfer?.files;
        if (files && files.length) onFiles(files);
    });
}

export function disableElement(el: HTMLElement): void {
  el.classList.add("pointer-events-none", "blur-sm");
  if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
    el.disabled = true;
  }
}

export function enableElement(el: HTMLElement): void {
  el.classList.remove("pointer-events-none", "blur-sm");
  if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
    el.disabled = false;
  }
}

export function resetUploadUI(el: Elements, hideError: (el: HTMLElement) => void) {
  el.spinner.classList.add("hidden");
  el.spinner.style.display = "none";
  disableElement(el.submitBtn);
  disableElement(el.cancelBtn);
  enableElement(el.uploadArea);
  hideError(el.errorMessage);
}

export function showLoadingUI(el: Elements) {
  el.spinner.classList.remove("hidden");
  disableElement(el.uploadArea);
  disableElement(el.submitBtn);
  enableElement(el.cancelBtn);
}

