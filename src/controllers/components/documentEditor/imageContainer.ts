import { LineSegment } from "../../../interfaces/lineSegment.types.js";
import { Polygon, Point } from "../../../interfaces/atrResult.types.js";
import { ApiRoute } from "../../../config/constants.js";

/**
 * A class that manages and renders image and polygon overlays on a canvas element.
 * 
 * @class ImageContainer
 * 
 * @property {HTMLElement} container - The container element that holds the canvas
 * @property {HTMLImageElement} imageElement - The image element to be displayed
 * @property {HTMLCanvasElement} canvas - The canvas element where image and polygons are rendered
 * @property {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
 * @property {(polygon: Polygon) => void} onChange - Callback function triggered when polygon changes
 * @property {Polygon[]} polygons - Array of polygons to be rendered on the canvas
 * @property {LineSegment | null} selectedLineSegment - Currently selected line segment for highlighting
 * 
 * @throws {Error} Throws if container element is not found or canvas context cannot be obtained
 * 
 */
export class ImageContainer {
    private container: HTMLElement;
    private imageElement: HTMLImageElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private onChange: (polygon: Polygon) => void;
    private polygons: Polygon[] = [];
    private selectedLineSegment: LineSegment | null = null;
    

    constructor(
        containerId: string,
        imageId: string, 
        onChange: (polygon: Polygon) => void
    ) {
        this.container = document.getElementById(containerId) as HTMLElement;
        if (!this.container) {
            throw new Error(`Container with ID '${containerId}' not found.`);
        }

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.ctx) {
            throw new Error("Failed to get 2D context for canvas.");
        }
        this.imageElement = new Image();
        this.onChange = onChange;

        this.container.appendChild(this.canvas);
        this.initialize(imageId);
    }

    // Method to set polygon
    public setPolygon(polygon: Polygon): void {
        this.polygons.push(polygon);
        this.redraw();
    }

    public setAllPolygons(polygons: Polygon[]): void {
        this.polygons = polygons;
        this.redraw();
    }

    public drawAllPolygons(){
        this.polygons.forEach((polygon) => {
            this.drawPolygon(polygon)
        });
    }

    public clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public highlightLinePolygon(lineSegment: LineSegment | null): void {
        this.selectedLineSegment = lineSegment;
        this.redraw();
    }

    private async initialize(imageId: string) {
        try {
            await this.loadUploadedImage(imageId);
            this.setupCanvas();
        } catch (error) {
            console.error(error);
        }
    }

    private async loadUploadedImage(imageId: string): Promise<void> {
    const response = await fetch(ApiRoute.Images, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: imageId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Clean up old blob URL if needed
    if (this.imageElement.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.imageElement.src);
    }

    this.imageElement.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
        this.imageElement.onload = () => {
            URL.revokeObjectURL(imageUrl); 
            console.log('Image loaded successfully');
            resolve();
        };
        this.imageElement.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            reject(new Error('Failed to load image from blob'));
        };
    });
}


    private async blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(',')[1];
                if (base64) resolve(base64);
                else reject(new Error("Failed to convert blob to base64"));
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    
    private base64ToBlob(base64: string, mimeType: string): Blob {
        const byteCharacters = atob(base64);
        const byteArrays = [];
    
        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
    
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        return new Blob(byteArrays, { type: mimeType });
    }
    
    

   
    private setupCanvas() {
        this.canvas.width = this.imageElement.width;
        this.canvas.height = this.imageElement.height;
        this.redraw();
    }

    private redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imageElement, 0, 0);
        
        if (this.selectedLineSegment !== null) {
            // Access the polygon property of the selected line segment
            const polygon = this.selectedLineSegment.polygon;
            
            // Check if the polygon exists and has points
            if (polygon && polygon.points.length >= 2) {
                this.drawPolygon(polygon);
            }
        }
    }

    private drawPolygon(polygon: Polygon) {
        if (polygon.points.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
        for (let i = 1; i < polygon.points.length; i++) {
            this.ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
        this.ctx.closePath();
        
        if(this.selectedLineSegment){
            if (this.selectedLineSegment.confidence >= 90) {
                // High confidence - Green
                this.ctx.fillStyle = "rgba(198, 246, 213, 0.5)"; 
                this.ctx.strokeStyle = "rgba(34, 84, 61, 1)";
            } else if (this.selectedLineSegment.confidence >= 75) {
                // Good confidence - Blue
                this.ctx.fillStyle = "rgba(190, 227, 248, 0.5)";
                this.ctx.strokeStyle = "rgba(44, 82, 130, 1)";
            } else if (this.selectedLineSegment.confidence >= 60) {
                // Medium confidence - Yellow
                this.ctx.fillStyle = "rgba(254, 252, 191, 0.5)"; 
                this.ctx.strokeStyle = "rgba(116, 66, 16, 1)";
            } else {
                // Low confidence - Red
                this.ctx.fillStyle = "rgba(254, 215, 215, 0.5)"; 
                this.ctx.strokeStyle = "rgba(130, 39, 39, 1)";
            }
        } else{
            this.ctx.fillStyle = "rgba(234, 110, 215, 0.5)";
            this.ctx.strokeStyle ="rgb(205, 17, 180)";
        }    
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
    }
}
