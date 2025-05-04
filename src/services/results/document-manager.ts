
/**
 * DocumentManager class for managing ATR-processed text documents.
 */

import { ensureDefined } from "../../utils/error-handling.js";
import { ATRResult, Polygon } from "../../interfaces/atr-result.js";
import { LineSegment } from "../../interfaces/line-segment.js";

type editedAndOriginal ={original: string; edited: string}

export class DocumentManager {
    private originalATRResult: ATRResult;
    private imageFileName: string;
    private lineSegments: Map<number,LineSegment>;
    private documentId: string;
    private createdAt: Date;
  
    constructor(atrResultJson: unknown, imageFileName: string) {
      this.imageFileName = imageFileName;
      this.originalATRResult = atrResultJson as ATRResult; 
      this.createdAt = new Date();
      
      this.documentId = this.generateDocumentId(this.originalATRResult); //current solution, can be changed
      
      this.lineSegments = this.indexATRResult(this.originalATRResult);
    }
  
    //random id generator
    private generateDocumentId(atrResult: ATRResult): string {
      const fileBase = atrResult.file_name.split('.')[0];
      const timestamp = this.createdAt.getTime();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      
      return `${fileBase}_${timestamp}_${randomSuffix}`;
    }
  
    private indexATRResult(atrResult: ATRResult): Map<number, LineSegment> {
        const LineSegmentMap = new Map<number, LineSegment>();
        let lineIndex = 0;
        
        atrResult.contains.forEach((textElement) => {
          if (!textElement.text_result) {
            console.warn("contains element without text_result – skipping", textElement);
            return;
          }
          // For each text in the text_result.texts array
          textElement.text_result.texts.forEach((text) => {
            
            const conf = Number((Number(textElement.text_result.scores[0]) * 100).toFixed(2))
            const textContent = typeof text === 'string' 
              ? text 
              : JSON.stringify(text);
            
            LineSegmentMap.set(lineIndex, {
              originalIndex: lineIndex,
              textContent: textContent, // This ensures it's a string
              confidence: conf,
              edited: false,
              bbox: { ...textElement.segment.bbox },
              polygon: { 
                points: [...textElement.segment.polygon.points], 
              }
            });
            lineIndex++;
          });
        });
        
        return LineSegmentMap;
      }

      //Get imageFileName
      getImageFileName(): string {
        return this.imageFileName;
      }
      
      // Get line segmentation inteface
      getLineSegment(lineIndex:number): LineSegment{
        return ensureDefined(this.lineSegments.get(lineIndex), "Line segment not found");
      }

      // Get the text content of a line index
      getTextContent(lineIndex: number): string  {
        return ensureDefined(this.lineSegments.get(lineIndex)?.editedContent || this.lineSegments.get(lineIndex)?.textContent, "Text content not found");
      }
    
      // Gets a map that contains the edited lines and orignal content
      getEditedAndOriginal(): Map<number, editedAndOriginal> {
        const editedAndOriginal = new Map<number, editedAndOriginal>();
      
        this.lineSegments.forEach((text, lineIndex) => {
          if (text.edited) {
            editedAndOriginal.set(lineIndex, {
              original: text.textContent,
              edited: text.editedContent ?? "" // Use `??` to handle `undefined syntax error
            });
          }
        });
        return editedAndOriginal;
      }

      // Get all the text from each line as string
      getAllTextString(): string {
        return Array.from(this.lineSegments.values())
          .map(item => item.edited ? (item.editedContent || '') : item.textContent)
          .join('\n');
      }

      // Get all the text from each line as array
      getAllTextArray(): string[] {
        return Array.from(this.lineSegments.values())
          .map(item => item.edited ? (item.editedContent || '') : item.textContent)
      }
    
      // Get document ID
      getDocumentId(): string {
        return this.documentId;
      }

     

      // Get bounding box based on line index
      getBoundingBox(lineIndex: number): { xmin: number; ymin: number; xmax: number; ymax: number } | undefined {
        const lineSegment = this.lineSegments.get(lineIndex);
        return lineSegment ? lineSegment.bbox : undefined;
      }

      // Get a map of the bounding boxes as value and the line indexes as key
      getAllBoundingBoxes(): Map<number, { xmin: number; ymin: number; xmax: number; ymax: number }> {
        const bboxMap = new Map<number, { xmin: number; ymin: number; xmax: number; ymax: number }>();
        
        this.lineSegments.forEach((lineSegment, lineIndex) => {
          bboxMap.set(lineIndex, lineSegment.bbox);
        });
        
        return bboxMap;
      }

      // Get polygon based on line index
      getPolygon(lineIndex: number): { points: Array<{x: number, y: number}> } | undefined {
        const editedText = this.lineSegments.get(lineIndex);
        return editedText ? editedText.polygon : undefined;
      }

       // Get a map of the polygons as value and the line indexes as key
      getAllPolygons(): Polygon[] {
        const polygons: Polygon[] = []
        
        this.lineSegments.forEach((text, lineIndex) => {
          polygons.push(text.polygon);
        });
        
        return polygons;
      }
    
      // Get all line indexes as an array
      getLineIndices(): number[] {
        return Array.from(this.lineSegments.keys());
      }
    
      // Get a specific text item by lineIndex
      getTextByLineIndex(lineIndex: number): LineSegment | undefined {
        return this.lineSegments.get(lineIndex);
      }
    
      // Get all line segments as an array
      getAllLineSegments(): LineSegment[] {
        return Array.from(this.lineSegments.values());
      } 

    
      // Edit a specific LineSegment
      editText(lineIndex: number, newContent: string): boolean {
        const textItem = this.lineSegments.get(lineIndex);

        if (textItem) {
          this.lineSegments.set(lineIndex, {
            ...textItem,
            edited: true,
            editedContent: newContent
          });
          return true;
        }
        return false;
      }
      
    //get documentmanager
    getDocumentManager(): DocumentManager {
        return this;
      }

      // Sets a new line segment
      setLineSegment(newLineSegment: LineSegment): void {
        this.lineSegments.set(newLineSegment.originalIndex, newLineSegment);
      }

      // Sets all line segments
      setAllLineSegments(newLineSegments: LineSegment[]): void {
        newLineSegments.forEach((segment) => {
          this.lineSegments.set(segment.originalIndex, segment);
        });
      } 
}
