import { LineSegment } from '../../types/line-segment';
import { BoundingBox } from '../../types/atr-result';

declare global {
  interface Window {
    jspdf: {
      jsPDF: any;
    };
  }
}
export function generatePdfFromLineSegments(
  lineSegments: LineSegment[], 
  pageWidth: number = 612, 
  pageHeight: number = 792,
  filename: string = 'document',
  showDebug: boolean = false
): void {
  try {
    // Determine if landscape orientation is needed
    const isLandscape: boolean = pageWidth > pageHeight;
    
    // Create a new jsPDF instance
    const doc = new window.jspdf.jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [pageWidth, pageHeight]
    });
    
    // Set default font
    doc.setFont('Helvetica', 'normal');
    
    // Filter out very small segments and empty text
    const filteredSegments: LineSegment[] = lineSegments.filter((segment: LineSegment) => {
      const width: number = segment.bbox.xmax - segment.bbox.xmin;
      const height: number = segment.bbox.ymax - segment.bbox.ymin;
      const isEmpty: boolean = !segment.textContent || segment.textContent.trim() === '';
      return width >= 3 && height >= 3 && !isEmpty;
    });
    
    // Draw debug visualization if requested
    if (showDebug) {
      drawDebugVisualization(doc, filteredSegments);
    }
    
    // First pass: preserve original positions when possible
    const occupiedAreas: BoundingBox[] = [];
    const adjustedSegments: LineSegment[] = [];
    const remainingSegments: LineSegment[] = [];
    
    // Sort by Y position for top-to-bottom processing
    const sortedSegments = [...filteredSegments].sort((a, b) => a.bbox.ymin - b.bbox.ymin);
    
    // Process each segment
    for (const segment of sortedSegments) {
      const bbox: BoundingBox = {
        xmin: segment.bbox.xmin,
        ymin: segment.bbox.ymin,
        xmax: segment.bbox.xmax,
        ymax: segment.bbox.ymax,
      };
      
      // Check if this segment overlaps significantly with existing segments
      if (hasSignificantOverlap(bbox, occupiedAreas)) {
        // Save for second pass
        remainingSegments.push(segment);
      } else {
        // Register this position as occupied
        occupiedAreas.push(bbox);
        
        // Place text at original position
        const textContent: string = segment.edited && segment.editedContent ? 
          segment.editedContent : segment.textContent;
        
        placeTextInBox(doc, textContent, segment.bbox, segment.confidence, false);
        
        // Add to adjusted segments list for tracking
        adjustedSegments.push(segment);
      }
    }
    
    // Second pass: place remaining segments with adjustments to avoid overlap
    for (const segment of remainingSegments) {
      const textContent: string = segment.edited && segment.editedContent ? 
        segment.editedContent : segment.textContent;
      
      // Create a working copy of the bounding box
      const originalBbox: BoundingBox = {
        xmin: segment.bbox.xmin,
        ymin: segment.bbox.ymin,
        xmax: segment.bbox.xmax,
        ymax: segment.bbox.ymax,
      };
      
      // Try to find a position with minimal adjustment
      const adjustedBbox: BoundingBox | null = findNonOverlappingPosition(
        originalBbox, 
        occupiedAreas,
        pageWidth,
        pageHeight
      );
      
      if (adjustedBbox) {
        // Place text at adjusted position
        placeTextInBox(doc, textContent, adjustedBbox, segment.confidence, true);
        
        // Register adjusted position as occupied
        occupiedAreas.push(adjustedBbox);
        
        // Add to adjusted segments list
        adjustedSegments.push(segment);
        
        // Draw adjusted box if in debug mode
        if (showDebug) {
          doc.setDrawColor(0, 180, 0); // Green for adjusted boxes
          doc.setLineWidth(0.3);
          const width = adjustedBbox.xmax - adjustedBbox.xmin;
          const height = adjustedBbox.ymax - adjustedBbox.ymin;
          doc.rect(adjustedBbox.xmin, adjustedBbox.ymin, width, height);
        }
      } else {
        // If no non-overlapping position could be found, use best-effort placement
        // with a tolerance for some overlap
        console.log(`Using fallback placement for text: ${textContent}`);
        
        // Place text at original position with reduced font size
        placeTextInBox(doc, textContent, originalBbox, segment.confidence, true, 0.7); // Smaller font
        
        // Register original position as occupied for tracking (even with overlap)
        occupiedAreas.push(originalBbox);
        
        // Draw warning indicator in debug mode
        if (showDebug) {
          doc.setDrawColor(255, 165, 0); // Orange for warning
          doc.setLineWidth(0.5);
          const width = originalBbox.xmax - originalBbox.xmin;
          const height = originalBbox.ymax - originalBbox.ymin;
          doc.rect(originalBbox.xmin - 2, originalBbox.ymin - 2, width + 4, height + 4);
        }
      }
    }
    
    // Add visual indicator for edited text if any
    if (lineSegments.some(segment => segment.edited)) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("* Some text has been edited from the original", 20, pageHeight - 20);
    }
    
    // Save the PDF
    doc.save(`${filename}-output.pdf`);
    console.log(`PDF created successfully: ${filename}-output.pdf`);
    console.log(`Total segments: ${filteredSegments.length}, Placed: ${adjustedSegments.length}`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Place text within a bounding box with proper sizing and wrapping
 * @param doc - The jsPDF document
 * @param text - The text to place
 * @param bbox - The bounding box to place text in
 * @param confidence - Confidence score (optional)
 * @param isAdjusted - Whether this position was adjusted
 * @param fontSizeMultiplier - Optional multiplier to reduce font size further
 */
function placeTextInBox(
  doc: any, 
  text: string, 
  bbox: BoundingBox, 
  confidence?: number,
  isAdjusted: boolean = false,
  fontSizeMultiplier: number = 1.0
): void {
  const width: number = bbox.xmax - bbox.xmin;
  const height: number = bbox.ymax - bbox.ymin;
  
  // Calculate font size based on the height of the bounding box
  // Use a smaller percentage for adjusted boxes
  const fontSizePercent: number = isAdjusted ? 0.6 : 0.65;
  const fontSize: number = Math.max(Math.floor(height * fontSizePercent * fontSizeMultiplier), 5);
  doc.setFontSize(fontSize);
  
  // Set text color based on confidence if available
  if (confidence !== undefined && confidence < 0.7) {
    const confidenceColor: number = Math.round(40 + (confidence * 100));
    doc.setTextColor(confidenceColor, confidenceColor, confidenceColor);
  } else {
    doc.setTextColor(0, 0, 0);
  }
  
  // Calculate text position
  const centerX: number = (bbox.xmin + bbox.xmax) / 2;
  const centerY: number = bbox.ymin + (height * 0.6); // Position near top for multi-line text
  
  // Check if text fits within width
  const textWidth: number = doc.getTextWidth(text);
  
  if (textWidth <= width * 0.9) {
    // Simple case: text fits in one line
    doc.text(text, centerX, centerY, { align: 'center' });
  } else {
    // Text is too wide - reduce font size
    const scaleFactor: number = (width * 0.9) / textWidth;
    const adjustedFontSize: number = Math.max(fontSize * scaleFactor, 5);
    doc.setFontSize(adjustedFontSize);
    
    // Check if it fits now
    if (doc.getTextWidth(text) <= width * 0.9) {
      doc.text(text, centerX, centerY, { align: 'center' });
    } else {
      // Still too wide - break into multiple lines
      const maxLines: number = Math.floor(height / (adjustedFontSize * 0.9));
      if (maxLines >= 2) {
        wrapTextInBox(doc, text, centerX, centerY - (adjustedFontSize * 0.4), width * 0.9, maxLines, adjustedFontSize);
      } else {
        // Not enough vertical space, just truncate with ellipsis
        const ellipsis: string = "...";
        const ellipsisWidth: number = doc.getTextWidth(ellipsis);
        let truncated: string = text;
        
        // Truncate text to fit with ellipsis
        while (doc.getTextWidth(truncated + ellipsis) > width * 0.9 && truncated.length > 1) {
          truncated = truncated.slice(0, -1);
        }
        
        doc.text(truncated + ellipsis, centerX, centerY, { align: 'center' });
      }
    }
  }
}

/**
 * Find a non-overlapping position for a bounding box with minimal adjustment
 * @param originalBbox - The original bounding box
 * @param occupiedAreas - Array of already occupied areas
 * @param pageWidth - Width of the page
 * @param pageHeight - Height of the page
 * @returns Adjusted bounding box or null if no suitable position found
 */
function findNonOverlappingPosition(
  originalBbox: BoundingBox, 
  occupiedAreas: BoundingBox[],
  pageWidth: number,
  pageHeight: number
): BoundingBox | null {
  const width: number = originalBbox.xmax - originalBbox.xmin;
  const height: number = originalBbox.ymax - originalBbox.ymin;
  
  // Create a list of possible adjustments from small to large
  const adjustments: Array<[number, number]> = [
    [0, 5],     // Move down 5pt
    [0, 10],    // Move down 10pt
    [0, -5],    // Move up 5pt
    [5, 0],     // Move right 5pt
    [10, 0],    // Move right 10pt
    [-5, 0],    // Move left 5pt
    [5, 5],     // Move down-right 5pt
    [5, -5],    // Move up-right 5pt
    [-5, 5],    // Move down-left 5pt
    [0, 15],    // Move down 15pt
    [15, 0],    // Move right 15pt
    [15, 15],   // Move down-right 15pt
    [0, 20],    // Move down 20pt
    [20, 0],    // Move right 20pt
    [20, 20],   // Move down-right 20pt
    [0, 30],    // Move down 30pt
    [30, 0],    // Move right 30pt
    [0, -10],   // Move up 10pt
    [-10, 0],   // Move left 10pt
    [30, 30],   // Move down-right 30pt
  ];
  
  // Try each adjustment
  for (const [dx, dy] of adjustments) {
    const adjustedBbox: BoundingBox = {
      xmin: originalBbox.xmin + dx,
      ymin: originalBbox.ymin + dy,
      xmax: originalBbox.xmax + dx,
      ymax: originalBbox.ymax + dy,
    };
    
    // Ensure adjusted position is within page bounds
    if (adjustedBbox.xmin < 0 || adjustedBbox.xmax > pageWidth || 
        adjustedBbox.ymin < 0 || adjustedBbox.ymax > pageHeight) {
      continue;
    }
    
    // Check if this position overlaps with existing content
    if (!hasSignificantOverlap(adjustedBbox, occupiedAreas)) {
      return adjustedBbox;
    }
  }
  
  // If all standard adjustments fail, try a more aggressive approach
  // Try positions in a grid around the original position
  const gridSize: number = 50;
  const steps: number = 10;
  
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      // Skip the center position (already tried)
      if (x === 0 && y === 0) continue;
      
      for (let step = 1; step <= steps; step++) {
        const dx: number = x * gridSize * step;
        const dy: number = y * gridSize * step;
        
        const adjustedBbox: BoundingBox = {
          xmin: originalBbox.xmin + dx,
          ymin: originalBbox.ymin + dy,
          xmax: originalBbox.xmax + dx,
          ymax: originalBbox.ymax + dy,
        };
        
        // Ensure adjusted position is within page bounds
        if (adjustedBbox.xmin < 0 || adjustedBbox.xmax > pageWidth || 
            adjustedBbox.ymin < 0 || adjustedBbox.ymax > pageHeight) {
          continue;
        }
        
        // Check if this position overlaps with existing content
        if (!hasSignificantOverlap(adjustedBbox, occupiedAreas)) {
          return adjustedBbox;
        }
      }
    }
  }
  
  // Could not find a non-overlapping position
  return null;
}

/**
 * Check if a bounding box has significant overlap with any occupied areas
 * @param bbox - The bounding box to check
 * @param occupiedAreas - Array of already occupied areas
 * @returns True if significant overlap exists
 */
function hasSignificantOverlap(bbox: BoundingBox, occupiedAreas: BoundingBox[]): boolean {
  for (const area of occupiedAreas) {
    // Skip self-comparison if IDs match
   
    
    // Check for overlap using standard rectangle intersection formula
    const xOverlap: number = Math.max(0, Math.min(bbox.xmax, area.xmax) - Math.max(bbox.xmin, area.xmin));
    const yOverlap: number = Math.max(0, Math.min(bbox.ymax, area.ymax) - Math.max(bbox.ymin, area.ymin));
    
    // Calculate area of overlap
    const overlapArea: number = xOverlap * yOverlap;
    
    // Only check significant overlaps to avoid minor pixel-level intersections
    if (overlapArea <= 2) {
      continue;
    }
    
    // Calculate percentage of overlap relative to the smaller box
    const bboxArea: number = (bbox.xmax - bbox.xmin) * (bbox.ymax - bbox.ymin);
    const areaArea: number = (area.xmax - area.xmin) * (area.ymax - area.ymin);
    const smallerArea: number = Math.min(bboxArea, areaArea);
    
    const overlapPercentage: number = smallerArea > 0 ? overlapArea / smallerArea : 0;
    
    // Consider significant overlap if it exceeds 15% of the smaller box
    if (overlapPercentage > 0.15) {
      return true;
    }
  }
  return false;
}

/**
 * Draw text wrapped to fit within a specific width
 * @param doc - The jsPDF document instance
 * @param text - The text to wrap
 * @param x - X coordinate (center position)
 * @param y - Y coordinate (starting position)
 * @param maxWidth - Maximum width for text
 * @param maxLines - Maximum number of lines to use
 * @param fontSize - Font size for line spacing calculation
 */
function wrapTextInBox(
  doc: any, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  maxLines: number, 
  fontSize: number
): void {
  const words: string[] = text.split(' ');
  let line: string = '';
  let lineCount: number = 0;
  
  for (let i = 0; i < words.length; i++) {
    const testLine: string = line + (line ? ' ' : '') + words[i];
    const testWidth: number = doc.getTextWidth(testLine);
    
    if (testWidth <= maxWidth) {
      line = testLine;
    } else {
      // Draw the line and move to next line
      doc.text(line, x, y + (lineCount * fontSize * 1.2), { align: 'center' });
      lineCount++;
      line = words[i];
      
      // Check if we've reached the maximum number of lines
      if (lineCount >= maxLines - 1) {
        // If this is the last allowed line, check if there are more words
        if (i < words.length - 1) {
          // Add ellipsis to indicate truncation
          line += '...';
          doc.text(line, x, y + (lineCount * fontSize * 1.2), { align: 'center' });
          return;
        }
      }
    }
  }
  
  // Draw the last line
  if (line) {
    doc.text(line, x, y + (lineCount * fontSize * 1.2), { align: 'center' });
  }
}

/**

 */
function drawDebugVisualization(doc: any, lineSegments: LineSegment[]): void {
  lineSegments.forEach((segment: LineSegment) => {
    const bbox: BoundingBox = segment.bbox;
    const points: Array<{x: number, y: number}> = segment.polygon.points;
    const width: number = bbox.xmax - bbox.xmin;
    const height: number = bbox.ymax - bbox.ymin;
    
    // Skip very small boxes that might be noise
    if (width < 3 || height < 3) {
      return;
    }
    
    // Draw rectangle for bounding box
    doc.setDrawColor(200, 0, 0); // Red
    doc.setLineWidth(0.5);
    doc.rect(bbox.xmin, bbox.ymin, width, height);
    
    // Draw polygon outline
    if (points && points.length > 1) {
      doc.setDrawColor(0, 100, 200); // Blue
      doc.setLineWidth(0.3);
      
      // Draw lines between points
      for (let i = 0; i < points.length; i++) {
        const next: number = (i + 1) % points.length;
        doc.line(
          points[i].x, 
          points[i].y, 
          points[next].x, 
          points[next].y
        );
      }
    }
    
    // Indicate if segment has been edited
    if (segment.edited) {
      doc.setFontSize(8);
      doc.setTextColor(200, 0, 0);
      doc.text("*", bbox.xmin - 8, bbox.ymin + height/2);
    }
    
    // Draw index number for debug purposes
    doc.setFontSize(7);
    doc.setTextColor(0, 150, 0);
    doc.text(String(segment.originalIndex), bbox.xmin, bbox.ymin - 2);
  });
}
  
  export function generatePlainTextPdf(
lineSegments: LineSegment[], p0: number, p1: number, filename: string = 'document', p2: boolean  ): void {
    try {
      // Create a new jsPDF instance
      const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      // Set default font
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Filter out empty text and sort by Y position
      const filteredSegments = lineSegments
        .filter(segment => {
          const text = segment.edited && segment.editedContent ? segment.editedContent : segment.textContent;
          return text && text.trim() !== '';
        })
        .sort((a, b) => a.bbox.ymin - b.bbox.ymin);
      
      // Set page margins and line height
      const margin = 50;
      const lineHeight = 18;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const textWidth = pageWidth - (margin * 2);
      
      // Start position
      let y = margin;
      
      // Simple text placement - just line by line
      filteredSegments.forEach(segment => {
        const text = segment.edited && segment.editedContent ? segment.editedContent : segment.textContent;
        
        // Handle text wrapping
        const words = text.split(' ');
        let line = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + (line ? ' ' : '') + words[i];
          const testWidth = doc.getTextWidth(testLine);
          
          if (testWidth <= textWidth) {
            line = testLine;
          } else {
            // Add the line
            doc.text(line, margin, y);
            y += lineHeight;
            line = words[i];
            
            // Check if we need a new page
            if (y > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }
          }
        }
        
        // Add the last line
        if (line) {
          doc.text(line, margin, y);
          y += lineHeight;
        }
        
        // Add empty line between segments
        y += 5;
        
        // Check if we need a new page for the next segment
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      });
      
      // Save the PDF
      doc.save(`${filename}-plaintext.pdf`);
      console.log(`Plain text PDF created successfully: ${filename}-plaintext.pdf`);
      
    } catch (error) {
      console.error("Error generating plain text PDF:", error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

