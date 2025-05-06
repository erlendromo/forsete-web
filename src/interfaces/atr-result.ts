
    // Main document interface
    interface ATRResult {
      file_name: string;
      image_id: string;
      image_name: string;
      label: string;
      contains: TextElement[];
      processing_steps: ProcessingStep[];
    }
    
    // Text element interface representing recognized text segments
    interface TextElement {
      segment: Segment;
      text_result: TextResult;
      label: string;
      edited?: EditedInfo; // <-- Add this line
    }

    interface EditedInfo {
      text: string;
      timestamp: string; // ISO format, e.g., "2025-05-04T12:34:56Z"
    }
    
    // Segment interface with bounding box and polygon information
    interface Segment {
      bbox: BoundingBox;
      polygon: Polygon;
      score: number;
      class_label: string;
      orig_shape: number[];
      data: Record<string, any>;
    }
    
    // Bounding box coordinates
    interface BoundingBox {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
    }
    
    // Polygon representing the outline of a text region
    interface Polygon {
      points: Point[];
    }
    
    // Point coordinates
    interface Point {
      x: number;
      y: number;
    }
    
    // Text recognition result
    interface TextResult {
      texts: string[];
      scores: number[];
    }
    
    // Processing step metadata
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
export { ATRResult, TextElement, Segment, BoundingBox, Polygon, Point, TextResult, ProcessingStep };