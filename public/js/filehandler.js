document.addEventListener("DOMContentLoaded", () => {
  // Group DOM elements for easier reference
  const elements = {
    submitBtn: document.getElementById("submitBtn"),
    cancelBtn: document.getElementById("cancelBtn"),
    inputDoc: document.getElementById("inputDocument"),
    fileNameID: document.getElementById("fileName"),
    spinnerId: document.getElementById("spinnerId"),
    uploadArea: document.getElementById("uploadArea")
  };

  // Show loader and add blur effect
  const showLoader = () => {
    elements.uploadArea.classList.add('blur-sm'); // Blur the upload area
    elements.uploadArea.classList.add('pointer-events-none');
    // pointer-events-none
   // elements.submitBtn.disabled = disabled;
    
    // Disable the submit button and apply blur
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('blur-sm');

    // Ensure cancel remains enabled if needed
    elements.cancelBtn.disabled = false;
  };

  // Hide loader and remove blur effect
  const initalLoad = () => {
    elements.spinnerId.style.display = 'none';
    hideButton(elements.cancelBtn);
    hideButton(elements.submitBtn);
  };

  const hideButton = async (button) => {
    button.classList.add('pointer-events-none');
    button.classList.add('blur-sm');
    button.disabled = true;
  }

  const enableButton = async (button) => {
    button.classList.remove('pointer-events-none');
    button.classList.remove('blur-sm');
    button.disabled = false;
  }

  const enableLoading = async () => {
    hideButton(elements.uploadArea);
    hideButton(elements.submitBtn);
    enableButton(elements.cancelBtn);
    elements.spinnerId.classList.remove('hidden');
    elements.spinnerId.style.display = 'flex';
  }

  // Hide the loader on initial load
  initalLoad();

  // Upload file to the server
  const uploadFile = async (file) => {
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
  const transcribeFile = async (filename) => {
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
  const handleUploadClick = async () => {
    const file = elements.inputDoc.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    enableLoading();
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
    } finally {
      enableButton(elements.submitBtn);
    }
  };

  elements.inputDoc.addEventListener("change", () => {
    if (elements.inputDoc.files.length > 0) {
      // A file has been selected; show the cancel button
      enableButton(elements.cancelBtn);
      enableButton(elements.submitBtn);
    } else {
      // No file is selected; hide the cancel button
      hideButton(elements.cancelBtn);
      hideButton(elements.submitBtn);
    }
  });

  // Handle the cancel button click event
  const handleCancelClick = () => {
    // Reset the file input and filename display
    elements.inputDoc.value = "";
    elements.fileNameID.textContent = "No file chosen";
    hideButton(elements.cancelBtn);
    hideButton(elements.submitBtn);
    elements.spinnerId.style.display = 'none';
    enableButton(elements.uploadArea);
    console.log("Cancel button clicked. File input reset.");
  };

  // Attach event listeners
  elements.submitBtn.addEventListener("click", handleUploadClick);
  elements.cancelBtn.addEventListener("click", handleCancelClick);
});
