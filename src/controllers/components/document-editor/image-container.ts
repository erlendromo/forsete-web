import { LineSegment } from "../../../interfaces/line-segment";
import { Polygon, Point } from "../../../interfaces/atr-result";

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
        imageFilename: string, 
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
        this.initialize(imageFilename);
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



    public highlightLinePolygon(lineSegment: LineSegment | null): void {
        this.selectedLineSegment = lineSegment;
        this.redraw();
    }

    private async initialize(imageFilename: string) {
        try {
            await this.loadUploadedImage(imageFilename);
            this.setupCanvas();
        } catch (error) {
            console.error(error);
        }
    }

    private async loadUploadedImage(imageId: string): Promise<void> {
        try {
            const response = await fetch('/api/images', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_id: imageId }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
    
            const { dataUrl } = await response.json();
    
            return new Promise((resolve, reject) => {
                this.imageElement.src = dataUrl;
    
                this.imageElement.onload = () => {
                    console.log('Image loaded successfully');
                    resolve();
                };
    
                this.imageElement.onerror = () => {
                    console.error('Error loading image');
                    this.imageElement.src = "/images/image-placeholder.jpg";
                    reject(new Error('Failed to load image from data URL'));
                };
            });
        } catch (error) {
            console.error(error);
            this.imageElement.src = "/images/image-placeholder.jpg";
            throw error;
        }
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
                this.ctx.fillStyle = "rgba(198, 246, 213, 0.5)"; // #c6f6d5 with 0.5 opacity
                this.ctx.strokeStyle = "#22543d";
            } else if (this.selectedLineSegment.confidence >= 75) {
                // Good confidence - Blue
                this.ctx.fillStyle = "rgba(190, 227, 248, 0.5)"; // #bee3f8 with 0.5 opacity
                this.ctx.strokeStyle = "#2c5282";
            } else if (this.selectedLineSegment.confidence >= 60) {
                // Medium confidence - Yellow
                this.ctx.fillStyle = "rgba(254, 252, 191, 0.5)"; // #fefcbf with 0.5 opacity
                this.ctx.strokeStyle = "#744210";
            } else {
                // Low confidence - Red
                this.ctx.fillStyle = "rgba(254, 215, 215, 0.5)"; // #fed7d7 with 0.5 opacity
                this.ctx.strokeStyle = "#822727";
            }
        }    
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
    }
}
