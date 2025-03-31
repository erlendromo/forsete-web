
import { LineSegment } from "../../types/line-segment.js";
import { DocumentManager } from "../../services/document-manager.js";
import { LineEditorItem } from "./line-editor.js";


export class DocumentLineEditor {
  private container: HTMLElement;
  private lineItems: LineEditorItem[] = [];
  private documentManager: DocumentManager;
  private editorContentEl: HTMLElement;
  private revertAllBtn: HTMLButtonElement;
  //private saveBtn: HTMLButtonElement;
  private imageElement: HTMLImageElement;
  
  constructor(containerId: string, documentManager: DocumentManager, imageFileName?: string) {
    // Get container element
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    
    // Store line segments data
    this.documentManager = documentManager;
    
    // Create editor structure
    this.createEditorStructure();
    
    // Initialize UI elements
    this.editorContentEl = document.getElementById(`${containerId}-editor-content`) as HTMLElement;
    this.revertAllBtn = document.getElementById(`${containerId}-revert-all`) as HTMLButtonElement;
    //this.saveBtn = document.getElementById(`${containerId}-save`) as HTMLButtonElement;
    this.imageElement = document.getElementById('dynamicImage') as HTMLImageElement;
    
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
          <span>Document Text Editor</span>
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

    // Add styles dynamically if not already present
    if (!document.getElementById('line-editor-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'line-editor-styles';
      styleEl.textContent = this.getEditorStyles();
      document.head.appendChild(styleEl);
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
  
 
private getEditorStyles(): string {
  return `
    /* Base styling */
    /* Container for the entire editor */
    .editor-container {
      width: 100%;            /* Take full width of parent */
      max-width: none;        /* Remove max-width limitation */
      margin: 0;              /* Remove auto margins */
      padding: 20px;
      border: 1px solid #333;
      background: #2d3142;    /* Slightly lighter than the bg-gray-900 */
      border-radius: 8px;     /* Slight rounding for a modern look */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      height: 100%;          /* Take full height of parent */
    }

    /* Header with title and buttons */
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #444;
      font-size: 18px;
      font-weight: bold;
      color: white;
      flex-shrink: 0;        /* Prevent header from shrinking */
    }

    /* Content section where text lines will be displayed */
    .editor-content {
      display: flex;
      flex-direction: column;
      gap: 12px;             /* Spacing between lines */
      width: 100%;           /* Ensure full width */
      padding-top: 10px;
      overflow-y: auto;      /* Enable vertical scrolling */
      flex: 1;               /* Take remaining height */
    }

    /* Style for buttons (Save & Revert) */
    .revert-btn, .save-btn {
      padding: 10px 18px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
      transition: background 0.2s ease-in-out;
    }

    /* Revert Button - Red */
    .revert-btn {
      background: #f44336;
      color: white;
    }
    .revert-btn:hover {
      background: #d32f2f;
    }
    .revert-btn:disabled {
      background: #666;
      cursor: not-allowed;
    }

    /* Save Button - Green */
    .save-btn {
      background: #4CAF50;
      color: white;
    }
    .save-btn:hover {
      background: #388E3C;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .editor-container {
        width: 100%;  /* Full width on small screens */
        padding: 15px;
      }
      .editor-header {
        font-size: 16px;
      }
      .revert-btn, .save-btn {
        font-size: 14px;
        padding: 8px 14px;
      }
    }
    
    /* Editor line item - FIXED: Added display: flex */
    .editor-line-item {
      display: flex;
      width: 100%;
      min-height: 36px;
      border-radius: 4px;
      overflow: hidden;
      background-color: #3a404f;
      margin-bottom: 8px;
    }
    
    /* Expanded line item */
    .editor-line-item.expanded {
      height: auto;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      background-color: #3a404f;
    }
    
    /* Line number container */
    .line-number-container {
      display: flex;
      align-items: center;
      background-color: #223a4a;
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
      color: #dbc9c9;
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
      resize: none;
      background-color: transparent;
      font-family: Monaco, Menlo, "Courier New", monospace;
      font-size: 14px;
      transition: min-height 0.2s ease;
      color: white;
    }
    
    .editor-line-item.expanded .editor-textarea {
      min-height: 60px;
    }
    
    .editor-textarea:focus {
      outline: none;
    }
    
    .edited {
      background-color: #304a66;
    }
    
    /* Reset button container */
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      background-color: #223a4a;
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
}}