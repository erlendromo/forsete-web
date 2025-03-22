document.addEventListener("DOMContentLoaded", () => {
  // Group DOM elements for easier reference
  const elements = {
    submitBtn: document.getElementById("submitBtn"),
    cancelBtn: document.getElementById("cancelBtn"),
    inputDoc: document.getElementById("inputDocument"),
    fileNameID: document.getElementById("fileName"),
    loaderBtn: document.getElementById("loaderBtn"),
    uploadArea: document.getElementById("uploadArea")
  };

  // Show loader and add blur effect
  const showLoader = () => {
    elements.uploadArea.classList.add('blur-sm'); // Blur the upload area
    elements.uploadArea.classList.add('pointer-events-none');
    // pointer-events-none
    elements.submitBtn.disabled = disabled;
    
    // Disable the submit button and apply blur
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('blur-sm');

    // Ensure cancel remains enabled if needed
    elements.cancelBtn.disabled = false;
  };

  const hideButton = () => {
    elements.submitBtn.classList.remove('blur-sm');

  }

  // Hide loader and remove blur effect
  const hideLoader = () => {
    elements.loaderBtn.style.display = 'none';
    elements.uploadArea.classList.remove('blur-sm');
    elements.submitBtn.classList.remove('blur-sm');
    elements.submitBtn.disabled = false;
    elements.cancelBtn.disabled = false;
  };

  // Hide the loader on initial load
  hideLoader();

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
    showLoader();
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
      hideLoader();
    }
  };

  // Handle the cancel button click event
  const handleCancelClick = () => {
    // Reset the file input and filename display
    elements.inputDoc.value = "";
    elements.fileNameID.textContent = "No file chosen";
    
    hideLoader();

    // Optionally, disable the submit and cancel buttons after reset
    elements.submitBtn.disabled = true;
    elements.cancelBtn.disabled = true;

    console.log("Cancel button clicked. File input reset.");
  };

  // Attach event listeners
  elements.submitBtn.addEventListener("click", handleUploadClick);
  elements.cancelBtn.addEventListener("click", handleCancelClick);
});
