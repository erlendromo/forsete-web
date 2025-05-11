
import { DocumentManager } from '../../services/results/document-manager.js';
import { generatePlainTextPdf } from '../../utils/export/pdf-export.js';
import { DocumentLineEditor } from './document-editor/document-editor.js';
import { ImageContainer } from './document-editor/image-container.js';
import { initializeImageZoom } from './zoom-image.js';
import { ApiRoute } from '../../config/constants.js';

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
        const urlParams = new URLSearchParams(window.location.search);
        const imageIdParms = urlParams.get('file') || '';
        const transcribedDataRaw = localStorage.getItem('transcribedData')
        if (transcribedDataRaw) {
            try {
                const transcribedData = JSON.parse(transcribedDataRaw);
                if (!Array.isArray(transcribedData) || transcribedData.length === 0) {
                    throw new Error("transcribedData is empty or invalid");
                  }
                
                  const firstOutput = transcribedData[0]; // Get the first output object
                  const { image_id, id } = firstOutput;
                
                  if (!image_id || !id) {
                    throw new Error("Missing image_id or id in transcribedData");
                  }
                
                  const response = await fetch(ApiRoute.Outputs, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image_id, id })
                  });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const data = await response.json();
                // Get data and create document manager
                documentInstance = new DocumentManager( data, image_id);
                
                
                
                // Use the Image ID from the document instance
                
                imageContainerInstance = new ImageContainer(
                    'image-container',
                    imageIdParms,
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
            const filename = documentInstance.getImageId();
                           
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