import { LineSegment } from '../../../interfaces/lineSegment.types';


/**
 * Generates a JSON file from an array of LineSegment objects.
 *
 * Filters out segments with empty or whitespace-only text, then maps each segment to an object
 * containing its text (preferring edited content if available) and bounding box.
 * Returns an object containing the JSON file as a Buffer, along with its MIME type and file extension.
 *
 * @param lineSegments - The array of LineSegment objects to export.
 * @returns An object containing:
 *   - buffer: The Buffer containing the JSON data.
 *   - mimeType: The MIME type for JSON files ('application/json').
 *   - extension: The file extension for JSON files ('json').
 */
export function generateJsonFile(lineSegments: LineSegment[]): { buffer: Buffer, mimeType: string, extension: string } {
  const data = lineSegments
    .filter(segment => {
      const text = segment.edited && segment.editedContent ? segment.editedContent : segment.textContent;
      return text && text.trim() !== '';
    })
    .map(segment => ({
      text: segment.edited && segment.editedContent ? segment.editedContent : segment.textContent,
      bbox: segment.bbox
    }));

  const jsonString = JSON.stringify(data, null, 2);
  return {
    buffer: Buffer.from(jsonString, 'utf-8'),
    mimeType: 'application/json',
    extension: 'json',
  };
}