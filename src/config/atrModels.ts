import {
        Models, LineSegmentationModel, TextRecognitionModel, RegionSegmentationModel
} from '../interfaces/modelInterface'



class ModelsSingelton{
        private static instance: ModelsSingelton;
        private availbeModels: Models;
        
        private constructor(){}

        public static getInstance(): ModelsSingelton {
                if (!ModelsSingelton.instance){
                        ModelsSingelton.instance = new ModelsSingelton();
                }
                return ModelsSingelton.instance;
        }

        public init(models: Models): void {
                if(!this.availbeModels){
                   this.availbeModels = models;    
                }
        }

        public getModels(): Models {
                return this.availbeModels
        }

        public getRegionSegmentationModel(): RegionSegmentationModel[] {
                return this.availbeModels.region_segmentation_models
        }

        public getRegioLineSegmentationModel(): LineSegmentationModel[] {
                return this.availbeModels.line_segmentation_models
        }

        public getTextRecognitionModel(): TextRecognitionModel[] {
                return this.availbeModels.text_recognition_models
        }

}