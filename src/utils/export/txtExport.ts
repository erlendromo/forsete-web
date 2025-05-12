import { LineSegment } from '../../interfaces/line-segment';

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