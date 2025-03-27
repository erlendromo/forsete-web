import { DocumentManager } from '../services/document-manager.js';
import { getData } from '../utils/json/jsonLoader.js';
import { generatePdfFromLineSegments } from '../utils/export/pdf-export.js';
import { DocumentLineEditor } from './document-editor.js';

// componets for result page
document.addEventListener("DOMContentLoaded", async () => {
    // DOM elements
    const elements = {
      textArea: document.getElementById("jsonOutput") as HTMLButtonElement,
      comfirmBtn: document.getElementById("comfrimBtn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancelBtn") as HTMLInputElement,
      exportBtn: document.getElementById("exportBtn") as HTMLElement,
    };

    let documentInstance: DocumentManager | null = null;
    
    // Intializes Document manager
    const initializeDocument = async (): Promise<void> => {
        const params = new URLSearchParams(window.location.search);
        const filename = params.get("file");

        if (filename) {
            try {
                documentInstance = new DocumentManager(await getData());
                const editor = new DocumentLineEditor('editor-container', documentInstance);
                console.log("DocumentManager instance created on page load:", documentInstance);
            } catch (error) {
                console.error("Transcription failed:", error);
            }
        } else {
            console.error("Filename is missing in the URL.");
        }
    };

    await initializeDocument();
    
    document.getElementById('editor-container')?.addEventListener('editor-save', (event: Event) => {
        const customEvent = event as CustomEvent;
        console.log('Save event received:', customEvent.detail.lineSegments);
    });

    // Example of subscribing to the save event
    document.getElementById('editor-container')?.addEventListener('editor-save', (event: Event) => {
        const customEvent = event as CustomEvent;
        console.log('Save event received:', customEvent.detail.lineSegments);
        // Send data to your backend or process it as needed
    });

    const handleExportClick = async (): Promise<void> => {
        if (documentInstance) {
            generatePdfFromLineSegments(
                documentInstance.getAllLineSegments(),
                612,  // Width
                792,  // Height
                'my-document',
                true  
            );
        }
    };

    elements.exportBtn.addEventListener("click", handleExportClick);
});