// src/services/index/handlepdfToImageService.ts 
import { HTTP_STATUS } from "../../config/constants.js";
import { pdfToImage } from "../../utils/pdfUtils.js";
import { Request, Response } from "express";

/**
 * Converts a PDF file to an image and sends the image as a response.
 *
 * @param {Request} req - The Express request object containing the PDF file in the body.
 * @param {Response} res - The Express response object used to send the image back to the client.
 * @returns {Promise<void>} - Returns a promise that resolves when the image is sent.
 */
export async function handlePdfToImage(req: Request, res: Response): Promise<Response> {
  try {
    const pdf = req.file?.buffer;
    if (!pdf) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "No PDF file" });
      
    }
    const png = await pdfBufferToPngBuffer(pdf);
    // Set the response type headers to png
    res.type('png');    
    // Res.end(png) sends the image as a response
    console.log("PDF to PNG conversion successful");                
    return res.send(png);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Converts a PDF buffer to a PNG buffer.
 *
 * @param {Buffer} pdf - The PDF file content as a Buffer.
 * @returns {Promise<Buffer>} - A Promise that resolves to a Buffer containing the image data.
 * @throws Will throw an error if the conversion fails.
 */
export async function pdfBufferToPngBuffer(pdf: Buffer): Promise<Buffer> {
  return pdfToImage(1, pdf, 300);
}