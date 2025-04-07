  // Upload file to the server
  export const uploadFile = async (file: File): Promise<any> => {
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
  export const transcribeFile = async (filename: string): Promise<any> => {
    const response = await fetch("/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename })
    });

    if (!response.ok) {
      const errorMessage = await response.text(); 
      throw new Error(`Transcription failed: ${errorMessage}`);
    }
    return response.json();
  };
