// src/services/index/handlepdfToImageService.ts 
import { pdfToImage } from "../../utils/pdfUtils.js";
import { Request, Response } from "express";

/**
 * Converts a PDF file to an image and sends the image as a response.
 *
 * @param {Request} req - The Express request object containing the PDF file in the body.
 * @param {Response} res - The Express response object used to send the image back to the client.
 * @returns {Promise<void>} - A promise that resolves when the image is sent.
 */
export async function handlePdfToImage(req: Request, res: Response): Promise<void> {
  console.log('file?', req.file);
  try {
    // Check if the request contains a file
    const pdfBuffer = req.file?.buffer;
    
    if (!pdfBuffer) {
      res.status(400).json({ error: "No PDF file uploaded" });
      return;
    }
    // Return a buffer object of the first page of the PDF file
    const imageBuffer = await pdfToImage(1, pdfBuffer, 300);
    // Check if the imageBuffer is valid
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      console.error("Invalid image buffer");
      return;
    }
    // Set the response headers to indicate a PNG image download
    res.setHeader("Content-Type", "image/png");
    // Set the Content-Disposition header to prompt a download with a specific filename
    res.setHeader("Content-Disposition", 'attachment; filename="converted.png"');
    // Send the image buffer as the response
    res.send(imageBuffer);
  } catch (err) {
    console.error("Error converting PDF to image:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }

}
