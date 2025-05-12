import { LineSegment } from '../../interfaces/line-segment';

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