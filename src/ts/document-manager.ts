/**
 * DocumentManager class for managing ATR-processed text documents.
 */
class DocumentManager {
    private originalATRResult: ATRResult;
    private editedTexts: Map<number,EditedText>;
    private documentId: string;
    private createdAt: Date;
  
    constructor(atrResult: ATRResult) {
      this.originalATRResult = JSON.parse(JSON.stringify(atrResult)); 
      this.createdAt = new Date();
      
      this.documentId = this.generateDocumentId(atrResult); //current solution, can be changed
      
      this.editedTexts = this.indexATRResult(atrResult);
    }
  
    //random id generator
    private generateDocumentId(atrResult: ATRResult): string {
      const fileBase = atrResult.file_name.split('.')[0];
      const timestamp = this.createdAt.getTime();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      
      return `${fileBase}_${timestamp}_${randomSuffix}`;
    }
  
    private indexATRResult(atrResult: ATRResult): Map<number, EditedText> {
        const editedTextsMap = new Map<number, EditedText>();
        let lineIndex = 0;
        
        atrResult.contains.forEach((textElement, originalIndex) => {
          // For each text in the text_result.texts array
          textElement.text_result.texts.forEach((text) => {
            editedTextsMap.set(lineIndex, {
              originalIndex: lineIndex,
              textContent: text,
              confidence: textElement.text_result.scores[0],
              edited: false,
              bbox: { ...textElement.segment.bbox },
          polygon: { 
            points: [...textElement.segment.polygon.points] 
          }
            });
            lineIndex++;
          });
        });
        
        return editedTextsMap;
      }
    
      // Get all the text from each line as string
      getAllText(): string {
        return Array.from(this.editedTexts.values())
          .map(item => item.edited ? (item.editedContent || '') : item.textContent)
          .join('\n');
      }
    
      // Get document ID
      getDocumentId(): string {
        return this.documentId;
      }

      // Get bounding box based on line index
      getBoundingBox(lineIndex: number): { xmin: number; ymin: number; xmax: number; ymax: number } | undefined {
        const textItem = this.editedTexts.get(lineIndex);
        return textItem ? textItem.bbox : undefined;
      }

      // Get a map of the bounding boxes as value and the line indexes as key
      getAllBoundingBoxes(): Map<number, { xmin: number; ymin: number; xmax: number; ymax: number }> {
        const bboxMap = new Map<number, { xmin: number; ymin: number; xmax: number; ymax: number }>();
        
        this.editedTexts.forEach((item, lineIndex) => {
          bboxMap.set(lineIndex, item.bbox);
        });
        
        return bboxMap;
      }

      // Get polygon based on line index
      getPolygon(lineIndex: number): { points: Array<{x: number, y: number}> } | undefined {
        const text = this.editedTexts.get(lineIndex);
        return text ? text.polygon : undefined;
      }

       // Get a map of the polygons as value and the line indexes as key
      getAllPolygons(): Map<number, { points: Array<{x: number, y: number}> }> {
        const polygonMap = new Map<number, { points: Array<{x: number, y: number}> }>();
        
        this.editedTexts.forEach((text, lineIndex) => {
          polygonMap.set(lineIndex, text.polygon);
        });
        
        return polygonMap;
      }
    
      // Get all line indexes as an array
      getLineIndices(): number[] {
        return Array.from(this.editedTexts.keys());
      }
    
      // Get a specific text item by lineIndex
      getTextByLineIndex(lineIndex: number): EditedText | undefined {
        return this.editedTexts.get(lineIndex);
      }
    
      // Get all edited texts as an array
      getAllTextItems(): EditedText[] {
        return Array.from(this.editedTexts.values());
      } 

    
      // Edit a specific textline
      editText(lineIndex: number, newContent: string): boolean {
        const textItem = this.editedTexts.get(lineIndex);

        if (textItem) {
          this.editedTexts.set(lineIndex, {
            ...textItem,
            edited: true,
            editedContent: newContent
          });
          return true;
        }
        return false;
      }
      
    //get documentmanager
      getDocumentManager(){
        return {
            documentId: this.documentId,
            originalFile: this.originalATRResult.file_name,
            createdAt: this.createdAt,
            editedTexts: Object.fromEntries(this.editedTexts)
          };
      }
}
