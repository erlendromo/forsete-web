document.addEventListener("DOMContentLoaded", () => {
  // ids from the index.html
    const uploadBtn = document.getElementById("uploadBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const inputDoc = document.getElementById("inputDocument");
  
    uploadBtn.addEventListener("click", async () => {
      const file = inputDoc.files[0];
      if (!file) {
        alert("Please select a file first.");
        return;
      }
      
      const formData = new FormData();
      formData.append("document", file);
      
      try {
        // First, upload the file.
        const uploadResponse = await fetch("/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Upload failed.");
        }
        
        const uploadData = await uploadResponse.json();
        const filename = uploadData.filename;
        alert("File uploaded successfully!");
        
        // Second: call /transcribe with the filename
      const transcribeResponse = await fetch("/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });
      
      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed.");
      }
      const transcribeData = await transcribeResponse.json();
      console.log("Transcription data:", transcribeData);
      window.location.href = `results.html?file=${encodeURIComponent(filename)}`;
    } catch (error) {
      console.error("Error:", error);
      alert("Operation failed (check console for details).");
    }
    });

    cancelBtn.addEventListener("click", () => {
      inputDoc.value = "";
      console.log("Cancel button clicked. File input reset.");
    });
  })
  
  