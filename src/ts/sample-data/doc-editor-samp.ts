import { LineSegment } from "../types/line-segment.js";
import { MockDocumentManager } from "./mock-document-manager.js";
import { DocumentLineEditor } from "../components/document-editor/document-editor.js";

document.addEventListener('DOMContentLoaded', () => {
    // Add this in your HTML:
    // <div id="editor-container" data-width="1200px" data-height="400px"></div>
    
    // Sample data with many lines to demonstrate scrolling
    const lineSegments: LineSegment[] = [
        {
            originalIndex: 0, edited: false, textContent: "First line of text", editedContent: "First line of text", confidence: 98,
            bbox: {
                xmin: 50,
                ymin: 100,
                xmax: 350,
                ymax: 120
            },
            polygon: {
                points: [{ x: 50, y: 100 }, { x: 350, y: 100 }, { x: 350, y: 120 }, { x: 50, y: 120 }]
            }
        },
        {
            originalIndex: 1, edited: false, textContent: "Second line of text", editedContent: "Second line of text", confidence: 85,
            bbox: {
                xmin: 60,
                ymin: 140,
                xmax: 360,
                ymax: 160
            },
            polygon: {
                points: [{ x: 60, y: 140 }, { x: 360, y: 140 }, { x: 360, y: 160 }, { x: 60, y: 160 }]
            }
        },
        {
            originalIndex: 2, edited: false, textContent: "This is a longer line of text that will demonstrate how the text area expands when it has more content. The user can click on this line to see how it expands to fit all the text content. When expanded, this line will take up more vertical space.", editedContent: "This is a longer line of text that will demonstrate how the text area expands when it has more content. The user can click on this line to see how it expands to fit all the text content. When expanded, this line will take up more vertical space.", confidence: 75,
            bbox: {
                xmin: 70,
                ymin: 180,
                xmax: 600,
                ymax: 240
            },
            polygon: {
                points: [{ x: 70, y: 180 }, { x: 600, y: 180 }, { x: 600, y: 240 }, { x: 70, y: 240 }]
            }
        },
        {
            originalIndex: 3, edited: false, textContent: "Fourth line of text", editedContent: "Fourth line of text", confidence: 92,
            bbox: {
                xmin: 80,
                ymin: 260,
                xmax: 380,
                ymax: 280
            },
            polygon: {
                points: [{ x: 80, y: 260 }, { x: 380, y: 260 }, { x: 380, y: 280 }, { x: 80, y: 280 }]
            }
        },
        {
            originalIndex: 4, edited: false, textContent: "Fifth line of text", editedContent: "Fifth line of text", confidence: 65,
            bbox: {
                xmin: 90,
                ymin: 300,
                xmax: 370,
                ymax: 320
            },
            polygon: {
                points: [{ x: 90, y: 300 }, { x: 370, y: 300 }, { x: 370, y: 320 }, { x: 90, y: 320 }]
            }
        },
        {
            originalIndex: 5, edited: false, textContent: "Another example of a longer paragraph that should expand when clicked. This demonstrates how the component handles multiline text entries gracefully. The line numbers and confidence scores should stay aligned with the beginning of each paragraph.", editedContent: "Another example of a longer paragraph that should expand when clicked. This demonstrates how the component handles multiline text entries gracefully. The line numbers and confidence scores should stay aligned with the beginning of each paragraph.", confidence: 45,
            bbox: {
                xmin: 100,
                ymin: 340,
                xmax: 650,
                ymax: 400
            },
            polygon: {
                points: [{ x: 100, y: 340 }, { x: 650, y: 340 }, { x: 650, y: 400 }, { x: 100, y: 400 }]
            }
        }
    ];
    
    
    // Create the editor
    const documentManager = new MockDocumentManager();
    documentManager.setAllLineSegments(lineSegments);
    const editor = new DocumentLineEditor( 'default-editor',documentManager);
    
    // Example of subscribing to the save event
    document.getElementById('editor-container')?.addEventListener('editor-save', (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Save event received:', customEvent.detail.lineSegments);
      // Send data to your backend or process it as needed
    });
  });