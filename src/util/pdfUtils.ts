// pdfUtils.ts
import fs from 'fs';
import { fromPath } from "pdf2pic";
import { PDFDocument } from 'pdf-lib';

interface PdfSize {
  height: number;
  width: number;
}

// Exports a function that returns the size of the PDF's first page
export async function getPdfSize(pdfPath: string): Promise<PdfSize> {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const firstPage = pdfDoc.getPage(0);
  const { width, height } = firstPage.getSize();
  return { width, height };
}

/**
 * Converts a PDF (on the server's filesystem) to an image.
 * @param pages The page number to convert
 * @param name The base name for the output file (no extension).
 * @param path The *server-side path* to the PDF.
 * @param density The DPI to use for conversion.
 * @returns The result object from pdf2pic containing { page, name, path, etc. }
 */
export async function pdfToImage(
  pages: number,
  name: string,
  path: string,
  density: number
): Promise<any> {
  // The size of the pdf, height and width
  const size = await getPdfSize(path);

  // Options
  const options = {
    density,
    saveFilename: name,
    savePath: "./uploads", // Folder on the server
    format: "png",
    width: size.width,
    height: size.height,
  };
  const convert = fromPath(path, options);
  return convert(pages, { responseType: "image" });
}