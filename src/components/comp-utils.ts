    // Generic function to add disabled styling
    export const hideElement = async (el: HTMLElement): Promise<void> => {
      el.classList.add("pointer-events-none", "blur-sm");
      // Only sets disabled if the element supports it
      if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
        el.disabled = true;
      }
    };
    

    // Generic function to remove disabled styling
    export const enableElement = async (el: HTMLElement): Promise<void> => {
      el.classList.remove("pointer-events-none", "blur-sm");
      if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
        el.disabled = false;
      }
    };