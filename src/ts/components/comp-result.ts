import { DocumentManager } from '../services/document-manager.js';
import { getData } from '../utils/json/jsonLoader.js';
import { generatePdfFromLineSegments, generatePlainTextPdf } from '../utils/export/pdf-export.js';
import { DocumentLineEditor } from './document-editor/document-editor.js';
import {loadUploadedImage } from '../utils/image-loader.js';

// components for result page
document.addEventListener("DOMContentLoaded", async () => {
    // DOM elements
    const elements = {
     // confirmBtn: document.getElementById("confirmBtn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancelBtn") as HTMLInputElement,
      exportBtn: document.getElementById("exportBtn") as HTMLElement,
      dynamicImage: document.getElementById("dynamicImage") as HTMLImageElement,
    };

    let documentInstance: DocumentManager | null = null;
    let editor: DocumentLineEditor | null = null;
    
   
    
    // Initializes Document manager
    const initializeDocument = async (): Promise<void> => {
        const params = new URLSearchParams(window.location.search);
        const urlFilename = params.get("file");

        if (urlFilename) {
            try {
                // Get data and create document manager
                documentInstance = new DocumentManager(await getData(), urlFilename);
                
                // Create editor instance
                editor = new DocumentLineEditor('editor-container', documentInstance);
                
                // Use the filename from the document instance
                const docFilename = documentInstance.getImageFileName()
              
                
                 // Load the image directly using the filename from the URL parameter
                try {
                  await loadUploadedImage(urlFilename, 'dynamicImage');
                  console.log(`Image for ${urlFilename} loaded successfully`);
                } catch (imageError) {
                  console.error('Failed to load document image:', imageError);
                  }
              
                
                console.log("DocumentManager and editor initialized successfully");
            } catch (error) {
                console.error("Transcription failed:", error);
            }
        } else {
            console.error("Filename is missing in the URL.");
        }
    };

    await initializeDocument();
    
    // Handle editor save events
    document.getElementById('editor-container')?.addEventListener('editor-save', (event: Event) => {
        const customEvent = event as CustomEvent;
        console.log('Save event received:', customEvent.detail.lineSegments);
        // Send data to your backend or process it as needed
    });

    // Handle export functionality
    const handleExportClick = async (): Promise<void> => {
        if (documentInstance) {
            // Use the filename from the document instance for export
            const filename = documentInstance.getImageFileName();
                           
            generatePlainTextPdf(
                documentInstance.getAllLineSegments(),
                612,  // Width
                792,  // Height
                filename,
                false  
            );
        }
    };

    // Setup event listeners
    elements.exportBtn.addEventListener("click", handleExportClick);
    
    // Handle confirmation button
   /* elements.confirmBtn?.addEventListener("click", () => {
        // Add your confirmation logic here
        console.log("Confirmed changes");
        // For example, send the edited data to your backend
        if (documentInstance) {
            console.log("Current data:", documentInstance.getAllLineSegments());
        }
    });*/
    
    // Handle cancel button
    elements.cancelBtn?.addEventListener("click", () => {
        // Add your cancel logic here
        console.log("Cancelled changes");
        // For example, redirect back to previous page
        window.history.back();
    });
});