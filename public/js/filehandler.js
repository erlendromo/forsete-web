document.addEventListener("DOMContentLoaded", () => {
  // ids from the index.html
  const uploadBtn = document.getElementById("uploadBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const inputDoc = document.getElementById("inputDocument");
  const fileNameID = document.getElementById("fileName");

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
  /**
* Handles the click event on the cancel button.
* 
* When clicked, this function clears the file input field and resets the file name display text.
* It also logs a message to the console for debugging purposes.
* 
* @event click
* @listener
*/
  cancelBtn.addEventListener("click", () => {
    inputDoc.value = "";
    fileNameID.textContent = "No file chosen";
    console.log("Cancel button clicked. File input reset.");
  });
})

