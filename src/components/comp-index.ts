import { hideElement, enableElement } from './comp-utils';
import{uploadFile,  transcribeFile } from '../services/filehandler.js';


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
  