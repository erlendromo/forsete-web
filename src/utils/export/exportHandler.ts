import { ExportFormat } from "../../config/constants.js";
import { LineSegment } from "../../interfaces/line-segment.js";
import { generateJsonFile } from "./jsonExport.js";
import { generatePlainTextPdf } from "./pdfExport.js";
import { generatePlainTextFile } from "./txtExport.js";

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