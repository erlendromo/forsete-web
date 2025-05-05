import {
        BaseModel, LineSegmentationModel, TextRecognitionModel
} from '../interfaces/modelInterface'
import { ApiEndpoints } from './constants.js';
import atrApi from './apiConfig.js';


/**
 * A singleton class that manages the available models for the application.
 */
export class ModelsSingelton{
        private static instance: ModelsSingelton;
        private models: BaseModel[];
        
        private constructor(){}

        public static getInstance(): ModelsSingelton {
                if (!ModelsSingelton.instance){
                        ModelsSingelton.instance = new ModelsSingelton();
                }
                return ModelsSingelton.instance;
        }

        public async init(): Promise<void> {
                
                const response = await atrApi.get(ApiEndpoints.MODELS_ENDPOINT);
                if (response.status === 200) {
                        this.models = response.data as BaseModel[];
                 
                } else {                
                        throw new Error(`Failed to fetch models. Status code: ${response.status}`);
                }
                
        }

        public getModels(): BaseModel[] {
                return this.models;
        }

        public getLineSegmentationModels(): LineSegmentationModel[] {
                return this.models.filter((model) => model.model_type === 'line_segmentation') as LineSegmentationModel[];
        }

        public getTextRecognitionModels(): TextRecognitionModel[] {
                return this.models.filter((model) => model.model_type === 'text_recognition') as TextRecognitionModel[];
        }
}