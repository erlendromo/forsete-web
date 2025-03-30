import { DocumentManager } from "../services/document-manager.js";
import { ATRResult } from "../types/atr-result.js";

// MockDocumentManager is a mock implementation of DocumentManager for testing purposes
export class MockDocumentManager extends DocumentManager {
    constructor() {
        const mockATRResult: ATRResult = {
            file_name: "mock-document.pdf",
            contains: [
                {
                    text_result: {
                        texts: [],
                        scores: []
                    },
                    segment: {
                        bbox: {
                            xmin: 0,
                            ymin: 0,
                            xmax: 0,
                            ymax: 0
                        },
                        polygon: { points: [] },
                        score: 0,
                        class_label: "",
                        orig_shape: [],
                        data: {}
                    },
                    label: ""
                }
            ],
            image_path: "",
            image_name: "",
            label: "",
            processing_steps: []
        };

        const mockImagePath = "/path/to/mock/image.jpg";
        super(mockATRResult, mockImagePath);
    }
}