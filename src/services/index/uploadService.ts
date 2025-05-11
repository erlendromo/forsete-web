import express from 'express';
import multer  from 'multer';

const router = express.Router();
const uploadEndpoint = "/upload";
// Where files get stored
const storage = "uploads";
const upload = multer({ dest: storage + '/' });

router.use("/"+storage, express.static(storage));
// Create a POST endpoint that matches the fetch("/upload")
router.post(uploadEndpoint, upload.single("document"), async (req, res) => {
  try {
    console.log("Submitted file info:", req.file);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return; // exit after sending response
    }
    if (req.file.originalname.toLowerCase().endsWith(".pdf")) {
    // PDF settings
      const pages = 1;
      const dpi = 300;
      // Convert PDF to image (pdfToImage expects the path on disk)
      //await pdfToImage(pages, req.file.filename, req.file.path, dpi);
    }

    res.status(200).json({
      message: "File uploaded successfully!",
      // hashed name in ./uploads
      filename: req.file.filename
    });
  } catch (err) {
    console.error('Error in /upload route:', err);
    res.status(500).json({ error: 'Server Error', details: String(err) });
  }
});

export default router;