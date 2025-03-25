import { jsPDF } from "jspdf";

const doc = new jsPDF({});

/**
 * Saves the content of the textarea as a PDF
 */
export function extracAsPdf(document: DocumentManager): void {
  

  if (!textarea) {
    console.error(`Textarea with ID "${textareaId}" not found.`);
    alert("Textarea not found!");
    return;
  }

  const textContent = textarea.value.trim();
  if (!textContent) {
    alert("There is no text to save. Please make sure the text area has content.");
    return;
  }

  try {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set initial position
    let yPosition = 20;
    const xPosition = 20;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;

    // Set font size and type
    doc.setFontSize(12);

    // Get URL parameter for filename
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file') || 'document';

    // Split text into lines
    const textLines = doc.splitTextToSize(textContent, doc.internal.pageSize.width - 40);

    // Add each line to the PDF
    textLines.forEach((line: string | string[]) => {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(line, xPosition, yPosition);
      yPosition += lineHeight;
    });

    // Save the PDF
    doc.save(`${fileParam}-output.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}

