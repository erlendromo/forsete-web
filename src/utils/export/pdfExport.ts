import { LineSegment } from '../../interfaces/line-segment';
import PDFDocument from 'pdfkit';

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