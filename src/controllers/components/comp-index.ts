import { ApiRoute } from '../../config/apiRoutes.js';

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const elements = {
    submitBtn: document.getElementById("submitBtn") as HTMLButtonElement,
    cancelBtn: document.getElementById("cancelBtn") as HTMLButtonElement,
    inputDoc: document.getElementById("inputDocument") as HTMLInputElement,
    fileNameID: document.getElementById("fileName") as HTMLElement,
    spinnerId: document.getElementById("spinnerId") as HTMLElement,
    uploadArea: document.getElementById("uploadArea") as HTMLElement,
    errorMessage: document.getElementById("errorMessage") as HTMLElement || createErrorElement()
  };

  // Create error message element if it doesn't exist
  function createErrorElement(): HTMLElement {
    const errorEl = document.createElement("div");
    errorEl.id = "errorMessage";
    errorEl.className = "mt-2 text-red-600 text-sm hidden";
    document.querySelector("form")?.appendChild(errorEl);
    return errorEl;
  }

  // Display error message to the user
  const showError = (message: string, isTemporary: boolean = true): void => {
    if (!elements.errorMessage) return;
    
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove("hidden");
    
    if (isTemporary) {
      setTimeout(() => {
        elements.errorMessage.classList.add("hidden");
      }, 5000); // Hide after 5 seconds
    }
    
    console.error(`Error: ${message}`);
  };

  // Hide error message
  const hideError = (): void => {
    if (!elements.errorMessage) return;
    elements.errorMessage.classList.add("hidden");
  };

  // Hide spinner and remove blur effect
  const initialLoad = (): void => {
    elements.spinnerId.style.display = "none";
    hideElement(elements.cancelBtn);
    hideElement(elements.submitBtn);
    enableElement(elements.uploadArea);
    hideError();
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
    hideError(); // Clear any previous errors
  };

  // Hide the loader on initial load
  initialLoad();

  // Upload file to the server
 
  // Request transcription using the uploaded file's filename
  const transcribeFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    try {
      const response = await fetch(ApiRoute.Transcribe, {
        method: "POST",
        body: formData,
      });
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const statusText = response.statusText || "Unknown error";
        const errorMessage = errorData?.error || 
                             `Transcription failed: ${statusText} (${response.status})`;
        throw new Error(errorMessage);
      }
  
      const jsonData = await response.json();
      console.log("API Response JSON:", jsonData);
      // Store the transcribed data in localStorage
      localStorage.setItem('transcribedData', JSON.stringify(jsonData));
      return jsonData
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error("Network error: Unable to connect to the server. Please check your internet connection.");
      }
      throw error; // Re-throw other errors
    }
  };

  // Validate file before submission
  const validateFile = (file: File): boolean => {
    // Check file size (e.g., 20MB limit)
    const maxSize = 32 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      showError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${maxSize / 1024 / 1024}MB.`);
      return false;
    }

    // Check file type (optional - adjust extensions as needed)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showError(`Invalid file type: ${file.type}. Please upload a JPG, PNG, TIFF, or PDF file.`);
      return false;
    }

    return true;
  };

  // Handle the submit button click event
  const handleUploadClick = async (): Promise<void> => {
    hideError();
    const file = elements.inputDoc.files ? elements.inputDoc.files[0] : null;
    
    if (!file) {
      showError("Please select a file first.");
      return;
    }

    // Validate file before proceeding
    if (!validateFile(file)) {
      return;
    }

    await enableLoading();


    let transcribeDoc: any = null;
    try {
      // Upload the file
      const file = elements.inputDoc.files ? elements.inputDoc.files[0] : null;
      if (!file) {
        throw new Error("No file selected.");
      }
      // Transcribe the file using the returned filename
      try {
       
        console.log("Calling transcribeFile...");
        transcribeDoc = await transcribeFile(file);
        console.log("Received transcription response:", transcribeDoc);
      
        if (Array.isArray(transcribeDoc)) {
          if (!transcribeDoc[0]?.image_id) {
            throw new Error("Unexpected response format. Unable to find image_id.");
          }
          window.location.href = `results?file=${encodeURIComponent(transcribeDoc[0].image_id)}`;
        } else if (transcribeDoc?.image_id) {
          window.location.href = `results?file=${encodeURIComponent(transcribeDoc.image_id)}`;
        } else {
          throw new Error("Unexpected response format. No image_id found.");
        }
      } catch (transcribeError: any) {
        // Handle transcription error but still allow seeing results if upload succeeded
        console.error("Transcription error:", transcribeError);
        
        const confirmView = confirm(
          `Transcription encountered an error: ${transcribeError.message}\n\n` +
          `Would you still like to view the results page? (The file was uploaded successfully)`
        );
        
        if (confirmView && transcribeDoc) {
          window.location.href = `results?file=${encodeURIComponent(transcribeDoc[0].image_id)}`;
        } else {
          initialLoad();
        }
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      
      // Handle specific errors
      if (error.message.includes("Network error")) {
        showError("Server connection failed. Please check your internet connection and try again.");
      } else {
        showError(`Error: ${error.message || "Unknown error occurred"}`);
      }
      
      initialLoad();
      // Don't clear the file input, so the user can retry
    } 
  };

  // Monitor file selection
  elements.inputDoc.addEventListener("change", () => {
    hideError(); // Clear previous errors when a new file is selected
    
    if (elements.inputDoc.files && elements.inputDoc.files.length > 0) {
      const file = elements.inputDoc.files[0];
      
      // Update filename display
      elements.fileNameID.textContent = file.name;
      
      // Validate file immediately on selection
      if (validateFile(file)) {
        // A valid file has been selected; show the cancel and submit buttons
        enableElement(elements.cancelBtn);
        enableElement(elements.submitBtn);
      } else {
        // Invalid file; show cancel but not submit
        enableElement(elements.cancelBtn);
        hideElement(elements.submitBtn);
      }
    } else {
      // No file is selected; hide the cancel and submit buttons
      hideElement(elements.cancelBtn);
      hideElement(elements.submitBtn);
      elements.fileNameID.textContent = "No file chosen";
    }
  });

  // Handle the cancel button click event
  const handleCancelClick = (): void => {
    clearFileInput();
    hideElement(elements.cancelBtn);
    hideElement(elements.submitBtn);
    elements.spinnerId.style.display = "none";
    enableElement(elements.uploadArea);
    hideError();
    console.log("Cancel button clicked. File input reset.");
  };

  const clearFileInput = (): void => {
    // Reset the file input and filename display
    elements.inputDoc.value = "";
    elements.fileNameID.textContent = "No file chosen";
  };

  // Add global error handler for promises
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    showError("An unexpected error occurred. Please try again later.");
    initialLoad();
  });

  // Attach event listeners
  elements.submitBtn.addEventListener("click", handleUploadClick);
  elements.cancelBtn.addEventListener("click", handleCancelClick);
});