import { LineSegment } from '../../types/line-segment';

declare global {
  interface Window {
    jspdf: {
      jsPDF: any;
    };
  }
}
/**
 * Saves the content of the textarea as a PDF
 */
export function generatePdfFromLineSegments(
  lineSegments: LineSegment[], 
  pageWidth: number = 612, 
  pageHeight: number = 792,
  filename: string = 'document',
  showDebug: boolean = false
): void {
  try {
    // Determine if landscape orientation is needed
    const isLandscape = pageWidth > pageHeight;
    
    // Create a new jsPDF instance
    const doc = new window.jspdf.jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [pageWidth, pageHeight]
    });
    
    // Set default font
    doc.setFont('Helvetica', 'normal');
    
    // Draw debug visualization if requested
    if (showDebug) {
      drawDebugVisualization(doc, lineSegments);
    }
    
    // Add each text segment to the PDF
    lineSegments.forEach(segment => {
      // Use edited content if available, otherwise use original content
      const textContent = segment.edited && segment.editedContent ? 
        segment.editedContent : segment.textContent;
      
      // Skip empty text
      if (!textContent || textContent.trim() === '') {
        return;
      }
      
      // Use the bounding box for text positioning
      const bbox = segment.bbox;
      const width = bbox.xmax - bbox.xmin;
      const height = bbox.ymax - bbox.ymin;
      
      // Calculate font size based on the height of the bounding box
      // Using a smaller percentage to ensure text fits
      const fontSize = Math.max(Math.floor(height * 0.65), 6);
      doc.setFontSize(fontSize);
      
      // Set text color - use lighter color for low confidence if confidence is available
      if (segment.confidence !== undefined && segment.confidence < 0.7) {
        const confidenceColor = Math.round(40 + (segment.confidence * 100));
        doc.setTextColor(confidenceColor, confidenceColor, confidenceColor);
      } else {
        doc.setTextColor(0, 0, 0);
      }

      // Position text in the center of the bounding box
      const centerX = bbox.xmin + width / 2;
      const centerY = bbox.ymin + height * 0.6; // Position slightly above middle for better alignment
      
      // Check if text will fit within the width of the bounding box
      const textWidth = doc.getTextWidth(textContent);
      if (textWidth > width * 0.9) { // Allow a little margin
        // Text is too wide - scale it down using character spacing or smaller font
        const scaleFactor = (width * 0.9) / textWidth;
        
        // Option 1: Reduce font size further if needed
        const adjustedFontSize = Math.max(fontSize * scaleFactor, 5); // Min 5pt
        doc.setFontSize(adjustedFontSize);
        
        // Recheck if it fits
        const newTextWidth = doc.getTextWidth(textContent);
        if (newTextWidth > width * 0.9) {
          // Option 2: Break into multiple lines if still too wide
          const words = textContent.split(' ');
          if (words.length > 1) {
            let currentLine = words[0];
            let y = centerY - (height * 0.2); // Start higher to accommodate multiple lines
            
            for (let i = 1; i < words.length; i++) {
              const testLine = currentLine + ' ' + words[i];
              const testWidth = doc.getTextWidth(testLine);
              
              if (testWidth < width * 0.9) {
                currentLine = testLine;
              } else {
                // Draw the current line and start a new one
                doc.text(currentLine, centerX, y, { align: 'center' });
                y += fontSize * 0.8; // Line spacing
                currentLine = words[i];
                
                // Check if we're going outside the box
                if (y > bbox.ymax) {
                  break; // Stop if we're going outside the box
                }
              }
            }
            
            // Draw the last line
            if (y <= bbox.ymax) {
              doc.text(currentLine, centerX, y, { align: 'center' });
            }
          } else {
            // Single word that's too long - just center it
            doc.text(textContent, centerX, centerY, { align: 'center' });
          }
        } else {
          // Font size adjustment was enough
          doc.text(textContent, centerX, centerY, { align: 'center' });
        }
      } else {
        // Text fits fine, just center it
        doc.text(textContent, centerX, centerY, { align: 'center' });
      }
    });
    
    // Add visual indicator for edited text if any
    if (lineSegments.some(segment => segment.edited)) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("* Some text has been edited from the original", 20, pageHeight - 20);
    }
    
    // Save the PDF
    doc.save(`${filename}-output.pdf`);
    console.log(`PDF created successfully: ${filename}-output.pdf`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } else {
      throw new Error("Failed to generate PDF: An unknown error occurred.");
    }
  }
}

/**
 * Draw debug visualization showing bounding boxes and polygons
 */
function drawDebugVisualization(doc: any, lineSegments: LineSegment[]): void {
  lineSegments.forEach(segment => {
    const bbox = segment.bbox;
    const points = segment.polygon.points;
    const width = bbox.xmax - bbox.xmin;
    const height = bbox.ymax - bbox.ymin;
    
    // Draw rectangle for bounding box
    doc.setDrawColor(200, 0, 0); // Red
    doc.setLineWidth(0.5);
    doc.rect(bbox.xmin, bbox.ymin, width, height);
    
    // Draw polygon outline
    if (points && points.length > 0) {
      doc.setDrawColor(0, 100, 200); // Blue
      doc.setLineWidth(0.3);
      
      // Draw lines between points
      for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length; // Wrap around to first point
        doc.line(
          points[i].x, 
          points[i].y, 
          points[next].x, 
          points[next].y
        );
      }
      
      // Indicate if segment has been edited
      if (segment.edited) {
        doc.setFontSize(8);
        doc.setTextColor(200, 0, 0);
        doc.text("*", bbox.xmin - 8, bbox.ymin + height/2);
      }
    }
  });
}

/**
 * Analyze a polygon to extract useful metrics - kept for reference but not used directly
 */
function analyzePolygon(points: Array<{x: number, y: number}>) {
  // Find min/max coordinates
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  
  // Calculate center point
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // Estimate width and height
  const width = maxX - minX;
  const height = maxY - minY;
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX,
    centerY,
    width,
    height
  };
}