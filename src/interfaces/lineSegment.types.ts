/**
 * Represents a line segment within an image
 *
 * @interface LineSegment
 *
 * @property {number} originalIndex The zero-based index of the line segment in the original document order.
 * @property {string} textContent the text.
 * @property {boolean} [edited] Whether the textContent has been manually edited by the user.
 * @property {string} [editedContent] The manually edited text, if `edited` is true.
 * @property {number} confidence Confidence score for the text recognition (a value between 0 and 100).
 * @property {{xmin: number, ymin: number, xmax: number, ymax: number}} bbox The bounding box of the line segment
 * @property {{points: Array<{x: number, y: number}>}} polygon The polygon outline of the text region.
 */
export interface LineSegment {
    originalIndex: number;
    textContent: string;      
    edited?: boolean;        
    editedContent?: string;
    confidence: number;
    bbox: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
      };
      polygon: {
        points: Array<{x: number, y: number}>;
      };
}
  