document.addEventListener("DOMContentLoaded", () => {
  // ids from the index.html
    const uploadBtn = document.getElementById("uploadBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const inputDoc = document.getElementById("inputDocument");
  
    uploadBtn.addEventListener("click", () => {
      // Grab the file from the input
      const file = inputDoc.files[0];
      if (!file) {
        alert("Please select a file first.");
        return;
      }
  
      // Append file to FormData
      const formData = new FormData();
      formData.append("document", file);
  
      // Endpoint
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed.");
        }
        return response.json();
      })
      .then((data) => {
        const filename = data.filename;
        alert("File uploaded successfully!");
        // Redirecting to results.html and filename as query parameter
        window.location.href = `results.html?file=${encodeURIComponent(filename)}`;
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Upload failed (check console for details).");
      });
    });

    cancelBtn.addEventListener("click", () => {
      inputDoc.value = "";
      console.log("Cancel button clicked. File input reset.");
    });
  })
  
  