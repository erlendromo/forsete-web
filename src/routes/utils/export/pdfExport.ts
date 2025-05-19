import { LineSegment } from '../../../interfaces/lineSegment.types';
import PDFDocument from 'pdfkit';

/**
 * Generates a plain text PDF from an array of line segments.
 *
 * Each line segment is filtered to exclude empty or whitespace-only content,
 * and sorted by their vertical position (`bbox.ymin`). The resulting PDF
 * contains each segment's text, using the 'Helvetica' font at size 12,
 * with a paragraph gap between lines.
 *
 * @param lineSegments - An array of `LineSegment` objects, each representing a line of text with bounding box and optional edited content.
 * @returns A Promise that resolves to an object containing:
 *   - `buffer`: The generated PDF as a Buffer.
 *   - `mimeType`: The MIME type of the PDF ('application/pdf').
 *   - `extension`: The file extension ('pdf').
 */
export function generatePlainTextPdf(lineSegments: LineSegment[]): Promise<{ buffer: Buffer, mimeType: string, extension: string }> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          mimeType: 'application/pdf',
          extension: 'pdf',
        });
      });

      const filteredSegments = lineSegments
        .filter(segment => {
          const text = segment.edited && segment.editedContent ? segment.editedContent : segment.textContent;
          return text && text.trim() !== '';
        })
        .sort((a, b) => a.bbox.ymin - b.bbox.ymin);

      doc.font('Helvetica').fontSize(12);

      filteredSegments.forEach(segment => {
        const text = segment.edited && segment.editedContent ? segment.editedContent : segment.textContent;
        doc.text(text, { paragraphGap: 10 });
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}