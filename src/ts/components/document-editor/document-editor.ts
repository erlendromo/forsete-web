import { LineSegment } from "../../types/line-segment.js";
import { DocumentManager } from "../../services/document-manager.js";
import { LineEditorItem } from "./line-editor.js";

export class DocumentLineEditor {
  private container: HTMLElement;
  private lineItems: LineEditorItem[] = [];
  private documentManager: DocumentManager;
  private editorContentEl: HTMLElement;
  private revertAllBtn: HTMLButtonElement;
  private saveBtn: HTMLButtonElement;
  
  constructor(containerId: string, documentManager: DocumentManager) {
    // Get container element
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    
    // Store line segments data
    this.documentManager = documentManager; // Clone the array to avoid modifying the original
    
    // Create editor structure
    this.createEditorStructure();
    
    // Initialize UI elements
    this.editorContentEl = document.getElementById(`${containerId}-editor-content`) as HTMLElement;
    this.revertAllBtn = document.getElementById(`${containerId}-revert-all`) as HTMLButtonElement;
    this.saveBtn = document.getElementById(`${containerId}-save`) as HTMLButtonElement;
    
    // Add event listeners
    this.revertAllBtn.addEventListener('click', this.handleRevertAll.bind(this));
    this.saveBtn.addEventListener('click', this.handleSave.bind(this));
    
    // Create line items
    this.createLineItems();
    
    // Update revert button state
    this.updateRevertButtonState();
  }
  
  private createEditorStructure(): void {
    // Create editor HTML structure
    this.container.innerHTML = `
      <div class="editor-container">
        <div class="editor-header">
          <span>Document Text Editor</span>
          <div>
            <button id="${this.container.id}-revert-all" class="revert-btn">Revert All Changes</button>
            <button id="${this.container.id}-save" class="save-btn">Save Changes</button>
          </div>
        </div>
        
        <div class="editor-content" id="${this.container.id}-editor-content">
          <!-- Line items will be inserted here -->
        </div>
      </div>
    `;
    
    // Set a fixed height or make it responsive based on container size
    const containerHeight = this.container.getAttribute('data-height');
    if (containerHeight) {
      const editorContainer = this.container.querySelector('.editor-container') as HTMLElement;
      if (editorContainer) {
        editorContainer.style.maxHeight = containerHeight;
      }
    }
    
    // Add CSS styles if not already present
    if (!document.getElementById('line-editor-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'line-editor-styles';
      styleEl.textContent = this.getEditorStyles();
      document.head.appendChild(styleEl);
    }
  }
  
  private createLineItems(): void {
    // Clear the editor content
    this.editorContentEl.innerHTML = '';
    this.lineItems = [];
    
    // Create a line item for each segment
    this.documentManager.getAllLineSegments().forEach((segment, index) => {
      const lineItem = new LineEditorItem(segment, this.handleLineChange.bind(this));
      this.lineItems.push(lineItem);
      this.editorContentEl.appendChild(lineItem.getElement());
    });
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
  
  private handleSave(): void {
    // Example: Output the current state to console
    console.log('Saving changes:', this.documentManager.getAllLineSegments());
    
    // Implement your own save logic here
    // For example, send the data to a server or update a parent component
    
    // You could also emit a custom event
    const saveEvent = new CustomEvent('editor-save', {
      detail: { lineSegments: this.documentManager.getAllLineSegments() },
    });
    this.container.dispatchEvent(saveEvent);
  }
  
  // Get current line segments data
  public getLineSegments(): LineSegment[] {
    return [...this.documentManager.getAllLineSegments()]; // Return a copy to prevent direct modification
  }
  
  // Update line segments data
  public updateLineSegments(newLineSegments: LineSegment[]): void {
    this.documentManager.setAllLineSegments(newLineSegments);
    
    // Update existing line items if they exist
    if (this.lineItems.length === this.documentManager.getAllLineSegments.length) {
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
  
  // CSS styles for the editor
  private getEditorStyles(): string {
    return `
      /* Base styling */
      .editor-container {
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        max-height: 500px; /* Adjust this height as needed */
      }
      
      /* Editor header */
      .editor-header {
        background-color: #2d3748;
        color: white;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      }
      
      .editor-header button {
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        color: white;
      }
      
      .revert-btn {
        background-color: #e53e3e;
        margin-right: 8px;
      }
      
      .revert-btn:disabled {
        background-color: #9b2c2c;
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .save-btn {
        background-color: #38a169;
      }
      
      /* Editor content */
      .editor-content {
        font-size: 14px;
        font-family: Monaco, Menlo, "Courier New", monospace;
        overflow-y: auto;
        flex: 1;
      }
      
      
      
      /* Expanded line item */
      .editor-line-item.expanded {
        height: auto;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background-color: white;
      }
      
      /* Line number container */
      .line-number-container {
        display: flex;
        align-items: center;
        background-color:rgb(34, 58, 74);
        width: 100px;
        flex-shrink: 0;
        padding-left: 4px;
        height: 100%;
      }
      
      .editor-line-item.expanded .line-number-container {
        align-items: flex-start;
        padding-top: 4px;
      }
      
      .line-number {
        width: 40px;
        text-align: right;
        padding-right: 8px;
        color:rgb(219, 201, 201);
      }
      
      .confidence-score {
        font-size: 11px;
        padding: 2px 4px;
        border-radius: 4px;
        margin-left: 4px;
      }
      
      .confidence-high {
        background-color: #c6f6d5;
        color: #22543d;
      }
      
      .confidence-good {
        background-color: #bee3f8;
        color: #2c5282;
      }
      
      .confidence-medium {
        background-color: #fefcbf;
        color: #744210;
      }
      
      .confidence-low {
        background-color: #fed7d7;
        color: #822727;
      }
      
      /* Text container */
      .editor-text-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
      }
      
      .editor-line-item.expanded .editor-text-container {
        align-items: flex-start;
      }
      
      .editor-textarea {
        width: 100%;
        height: 100%;
        padding: 4px 8px;
        border: none;
        font-family: Monaco, Menlo, "Courier New", monospace;
        font-size: 14px;
        resize: none;
        box-sizing: border-box;
        overflow: hidden;
        background-color: transparent;
        transition: min-height 0.2s ease;
      }
      
      .editor-line-item.expanded .editor-textarea {
        min-height: 60px;
      }
      
      .editor-textarea:focus {
        outline: none;
      }
      
      .edited {
        background-color:rgb(48, 74, 102);
      }
      
      /* Reset button container */
      .reset-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        background-color:rgb(34, 58, 74);
        flex-shrink: 0;
        height: 100%;
      }
      
      .editor-line-item.expanded .reset-container {
        align-items: flex-start;
        padding-top: 4px;
      }
      
      .reset-btn {
        background: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
      }
      
      .reset-active {
        color: #e53e3e;
      }
      
      .reset-inactive {
        color: #cbd5e0;
      }
      
      .reset-btn:disabled {
        cursor: default;
      }
    `;
  }
}