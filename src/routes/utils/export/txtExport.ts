import { LineSegment } from '../../../interfaces/lineSegment.types';

/**
 * Generates a plain text file from an array of line segments.
 *
 * Filters out empty or whitespace-only segments, sorts the segments by their vertical position (`bbox.ymin`),
 * and joins their content with double newlines. If a segment has been edited and contains edited content,
 * that content is used; otherwise, the original text content is used.
 *
 * @param lineSegments - An array of `LineSegment` objects to be exported as plain text.
 * @returns An object containing:
 *   - `buffer`: The generated plain text as a UTF-8 encoded Buffer.
 *   - `mimeType`: The MIME type for plain text files (`text/plain`).
 *   - `extension`: The file extension for plain text files (`txt`).
 */
export function generatePlainTextFile(lineSegments: LineSegment[]): { buffer: Buffer, mimeType: string, extension: string } {
  const content = lineSegments
    .filter(segment => {
      const text = segment.edited && segment.editedContent ? segment.editedContent : segment.textContent;
      return text && text.trim() !== '';
    })
    .sort((a, b) => a.bbox.ymin - b.bbox.ymin)
    .map(segment => segment.edited && segment.editedContent ? segment.editedContent : segment.textContent)
    .join('\n\n');

  return {
    buffer: Buffer.from(content, 'utf-8'),
    mimeType: 'text/plain',
    extension: 'txt',
  };
}