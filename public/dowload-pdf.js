const { jsPDF } = window.jspdf;

document.addEventListener("DOMContentLoaded", function() {
    // Get the save button element
    const saveButton = document.getElementById("saveBtn");
    
    // Add click event listener to the button
    if (saveButton) {
      saveButton.addEventListener("click", saveTextAreaAsPdf);
    }
  });
  
  /**
   * Saves the content of the textarea as a PDF
   */
  function saveTextAreaAsPdf() {
    try {
      // Get the textarea content
      const textArea = document.getElementById('jsonOutput');
      const textContent = textArea.value;
      
      if (!textContent.trim()) {
        alert("There is no text to save. Please make sure the text area has content.");
        return;
      }
      
      // Create a new jsPDF instance
      // jsPDF is expected to be available as a global variable
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
      
      // Reset font size
      doc.setFontSize(12);
      
      // Split text into lines
      const textLines = doc.splitTextToSize(textContent, doc.internal.pageSize.width - 40);
      
      // Add each line to the PDF
      textLines.forEach(line => {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Add the line
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