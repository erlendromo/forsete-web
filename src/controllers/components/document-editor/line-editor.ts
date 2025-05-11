import { LineSegment } from "../../../interfaces/line-segment";

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
    this.segment = { ...segment };
    this.onChange = onChange;
    this.onFocus = onFocus || null;

    this.container = document.createElement('div');
    this.container.className = 'editor-line-item';

    this.lineNumberEl = document.createElement('div');
    this.lineNumberEl.className = 'line-number';
    this.lineNumberEl.textContent = (segment.originalIndex + 1).toString();

    if (segment.confidence !== undefined) {
      this.confidenceEl = document.createElement('div');
      this.confidenceEl.className = 'confidence-score';
      this.confidenceEl.textContent = `${segment.confidence}%`;
      this.confidenceEl.title = 'Confidence Score';

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

    this.textareaEl = document.createElement('textarea');
    this.textareaEl.className = 'editor-textarea';
    this.textareaEl.value = segment.textContent;
    this.textareaEl.addEventListener('input', this.handleTextChange.bind(this));

    this.textareaEl.addEventListener('focus', () => {
      this.handleTextareaFocus();

      if (this.onFocus) {
        this.onFocus(this.segment);
      }
    });

    this.resetBtnEl = document.createElement('button');
    this.resetBtnEl.className = 'reset-btn';
    this.resetBtnEl.textContent = '⟲';
    this.resetBtnEl.title = 'Reset to original';
    this.resetBtnEl.addEventListener('click', this.handleReset.bind(this));

    this.buildDOMStructure();
    this.updateVisualState();
  }

  private buildDOMStructure(): void {
    const lineNumberContainer = document.createElement('div');
    lineNumberContainer.className = 'line-number-container';
    lineNumberContainer.appendChild(this.lineNumberEl);

    if (this.confidenceEl) {
      lineNumberContainer.appendChild(this.confidenceEl);
    }

    const resetContainer = document.createElement('div');
    resetContainer.className = 'reset-container';
    resetContainer.appendChild(this.resetBtnEl);

    const textContainer = document.createElement('div');
    textContainer.className = 'editor-text-container';
    textContainer.appendChild(this.textareaEl);

    this.container.appendChild(lineNumberContainer);
    this.container.appendChild(textContainer);
    this.container.appendChild(resetContainer);
  }

  private updateVisualState(): void {
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

    this.segment.editedContent = newText;
    this.segment.edited = newText !== this.segment.textContent;

    this.updateVisualState();
    this.adjustTextareaHeight();
    this.onChange(this.segment);
  }

  private handleSelect(event: Event): void {
    if (
      event.target !== this.textareaEl && 
      event.target !== this.resetBtnEl
    ) {
      this.setSelected(true);

      if (event.target !== this.textareaEl) {
        this.textareaEl.focus(); 
      }
    }
  }

  public setSelected(selected: boolean): void {
    if (selected) {
      this.container.classList.add('selected');
      this.container.classList.add('expanded');
    } else {
      this.container.classList.remove('selected');
      this.container.classList.remove('expanded');
    }
  }

  private adjustTextareaHeight(): void {
    if (!this.textareaEl) return;
  
    // Reset the height to auto to measure the scroll height correctly
    this.textareaEl.style.height = 'auto';
  
    // Calculate the new height for the textarea based on its content
    const minHeight = 60;
    const contentHeight = Math.max(this.textareaEl.scrollHeight + 10, minHeight);
  
    // Set the new height
    this.textareaEl.style.height = `${contentHeight}px`;
    this.container.style.height = `${contentHeight + 20}px`;
  }

  private handleTextareaFocus(): void {
    this.container.classList.add('expanded');
    this.adjustTextareaHeight();
    this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private handleReset(): void {
    this.segment.editedContent = this.segment.textContent;
    this.segment.edited = false;
    this.textareaEl.value = this.segment.textContent;
    this.updateVisualState();
    this.onChange(this.segment);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public updateSegment(segment: LineSegment): void {
    this.segment = { ...segment };
    this.textareaEl.value = segment.editedContent || segment.textContent;
    this.updateVisualState();
  }

  public getSegment(): LineSegment {
    return { ...this.segment };
  }
}
