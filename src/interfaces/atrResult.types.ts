/**
 * The result of updating the data from ATR.
 *
 * @interface UpdatedATRResult
 * @property {boolean} confirmed Whether the ATR result has been confirmed by the user.
 * @property {ATRResult} data The data from the atr result
 */
interface UpdatedATRResult {
  confirmed: boolean;
  data: ATRResult;
}

/**
 * Core ATR processing result, including metadata and recognized text elements.
 *
 * @interface ATRResult
 * @property {string} [file_name] Name of the source file (if available).
 * @property {string} [image_name] Name of the image processed (if available).
 * @property {string} [label] The name of the file without the file extension (if available).
 * @property {TextElement[]} contains Array of recognized text segments within the image.
 * @property {ProcessingStep[]} [processing_steps] Optional list of processing steps applied to produce this result (if available).
 */
interface ATRResult {
  file_name?: string;
  image_name?: string;
  label?: string;
  contains: TextElement[];
  processing_steps?: ProcessingStep[];
}

/**
 * A single recognized text segment with its geometry and optional edits.
 *
 * @interface TextElement
 * @property {Segment} segment
 *   The geometric info (bounding box, polygon, score) for this text region.
 * @property {TextResult} text_result
 *   The OCR result: array of possible texts and their confidence scores.
 * @property {string} label
 *   A classification label for the text segment (e.g. “header”, “paragraph”).
 * @property {EditedInfo} [edited]
 *   If the text was manually edited, metadata about that edit.
 */
interface TextElement {
  segment: Segment;
  text_result: TextResult;
  label: string;
  edited?: EditedInfo;
}

/**
 * Metadata about a manual edit to a recognized text segment.
 *
 * @interface EditedInfo
 * @property {string} text The corrected text string.
 * @property {string} timestamp ISO format, e.g., "2025-05-04T12:34:56Z".
 */
interface EditedInfo {
  text: string;
  timestamp: string;
}

/**
 * Geometric description of a text region: bounding box, polygon, and score.
 *
 * @interface Segment
 * @property {BoundingBox} bbox The axis‐aligned bounding box of the region.
 * @property {Polygon} polygon The exact outline as a polygon of points.
 * @property {number} score Confidence score for the detection (0–100).
 * @property {string} class_label What the yolo models labels as
 * @property {number[]} orig_shape Original image dimensions.
 * @property {Record<string, any>} data Any extra metadata.
 */
interface Segment {
  bbox: BoundingBox;
  polygon: Polygon;
  score: number;
  class_label: string;
  orig_shape: number[];
  data: Record<string, any>;
}

/**
 * Axis‐aligned bounding box coordinates.
 *
 * @interface BoundingBox
 * @property {number} xmin X‐coordinate of the top‐left corner.
 * @property {number} ymin Y‐coordinate of the top‐left corner.
 * @property {number} xmax X‐coordinate of the bottom‐right corner.
 * @property {number} ymax Y‐coordinate of the bottom‐right corner.
 */
interface BoundingBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

/**
 * A closed polygon defined by an array of points.
 *
 * @interface Polygon
 * @property {Point[]} points The vertices of the polygon.
 */
interface Polygon {
  points: Point[];
}

/**
 * A 2D point coordinate.
 *
 * @interface Point
 * @property {number} x The x‐coordinate.
 * @property {number} y The y‐coordinate.
 */
interface Point {
  x: number;
  y: number;
}

/**
 * The text result from text recognition
 *
 * @interface TextResult
 * @property {string[]} texts Candidate text strings recognized.
 * @property {number[]} scores Confidence scores for each candidate (same length as `texts`).
 */
interface TextResult {
  texts: string[];
  scores: number[];
}

/**
 * Metadata about one step in the ATR processing pipeline.
 *
 * @interface ProcessingStep
 * @property {string} description The description of what has been done (exmaple: linesegmentation or textrecognition)
 * @property {object} settings Configuration used by this step.
 * @property {string} settings.model_class The class of the model to be used in the processing step (example: `"segmentation"`, `"text-recognition"`).
 * @property {string} settings.model Specific model to be used in the processing step.
 * @property {string|null} settings.model_version Version string of the model, or `null` if unspecified.
 * @property {string} [settings.processor] Name of the processor it has been run on (exmaple: nvidia cuda)
 * @property {string} [settings.processor_version] Version of the processor.
 */
interface ProcessingStep {
  description: string;
  settings: {
    model_class: string;
    model: string;
    model_version: string | null;
    processor?: string;
    processor_version?: string;
  };
}

export { ATRResult, TextElement, Segment, BoundingBox, Polygon, Point, TextResult, ProcessingStep, UpdatedATRResult };