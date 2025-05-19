
/**
 * Function for initalizing drag and drop zone.
 * @param area the area where the drag and drop should be initialized.
 * @param onFiles the files it will take on the drop zone.
 */
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

/**
 * Function for disabling html element.
 * @param el the element to be disabled
 */
export function disableElement(el: HTMLElement): void {
  el.classList.add("pointer-events-none", "blur-sm");
  if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
    el.disabled = true;
  }
}
/**
 * Function for enabling html element.
 * @param el the element to be disabled
 */
export function enableElement(el: HTMLElement): void {
  el.classList.remove("pointer-events-none", "blur-sm");
  if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
    el.disabled = false;
  }
}

