document.addEventListener("DOMContentLoaded", () => {
  // ids from the index.html
    const uploadBtn = document.getElementById("uploadBtn");
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
          if (response.ok) {
            alert("File uploaded successfully!");
          } else {
            alert("Upload failed.");
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          alert("Upload failed (check console for details).");
        });
    });
  });
  
  