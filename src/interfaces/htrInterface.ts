// The top-level object interface
export interface ImageData {
    file_name: string;
    image_path: string;
    image_name: string;
    label: string;
    contains: ImageNode[];
  }
  
  // Each node (or region) within the image data
  export interface ImageNode {
    segment: Segment;
    label: string;
    // Some nodes might include text results
    text_result?: TextResult;
    // And they can recursively contain more nodes
    contains?: ImageNode[];
  }
  
  // Defines the segment data for a region
  export interface Segment {
    bbox: BoundingBox;
    polygon: Polygon;
    score: number;
    class_label: string;
    // Assuming orig_shape is always an array of two numbers, e.g., [width, height]
    orig_shape: [number, number];
    data: Record<string, any>;
  }
  
  // Bounding box information
  export interface BoundingBox {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }
  
  // A polygon is defined as an array of points
  export interface Polygon {
    points: Point[];
  }
  
  // A single point with x and y coordinates
  export interface Point {
    x: number;
    y: number;
  }
  
  // If a node has a text result, it is represented by an array of texts and scores
  export interface TextResult {
    texts: string[];
    scores: number[];
  }
  