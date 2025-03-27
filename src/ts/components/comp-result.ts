import { DocumentManager } from "../services/document-manager";
import { transcribeFile } from "../services/filehandler";
import { extracAsPdf } from "../utils/export/pdf-export";

// componets for result page
document.addEventListener("DOMContentLoaded", async () => {
    // DOM elements
    const elements = {
      textArea: document.getElementById("jsonOutput") as HTMLButtonElement,
      comfirmBtn: document.getElementById("comfrimBtn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancelBtn") as HTMLInputElement,
      exportBtn: document.getElementById("exportBtn") as HTMLElement
    };

    let documentInstance: DocumentManager | null = null;
    
    // Intializes Document manager
    const initializeDocument = async (): Promise<void> => {
        const params = new URLSearchParams(window.location.search);
        const filename = params.get("file");

        if (filename) {
            try {
                const documentJson = await transcribeFile(filename);
                documentInstance = new DocumentManager(documentJson);
                elements.textArea.value = documentInstance.getAllTextString();
                console.log("DocumentManager instance created on page load:", documentInstance);
            } catch (error) {
                console.error("Transcription failed:", error);
            }
        } else {
            console.error("Filename is missing in the URL.");
        }
    };

    await initializeDocument();

    

    const handleExportClick = async (): Promise<void> => {
        if(documentInstance)
        extracAsPdf(documentInstance.getAllTextString());
    }

    elements.exportBtn.addEventListener("click",handleExportClick);
});