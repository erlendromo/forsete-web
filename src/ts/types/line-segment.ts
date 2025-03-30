// Interfaces for editing results

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
  