export interface Models {
    line_segmentation_models: LineSegmentationModel[]
    text_recognition_models: TextRecognitionModel[]
    region_segmentation_models: RegionSegmentationModel[]
  }
  
  export interface LineSegmentationModel {
    name: string
  }
  
  export interface TextRecognitionModel {
    name: string
  }
  
  export interface RegionSegmentationModel {
    name: string
  }