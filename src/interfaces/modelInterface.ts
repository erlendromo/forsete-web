export interface BaseModel {
    id: number;
    model_type: string;
    name: string;
  }

  export interface AllModels {
  lineModels: BaseModel[];
  textModels: BaseModel[];
}
  
  export interface LineSegmentationModel {
    id: number;
    name: string
  }
  
  export interface TextRecognitionModel {
    id: number;
    name: string;
  }
  
  export interface RegionSegmentationModel {
    id: number;
    name: string;
  }

  export interface ModelToUI {
    type: string;
    name: string;
    readableType?: string;
  }
  
  export type ModelVariants =
  | LineSegmentationModel
  | TextRecognitionModel
  | RegionSegmentationModel;
