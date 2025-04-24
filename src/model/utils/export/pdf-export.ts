import { LineSegment } from '../../../interfaces/line-segment';


declare global {
  interface Window {
    jspdf: {
      jsPDF: any;
    };
  }
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

