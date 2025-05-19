import { ExportFormat } from "../../../config/constants.js";
import { LineSegment } from "../../../interfaces/lineSegment.types.js";
import { generateJsonFile } from "./jsonExport.js";
import { generatePlainTextPdf } from "./pdfExport.js";
import { generatePlainTextFile } from "./txtExport.js";

/**
 * Handles the export of line segments into various file formats.
 *
 * Depending on the specified export format, this function generates a file
 * (plain text, JSON, or plain PDF) containing the provided line segments,
 * and returns the file buffer, MIME type, and the generated filename.
 *
 * @param lineSegments - The array of line segments to export.
 * @param filename - The base name for the exported file (without extension).
 * @param format - The desired export format (plain text, JSON, or plain PDF).
 * @returns An object containing the file buffer, MIME type, and the full filename.
 * @throws {Error} If the specified export format is not supported.
 */
export async function handleExport(
    lineSegments: LineSegment[], 
    filename: string, 
    format: ExportFormat
  ): Promise<{ buffer: Buffer, mimeType: string, filename: string }> {
    switch (format) {
      case ExportFormat.PLAIN_TXT: {
        const { buffer, mimeType, extension } = generatePlainTextFile(lineSegments);
        return { buffer, mimeType, filename: `${filename}.${extension}` };
      }
      case ExportFormat.JSON: {
        const { buffer, mimeType, extension } = generateJsonFile(lineSegments);
        return { buffer, mimeType, filename: `${filename}.${extension}` };
      }
      case ExportFormat.PLAIN_PDF: {
        const { buffer, mimeType, extension } = await generatePlainTextPdf(lineSegments);
        return { buffer, mimeType, filename: `${filename}-plaintext.${extension}` };
      }
      default:
        throw new Error('Unsupported export format');
    }
  }