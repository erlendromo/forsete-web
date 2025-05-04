import { DocumentManager } from '../../services/results/document-manager.js';
import { getData } from '../../util/json/jsonLoader.js';
import { generatePlainTextPdf } from '../../util/export/pdf-export.js';
import { DocumentLineEditor } from './document-editor/document-editor.js';
import { ImageContainer } from './document-editor/image-container.js';
import { initializeImageZoom } from './zoom-image.js';

// components for result page
document.addEventListener("DOMContentLoaded", async () => {
    // DOM elements
    const elements = {
     // confirmBtn: document.getElementById("confirmBtn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancelBtn") as HTMLInputElement,
      exportBtn: document.getElementById("exportBtn") as HTMLElement,
      imageContainer: document.getElementById("image-container") as HTMLElement,
    };

    let documentInstance: DocumentManager | null = null;
    let editor: DocumentLineEditor | null = null;
    let imageContainerInstance: ImageContainer | null = null;
   
    
    // Initializes Document manager
    const initializeDocument = async (): Promise<void> => {
        const params = new URLSearchParams(window.location.search);
        const urlFilename = params.get("file");

        if (urlFilename) {
            try {
                // Get data and create document manager
                documentInstance = new DocumentManager(await getData(), urlFilename);
                
                
                
                // Use the filename from the document instance
                const docFilename = documentInstance.getImageFileName()
                imageContainerInstance = new ImageContainer(
                    'image-container',
                    docFilename,
                    (polygon) => {
                        console.log("Polygon changed:", polygon);
                    }
                );
                imageContainerInstance.setAllPolygons(documentInstance.getAllLineSegments().map(segment => segment.polygon));
                initializeImageZoom('image-container')
                // Create editor instance
                editor = new DocumentLineEditor('editor-container', documentInstance, imageContainerInstance);
                
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