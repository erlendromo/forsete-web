
import { LineSegment } from "../../../ts/types/line-segment.js";
import { DocumentManager } from "../../../ts/services/document-manager.js";
import { LineEditorItem } from "./line-editor.js";
import { ImageContainer } from "./image-container.js";


export class DocumentLineEditor {
  private container: HTMLElement;
  private lineItems: LineEditorItem[] = [];
  private documentManager: DocumentManager;
  private editorContentEl: HTMLElement;
  private revertAllBtn: HTMLButtonElement;
  //private saveBtn: HTMLButtonElement;
  private selectedLineIndex: number = -1;
  private imageContainer: ImageContainer | null;
  
  constructor(containerId: string, documentManager: DocumentManager,  imageContainer?: ImageContainer) {
    // Get container element
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    this.imageContainer = imageContainer || null;
    // Store line segments data
    this.documentManager = documentManager;
    
    // Create editor structure
    this.createEditorStructure();
    
    // Initialize UI elements
    this.editorContentEl = document.getElementById(`${containerId}-editor-content`) as HTMLElement;
    this.revertAllBtn = document.getElementById(`${containerId}-revert-all`) as HTMLButtonElement;
    //this.saveBtn = document.getElementById(`${containerId}-save`) as HTMLButtonElement;
    
    // Add event listeners
    this.revertAllBtn.addEventListener('click', this.handleRevertAll.bind(this));
    //this.saveBtn.addEventListener('click', this.handleSave.bind(this));
    
    // Create line items
    this.createLineItems();
    
    // Update revert button state
    this.updateRevertButtonState();
  }
  
  private createEditorStructure(): void {
    this.container.innerHTML = `
      <div class="editor-container">
        <div class="editor-header">
          <span>Document Editor</span>
          <div>
            <button id="${this.container.id}-revert-all" class="revert-btn">Revert All Changes</button>
           <!-- <button id="${this.container.id}-save" class="save-btn">Save Changes</button> -->
          </div>
        </div>
        
        <div class="editor-content" id="${this.container.id}-editor-content">
          <!-- Line items will be inserted here -->
        </div>
      </div>
    `;


  }
  
  private createLineItems(): void {
    // Clear the editor content
    this.editorContentEl.innerHTML = '';
    this.lineItems = [];
    
    // Create a line item for each segment with focus handler
    this.documentManager.getAllLineSegments().forEach((segment, index) => {
        const lineItem = new LineEditorItem(
            segment, 
            this.handleLineChange.bind(this),
            // Focus handler for highlighting
            (focusedSegment) => {
                if (this.imageContainer) {
                    // Tell the image container which line's polygon to highlight
                    this.imageContainer.highlightLinePolygon(focusedSegment);
                }
            }
        );
        this.lineItems.push(lineItem);
        this.editorContentEl.appendChild(lineItem.getElement());
    });
}

// Method to set the image container after initialization
public setImageContainer(imageContainer: ImageContainer): void {
  this.imageContainer = imageContainer;
}

  private handleLineChange(updatedSegment: LineSegment): void {
    // Update the line segment in our array
    this.documentManager.setLineSegment(updatedSegment);
    
    // Update revert button state
    this.updateRevertButtonState();
  }
  
  private updateRevertButtonState(): void {
    // Check if any lines are edited
    const hasEditedLines = this.documentManager.getAllLineSegments().some(segment => segment.edited);
    this.revertAllBtn.disabled = !hasEditedLines;
  }
  
  private handleRevertAll(): void {
    // Reset all line segments
    this.documentManager.getAllLineSegments().forEach(segment => {
      segment.editedContent = segment.textContent;
      segment.edited = false;
    });
    
    // Update all line items
    this.lineItems.forEach((lineItem, index) => {
      return lineItem.updateSegment(this.documentManager.getLineSegment(index));
    });
    
    // Update revert button state
    this.updateRevertButtonState();
  }

  
  // Get current line segments data
  public getLineSegments(): LineSegment[] {
    return [...this.documentManager.getAllLineSegments()]; // Return a copy to prevent direct modification
  }
  
  // Update line segments data
  public updateLineSegments(newLineSegments: LineSegment[]): void {
    this.documentManager.setAllLineSegments(newLineSegments);
    
    // Update existing line items if they exist
    if (this.lineItems.length === this.documentManager.getAllLineSegments().length) {
      this.lineItems.forEach((lineItem, index) => {
        lineItem.updateSegment(this.documentManager.getLineSegment(index));
      });
    } else {
      // If the number of lines changed, recreate all line items
      this.createLineItems();
    }
    
    // Update revert button state
    this.updateRevertButtonState();
  }
  
 
}