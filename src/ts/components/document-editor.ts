import { LineSegment } from "../interfaces/line-segment";
import { DocumentManager } from "../services/document-manager";

export class DocumentLineEditor {
    private container: HTMLElement;
    private lineNumbersEl: HTMLElement;
    private editorContentEl: HTMLElement;
    private resetColumnEl: HTMLElement;
    private revertAllBtn: HTMLButtonElement;
    private saveBtn: HTMLButtonElement;
    private transcibeDoc: DocumentManager;
    
    constructor(containerId: string, documentManager: DocumentManager) {
      // Get container element
      this.container = document.getElementById(containerId) as HTMLElement;
      if (!this.container) {
        throw new Error(`Container element with ID "${containerId}" not found`);
      }
      
      this.transcibeDoc = documentManager
      // Create editor structure
      this.createEditorStructure();
      
      // Initialize UI elements
      this.lineNumbersEl = document.getElementById(`${containerId}-line-numbers`) as HTMLElement;
      this.editorContentEl = document.getElementById(`${containerId}-editor-content`) as HTMLElement;
      this.resetColumnEl = document.getElementById(`${containerId}-reset-column`) as HTMLElement;
      this.revertAllBtn = document.getElementById(`${containerId}-revert-all`) as HTMLButtonElement;
      this.saveBtn = document.getElementById(`${containerId}-save`) as HTMLButtonElement;
      
      // Add event listeners
      this.revertAllBtn.addEventListener('click', this.handleRevertAll.bind(this));
      this.saveBtn.addEventListener('click', this.handleSave.bind(this));
      
      // Initial render
      this.renderEditor();
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
          
          <div class="editor-body">
            <div class="line-numbers" id="${this.container.id}-line-numbers"></div>
            <div class="editor-content" id="${this.container.id}-editor-content"></div>
            <div class="reset-column" id="${this.container.id}-reset-column"></div>
          </div>
        </div>
      `;
      
      // Add CSS styles if not already present
      if (!document.getElementById('line-editor-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'line-editor-styles';
        styleEl.textContent = this.getEditorStyles();
        document.head.appendChild(styleEl);
      }
    }
    
    private renderEditor(): void {
      // Clear containers
      this.lineNumbersEl.innerHTML = '';
      this.editorContentEl.innerHTML = '';
      this.resetColumnEl.innerHTML = '';
      
      // Check if any lines are edited
      const hasEditedLines = this.transcibeDoc.getAllLineSegments().some(segment => segment.edited);
      this.revertAllBtn.disabled = !hasEditedLines;
      
      // Populate the editor
      this.transcibeDoc.getAllLineSegments().forEach(segment => {
        // Line numbers and confidence scores
        const lineNumberContainer = document.createElement('div');
        lineNumberContainer.className = 'line-number-container';
        
        const lineNumber = document.createElement('div');
        lineNumber.className = 'line-number';
        lineNumber.textContent = (segment.originalIndex).toString();
        lineNumberContainer.appendChild(lineNumber);
        
        if (segment.confidence !== undefined) {
          const confidenceEl = document.createElement('div');
          confidenceEl.className = 'confidence-score';
          confidenceEl.textContent = `${segment.confidence}%`;
          confidenceEl.title = 'Confidence Score';
          
          // Set color based on confidence level
          if (segment.confidence >= 90) {
            confidenceEl.classList.add('confidence-high');
          } else if (segment.confidence >= 75) {
            confidenceEl.classList.add('confidence-good');
          } else if (segment.confidence >= 60) {
            confidenceEl.classList.add('confidence-medium');
          } else {
            confidenceEl.classList.add('confidence-low');
          }
          
          lineNumberContainer.appendChild(confidenceEl);
        }
        
        this.lineNumbersEl.appendChild(lineNumberContainer);
        
        // Editor content
        const editorLine = document.createElement('div');
        editorLine.className = 'editor-line';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'editor-textarea';
        if (segment.edited) {
          textarea.classList.add('edited');
        }
        textarea.value = segment.textContent;
        textarea.dataset.lineIndex = segment.originalIndex.toString();
        textarea.addEventListener('input', this.handleTextChange.bind(this));
        
        editorLine.appendChild(textarea);
        this.editorContentEl.appendChild(editorLine);
        
        // Reset buttons
        const resetContainer = document.createElement('div');
        resetContainer.className = 'reset-container';
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = '⟲';
        resetBtn.title = 'Reset to original';
        resetBtn.dataset.lineIndex = segment.originalIndex.toString();
        
        if (segment.edited) {
          resetBtn.classList.add('reset-active');
        } else {
          resetBtn.classList.add('reset-inactive');
          resetBtn.disabled = true;
        }
        
        resetBtn.addEventListener('click', this.handleReset.bind(this));
        resetContainer.appendChild(resetBtn);
        this.resetColumnEl.appendChild(resetContainer);
      });
    }
    
    private handleTextChange(event: Event): void {
      const target = event.target as HTMLTextAreaElement;
      const lineIndex = parseInt(target.dataset.lineIndex || '0', 10);
      const newText = target.value;
      
      // Find the segment and update it
      const segment = this.transcibeDoc.getLineSegment(lineIndex);
      if (segment) {
        segment.editedContent = newText;
        segment.edited = newText !== segment.textContent;
      }
      
      // Re-render the editor to update visual states
      this.renderEditor();
    }
    
    private handleReset(event: Event): void {
      const target = event.target as HTMLButtonElement;
      const lineIndex = parseInt(target.dataset.lineIndex || '0', 10);
      
      // Find the segment and reset it
      const segment = this.transcibeDoc.getLineSegment(lineIndex);
      if (segment) {
        segment.editedContent = segment.textContent;
        segment.edited = false;
      }
      
      // Re-render the editor
      this.renderEditor();
    }
    
    private handleRevertAll(): void {
      // Reset all lines
      this.transcibeDoc.getAllLineSegments().forEach(segment => {
        segment.editedContent = segment.textContent;
        segment.edited = false;
      });
      
      // Re-render the editor
      this.renderEditor();
    }
    
    private handleSave(): void {
      // Example: Output the current state to console
      console.log('Saving changes:', this.transcibeDoc);
      
      // Implement your own save logic here
      // For example, send the data to a server or update a parent component
      
      // You could also emit a custom event
      const saveEvent = new CustomEvent('editor-save', {
        detail: { transcibeDoc: this.transcibeDoc }
      });
      this.container.dispatchEvent(saveEvent);
    }
    
    // Get current line segments data
    public getLineSegments(): LineSegment[] {
      return [...this.transcibeDoc.getAllLineSegments()]; // Return a copy to prevent direct modification
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
        
        /* Editor body */
        .editor-body {
          display: flex;
          font-size: 14px;
          font-family: Monaco, Menlo, "Courier New", monospace;
        }
        
        /* Line numbers and confidence */
        .line-numbers {
          background-color: #f7fafc;
          color: #718096;
          flex-shrink: 0;
          width: 100px;
        }
        
        .line-number-container {
          display: flex;
          align-items: center;
          height: 32px;
        }
        
        .line-number {
          width: 40px;
          text-align: right;
          padding-right: 8px;
          padding-top: 4px;
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
        
        /* Editor content */
        .editor-content {
          flex-grow: 1;
        }
        
        .editor-line {
          border-bottom: 1px solid #f1f1f1;
        }
        
        .editor-textarea {
          width: 100%;
          height: 32px;
          padding: 4px 8px;
          border: none;
          font-family: Monaco, Menlo, "Courier New", monospace;
          font-size: 14px;
          resize: none;
          box-sizing: border-box;
        }
        
        .editor-textarea:focus {
          outline: none;
        }
        
        .edited {
          background-color: #fffbea;
        }
        
        /* Reset buttons column */
        .reset-column {
          flex-shrink: 0;
          width: 40px;
          background-color: #f9fafb;
        }
        
        .reset-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 32px;
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