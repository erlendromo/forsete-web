
import { LineSegment } from "../../../interfaces/lineSegment.types.js";
import { DocumentManager } from "../../../services/results/document-manager.js";
import { LineEditorItem } from "./lineEditor.js";
import { ImageContainer } from "./imageContainer.js";


/**
 * A class that manages the editing of document lines in a web interface.
 * 
 * @class DocumentLineEditor
 * 
 * @property {HTMLElement} container - The main container element for the editor
 * @property {LineEditorItem[]} lineItems - Array of line editor items
 * @property {LineEditorItem | null} currentlyFocusedLine - Currently focused line in the editor
 * @property {DocumentManager} documentManager - Manager for document-related operations
 * @property {HTMLElement} editorContentEl - Container element for editor content
 * @property {HTMLButtonElement} revertAllBtn - Button to revert all changes
 * @property {ImageContainer | null} imageContainer - Optional container for image-related operations
 * 
 * @description
 * The DocumentLineEditor provides functionality to:
 * - Edit individual lines of text
 * - Revert changes made to the document
 * - Save changes to localStorage
 * - Highlight corresponding line polygons in an associated image
 * - Manage the state of edited lines
 * 
 * The editor maintains synchronization between the visual representation and the underlying data model,
 * and provides persistence through localStorage.
 * 
 */
export class DocumentLineEditor {
  private container: HTMLElement;
  private lineItems: LineEditorItem[] = [];
  private currentlyFocusedLine: LineEditorItem | null = null;
  private documentManager: DocumentManager;
  private editorContentEl: HTMLElement;
  private revertAllBtn: HTMLButtonElement;
  //private saveBtn: HTMLButtonElement;

  private imageContainer: ImageContainer | null;
  
  constructor(containerId: string, documentManager: DocumentManager,  imageContainer?: ImageContainer) {
    // Get container element
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    this.imageContainer = imageContainer || null;

    this.documentManager = documentManager;

    // Load saved segments if available
    const savedSegments = this.loadFromLocalStorage();
    if (savedSegments) {
      this.documentManager.setAllLineSegments(savedSegments);
    }

    // Create editor structure
    this.createEditorStructure();
    
    // Initialize UI elements
    this.editorContentEl = document.getElementById(`${containerId}-editor-content`) as HTMLElement;
    this.revertAllBtn = document.getElementById(`${containerId}-revert-all`) as HTMLButtonElement;
    
    // Add event listeners
    this.revertAllBtn.addEventListener('click', this.handleRevertAll.bind(this));
    
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

  const segments = this.documentManager.getAllLineSegments();

  if (!segments || segments.length === 0) {
    this.editorContentEl.innerHTML = `
      <div class="empty-message">No lines found!.</div>
    `;
    return;
  }

  segments.forEach((segment, index) => {
    const lineItem = new LineEditorItem(
      segment,
      this.handleLineChange.bind(this),
      (focusedSegment) => {
        if (this.imageContainer) {
          this.imageContainer.highlightLinePolygon(focusedSegment);
        }

        const newlyFocusedItem = this.lineItems.find(item =>
          item.getSegment().originalIndex === focusedSegment.originalIndex
        );

        if (newlyFocusedItem !== this.currentlyFocusedLine) {
          if (this.currentlyFocusedLine) {
            this.currentlyFocusedLine.setSelected(false);
          }
          if (newlyFocusedItem) {
            newlyFocusedItem.setSelected(true);
            this.currentlyFocusedLine = newlyFocusedItem;
          }
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
  this.documentManager.setLineSegment(updatedSegment);
  this.saveToLocalStorage(); 
  this.updateRevertButtonState();
  }
  private updateRevertButtonState(): void {
    // Check if any lines are edited
    const hasEditedLines = this.documentManager.getAllLineSegments().some(segment => segment.edited);
    this.revertAllBtn.disabled = !hasEditedLines;
  }
  
  private handleRevertAll(): void {
    this.documentManager.getAllLineSegments().forEach(segment => {
      segment.editedContent = segment.textContent;
      segment.edited = false;
    });
  
    this.lineItems.forEach((lineItem, index) => {
      return lineItem.updateSegment(this.documentManager.getLineSegment(index));
    });
  
    localStorage.removeItem(`document_manager_${this.documentManager.getImageId()}_${this.documentManager.getOutputId()}`);
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
  
  private saveToLocalStorage(): void {
    const segments = this.documentManager.getAllLineSegments();
    localStorage.setItem(`document_manager_${this.documentManager.getImageId()}_${this.documentManager.getOutputId()}`, JSON.stringify(segments));
  }

  private loadFromLocalStorage(): LineSegment[] | null {
    const saved = localStorage.getItem(`document_manager_${this.documentManager.getImageId()}_${this.documentManager.getOutputId()}`);
    if (!saved) return null;
  
    try {
      return JSON.parse(saved) as LineSegment[];
    } catch (e) {
      console.warn('Failed to parse saved segments:', e);
      return null;
    }
  }

  
 
}

