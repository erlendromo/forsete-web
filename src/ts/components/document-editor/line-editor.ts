import { LineSegment } from "../../types/line-segment";

export class LineEditorItem {
    private container: HTMLElement;
    private segment: LineSegment;
    private lineNumberEl: HTMLElement;
    private confidenceEl: HTMLElement | null = null;
    private textareaEl: HTMLTextAreaElement;
    private resetBtnEl: HTMLButtonElement;
    private onChange: (segment: LineSegment) => void;
    private onFocus: ((segment: LineSegment) => void) | null = null;

  
    constructor(
      segment: LineSegment, 
      onChange: (segment: LineSegment) => void,
      onFocus?: (segment: LineSegment) => void,

    ) {
      this.segment = { ...segment }; // Clone to avoid modifying the original
      this.onChange = onChange;
      this.onFocus = onFocus || null;
      
      // Create container element
      this.container = document.createElement('div');
      this.container.className = 'editor-line-item';
      this.container.addEventListener('focus', this.handleTextareaFocus.bind(this));
      
      // Create line number element
      this.lineNumberEl = document.createElement('div');
      this.lineNumberEl.className = 'line-number';
      this.lineNumberEl.textContent = (segment.originalIndex + 1).toString();
      
      // Create confidence score element if available
      if (segment.confidence !== undefined) {
        this.confidenceEl = document.createElement('div');
        this.confidenceEl.className = 'confidence-score';
        this.confidenceEl.textContent = `${segment.confidence}%`;
        this.confidenceEl.title = 'Confidence Score';
        
        // Set color based on confidence level
        if (segment.confidence >= 90) {
          this.confidenceEl.classList.add('confidence-high');
        } else if (segment.confidence >= 75) {
          this.confidenceEl.classList.add('confidence-good');
        } else if (segment.confidence >= 60) {
          this.confidenceEl.classList.add('confidence-medium');
        } else {
          this.confidenceEl.classList.add('confidence-low');
        }
      }
      
      // Create textarea element
      this.textareaEl = document.createElement('textarea');
      this.textareaEl.className = 'editor-textarea';
      this.textareaEl.value = segment.textContent;
      this.textareaEl.addEventListener('input', this.handleTextChange.bind(this));
      
      // Add focus and blur events for expansion
      this.textareaEl.addEventListener('focus', () => {
        this.handleTextareaFocus();
        
        // Notify parent about focus if callback exists
        if (this.onFocus) {
            this.onFocus(this.segment);
        }
    });
      
      // Create reset button element
      this.resetBtnEl = document.createElement('button');
      this.resetBtnEl.className = 'reset-btn';
      this.resetBtnEl.textContent = '⟲';
      this.resetBtnEl.title = 'Reset to original';
      this.resetBtnEl.addEventListener('click', this.handleReset.bind(this));
      
      // Build the DOM structure
      this.buildDOMStructure();
      
      // Update the visual state
      this.updateVisualState();
    }

      private buildDOMStructure(): void {
        // Create line number container
        const lineNumberContainer = document.createElement('div');
        lineNumberContainer.className = 'line-number-container';
        lineNumberContainer.appendChild(this.lineNumberEl);
        
        if (this.confidenceEl) {
          lineNumberContainer.appendChild(this.confidenceEl);
        }
        
        // Create reset button container
        const resetContainer = document.createElement('div');
        resetContainer.className = 'reset-container';
        resetContainer.appendChild(this.resetBtnEl);
        
        // Create text container
        const textContainer = document.createElement('div');
        textContainer.className = 'editor-text-container';
        textContainer.appendChild(this.textareaEl);
        
        // Add all elements to the container
        this.container.appendChild(lineNumberContainer);
        this.container.appendChild(textContainer);
        this.container.appendChild(resetContainer);
      }
      
      private updateVisualState(): void {
        // Update textarea class based on edited state
        if (this.segment.edited) {
          this.textareaEl.classList.add('edited');
          this.resetBtnEl.classList.add('reset-active');
          this.resetBtnEl.classList.remove('reset-inactive');
          this.resetBtnEl.disabled = false;
        } else {
          this.textareaEl.classList.remove('edited');
          this.resetBtnEl.classList.remove('reset-active');
          this.resetBtnEl.classList.add('reset-inactive');
          this.resetBtnEl.disabled = true;
        }
      }
      
      private handleTextChange(event: Event): void {
        const target = event.target as HTMLTextAreaElement;
        const newText = target.value;
        
        // Update the segment
        this.segment.editedContent = newText;
        this.segment.edited = newText !== this.segment.textContent;
        
        // Update visual state
        this.updateVisualState();
        
        // Adjust textarea height to fit content
        this.adjustTextareaHeight();
        
        // Notify parent of the change
        this.onChange(this.segment);
      }

      private handleSelect(event: Event): void {
        // Only trigger if not clicking on the textarea or reset button
        if (
          event.target !== this.textareaEl && 
          event.target !== this.resetBtnEl
        ) {
          // Add selected class to this container
          this.setSelected(true);
          
          // Notify parent of selection if callback exists
          if (event.target !== this.textareaEl) {
            this.textareaEl.focus(); 
          }
        }
      }
      
      public setSelected(selected: boolean): void {
        if (selected) {
          this.container.classList.add('selected');
        } else {
          this.container.classList.remove('selected');
        }
      }
      
      // Adjust height of textarea to fit content
      private adjustTextareaHeight(): void {
        // Reset height to auto first to get the right scrollHeight
        this.textareaEl.style.height = 'auto';
        
        // Set to scrollHeight to expand properly
        this.textareaEl.style.height = `${this.textareaEl.scrollHeight}px`;
        
        // Update container height
        if (this.container.classList.contains('expanded')) {
          this.container.style.height = `${this.textareaEl.scrollHeight + 16}px`; // Add padding
        }
      }
      
      private handleReset(): void {
        // Reset the text to original
        this.segment.editedContent = this.segment.textContent;
        this.segment.edited = false;
        
        // Update the textarea value
        this.textareaEl.value = this.segment.textContent;
        
        // Update visual state
        this.updateVisualState();
        
        // Notify parent of the change
        this.onChange(this.segment);
      }
      
      // Get the DOM element to add to the editor
      public getElement(): HTMLElement {
        return this.container;
      }
      
      // Update the segment data
      public updateSegment(segment: LineSegment): void {
        this.segment = { ...segment };
        this.textareaEl.value = segment.editedContent || segment.textContent;
        this.updateVisualState();
      }
      
      // Get the current segment data
      public getSegment(): LineSegment {
        return { ...this.segment };
      }

      private handleTextareaFocus(): void {
        // Add expanded class to line container
        this.container.classList.add('expanded');
        this.container.classList.add('focused');
        // Adjust height to fit content with some extra space for typing
        this.textareaEl.style.height = 'auto';
        const minHeight = 60; // Minimum height when expanded
        const contentHeight = Math.max(this.textareaEl.scrollHeight + 10, minHeight);
        
        this.textareaEl.style.height = `${contentHeight}px`;
        
        // Set container height to accommodate the expanded textarea
        this.container.style.height = `${contentHeight + 16}px`; // 16px for padding
    }

 }
  