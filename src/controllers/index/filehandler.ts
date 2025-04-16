// src/controllers/index/filehandler
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const elements = {
    submitBtn: document.getElementById("submitBtn") as HTMLButtonElement,
    cancelBtn: document.getElementById("cancelBtn") as HTMLButtonElement,
    inputDoc: document.getElementById("inputDocument") as HTMLInputElement,
    fileNameID: document.getElementById("fileName") as HTMLElement,
    spinnerId: document.getElementById("spinnerId") as HTMLElement,
    uploadArea: document.getElementById("uploadArea") as HTMLElement
  };

  // Hide spinner and remove blur effect
  const initialLoad = (): void => {
    elements.spinnerId.style.display = "none";
    hideElement(elements.cancelBtn);
    hideElement(elements.submitBtn);
    enableElement(elements.uploadArea);
  };

  // Generic function to add disabled styling
  const hideElement = async (el: HTMLElement): Promise<void> => {
    el.classList.add("pointer-events-none", "blur-sm");
    // Only sets disabled if the element supports it
    if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
      el.disabled = true;
    }
  };

  // Generic function to remove disabled styling
  const enableElement = async (el: HTMLElement): Promise<void> => {
    el.classList.remove("pointer-events-none", "blur-sm");
    if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
      el.disabled = false;
    }
  };

  const enableLoading = async (): Promise<void> => {
    // Disable the file area (uploadArea) and submit button,
    // then enable the cancel button and show the spinner.
    await hideElement(elements.uploadArea);
    await hideElement(elements.submitBtn);
    await enableElement(elements.cancelBtn);
    elements.spinnerId.classList.remove("hidden");
    elements.spinnerId.style.display = "flex";
  };

  // Hide the loader on initial load
  initialLoad();

  // Upload file to the server
  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("document", file);

    const response = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }
    return response.json();
  };

  // Request transcription using the uploaded file's filename
  const transcribeFile = async (filename: string): Promise<any> => {
    const response = await fetch("/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename })
    });

    if (!response.ok) {
      throw new Error("Transcription failed.");
    }
    return response.json();
  };

  // Handle the submit button click event
  const handleUploadClick = async (): Promise<void> => {
    const file = elements.inputDoc.files ? elements.inputDoc.files[0] : null;
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    await enableLoading();
    try {
      // Upload the file
      const uploadData = await uploadFile(file);
      const { filename } = uploadData;
      alert("File uploaded successfully!");

      // Transcribe the file using the returned filename
      await transcribeFile(filename);

      // Redirect to results page
      window.location.href = `results.html?file=${encodeURIComponent(filename)}`;
    } catch (error) {
      console.error("Error:", error);
      alert("Operation failed (check console for details).");
      initialLoad();
      clearFileInput();
    }
  };

  elements.inputDoc.addEventListener("change", () => {
    if (elements.inputDoc.files && elements.inputDoc.files.length > 0) {
      // A file has been selected; show the cancel and submit buttons
      enableElement(elements.cancelBtn);
      enableElement(elements.submitBtn);
    } else {
      // No file is selected; hide the cancel and submit buttons
      hideElement(elements.cancelBtn);
      hideElement(elements.submitBtn);
    }
  });

  // Handle the cancel button click event
  const handleCancelClick = (): void => {
    clearFileInput()
    hideElement(elements.cancelBtn);
    hideElement(elements.submitBtn);
    elements.spinnerId.style.display = "none";
    enableElement(elements.uploadArea);
    console.log("Cancel button clicked. File input reset.");
  };

  const clearFileInput = (): void => {
    // Reset the file input and filename display
    elements.inputDoc.value = "";
    elements.fileNameID.textContent = "No file chosen";
  }

  // Attach event listeners
  elements.submitBtn.addEventListener("click", handleUploadClick);
  elements.cancelBtn.addEventListener("click", handleCancelClick);
});
