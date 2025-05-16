
import { DocumentManager } from '../../services/results/document-manager.js';
import { DocumentLineEditor } from './document-editor/document-editor.js';
import { ImageContainer } from './document-editor/image-container.js';
import { initializeImageZoom } from './zoom-image.js';
import { ApiRoute } from '../../config/constants.js';
import { createSuccessAlert } from '../utils/ui/alert.js';


// components for result page
document.addEventListener("DOMContentLoaded", async () => {
    // DOM elements
    const elements = {
        alertContainer: document.getElementById("alert-container") as HTMLAreaElement,
        confirmBtn: document.getElementById("confirmBtn") as HTMLButtonElement,
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
        const transcribedDataRaw = localStorage.getItem('transcribedData') || '';

        if (imageIdParms) {
            try {
                let image_id: string, id: string, name: string;

                if (transcribedDataRaw) {

                    const transcribedData = JSON.parse(transcribedDataRaw);
                    if (!Array.isArray(transcribedData) || transcribedData.length === 0) {
                        throw new Error("transcribedData is empty or invalid");
                    }

                    const firstOutput = transcribedData[0];
                    ({ image_id, id, name } = firstOutput);

                    if (!image_id || !id) {
                        throw new Error("Missing image_id or id in transcribedData");
                    }
                }
                else {
                    const response = await fetch(ApiRoute.Outputs, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ image_id: imageIdParms })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch data: ${response.statusText}`);
                    }

                    const data = await response.json();
                    const firstOutput = data;
                    ({ image_id, id, name } = firstOutput);
                    if (!image_id || !id) {
                        throw new Error("Missing image_id or id in fetched data");
                    }
                }

                // Try to get cached output data
                const cacheKey = `outputData_${image_id}_${id}`;
                const cachedOutput = localStorage.getItem(cacheKey);
                let data;

                if (cachedOutput) {
                    data = JSON.parse(cachedOutput);
                    console.log("Using cached data.");
                } else {
                    const response = await fetch(ApiRoute.OutputData, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ image_id, id })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch data: ${response.statusText}`);
                    }

                    data = await response.json();
                    console.log("Fetched new data:", data);
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    console.log("Fetched and cached new data.");
                }


                // Initialize components
                documentInstance = new DocumentManager(data, image_id, id, name);
                imageContainerInstance = new ImageContainer(
                    'image-container',
                    imageIdParms,
                    (polygon) => {
                        console.log("Polygon changed:", polygon);
                    }
                );

                imageContainerInstance.setAllPolygons(
                    documentInstance.getAllLineSegments().map(segment => segment.polygon)
                );

                initializeImageZoom('image-container');

                editor = new DocumentLineEditor('editor-container', documentInstance, imageContainerInstance);

                console.log("DocumentManager and editor initialized successfully");
            } catch (error) {
                console.error("Transcription failed:", error);
            }
        } else {
            console.error("Filename is missing in the URL.");
        }
        localStorage.removeItem('transcribedData');
    };


    await initializeDocument();

    // Handle editor save events
    document.getElementById('editor-container')?.addEventListener('editor-save', (event: Event) => {
        const customEvent = event as CustomEvent;
        console.log('Save event received:', customEvent.detail.lineSegments);
        // Send data to your backend or process it as needed
    });

    const handleExportClick = async (): Promise<void> => {
        if (!documentInstance) return;

        const formatSelect = document.getElementById('exportFormat') as HTMLSelectElement;
        const selectedFormat = formatSelect?.value || 'txt';

        try {
            const response = await fetch(ApiRoute.Export, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lineSegments: documentInstance.getAllLineSegments(),
                    filename: documentInstance.getFileName(),
                    format: selectedFormat
                })
            });

            if (!response.ok) {
                console.error('Export failed:', response.statusText);
                return;
            }

            // Get the filename from Content-Disposition header
            const disposition = response.headers.get('Content-Disposition');
            let filename = `export.${selectedFormat}`;
            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            // Convert the response into a Blob
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Trigger file download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Cleanup
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Export error:', err);
        }
    };


    // Setup event listeners
    elements.exportBtn.addEventListener("click", handleExportClick);


    const handleConfirmClick = async (): Promise<void> => {
        if (!documentInstance) return;

        try {

            const response = await fetch(ApiRoute.Save, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageId: documentInstance.getImageId(),
                    outputId: documentInstance.getOutputId(),
                    saveData: documentInstance.confirmedATRResult()
                })
            });

            if (response.ok) {
                const cacheKey = `outputData_${documentInstance.getImageId()}_${documentInstance.getOutputId()}`;
                localStorage.removeItem(cacheKey);
                console.log("Data saved successfully.");
                elements.alertContainer.innerHTML = createSuccessAlert("File is successfully confirmed!")
                document.getElementById("close-alert-button")?.addEventListener("click", () => {
                    elements.alertContainer.innerHTML = "";
                });
            }
            else {
                const errorData = await response.json();
                console.error("Error saving data:", errorData);
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
    };

    elements.confirmBtn?.addEventListener("click", handleConfirmClick);

    // Handle cancel button
    elements.cancelBtn?.addEventListener("click", () => {
        // Add your cancel logic here
        console.log("Cancelled changes");
        // For example, redirect back to previous page
        window.history.back();
    });
});