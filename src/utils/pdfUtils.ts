// utils/pdfUtils.ts
import { fromBuffer } from "pdf2pic";
import { PDFDocument } from 'pdf-lib';

interface PdfSize {
  height: number;
  width: number;
}

/**
 * Retrieves the dimensions of the first page of a PDF document.
 *
 * @param bytesFromPdf - The PDF file content as a Buffer.
 * @returns A Promise that resolves to an object containing the width and height of the first page.
 * @throws Will throw an error if the PDF size cannot be determined.
 */
export async function getPdfSize(bytesFromPdf: Buffer): Promise<PdfSize> {
  const pdfDoc = await PDFDocument.load(bytesFromPdf);
  const { width, height } = pdfDoc.getPage(0).getSize();
  return { width, height };
}

/**
 * Converts a specific page of a PDF into an image buffer.
 *
 * @description This function it meant to be used to convert a PDF file to an image.
 * For this to work two dependencies are required: pdf-lib and pdf2pic, server also needs
 * installation of dependencies to make pdf2pic to work.
 * @param pages - The page number to convert (1-based index).
 * @param bytesFromPdf - The PDF file content as a Buffer.
 * @param density - The resolution density for the output image (measured in DPI).
 * @returns A Promise that resolves to a Buffer containing the image data of the specified page.
 * @throws Will throw an error if the PDF size cannot be determined or if the conversion fails.
 */
export async function pdfToImage(pages: number, bytesFromPdf: Buffer, density: number): Promise<Buffer> {
  // The size of the pdf, height and width
  const size = await getPdfSize(bytesFromPdf);
  const { width, height } = size;
  if (!width || !height) {
    throw new Error("Failed to get PDF size");
  }

  // Options
  const convert = fromBuffer(bytesFromPdf, {
    density,
    format: "png",
    width,
    height,
  });
  const pageOutput = await convert(pages, { responseType: "buffer" });
  if (!pageOutput || !pageOutput.buffer) {
    throw new Error("pdf2pic failed to produce an image buffer");
  }
  
  return pageOutput.buffer; 
}