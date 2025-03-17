const express = require('express');
const multer = require("multer");
const app = express();
const PORT = 3000;

// Serves the public folder
app.use(express.static("public"));

// Configure multer to store in 'uploads/'
const upload = multer({ dest: "uploads/" });

// 3) Create a POST endpoint that matches the fetch("/upload")
app.post("/upload", upload.single("document"), (req, res) => {
    // Logs the submitted file
    console.log("Submitted file info:", req.file);
    // Sending back to front-end
    res.status(200).send("File uploaded successfully!");
  });
  // Start server on port and log
  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });

