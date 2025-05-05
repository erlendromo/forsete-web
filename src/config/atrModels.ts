import axios from 'axios';
import {
        Models, LineSegmentationModel, TextRecognitionModel, RegionSegmentationModel
} from '../interfaces/modelInterface'
import { ApiEndpoints } from './constants.js';


/**
 * A singleton class that manages the available models for the application.
 */
export class ModelsSingelton{
        private static instance: ModelsSingelton;
        private availbeModels: Models;
        
        private constructor(){}

        public static getInstance(): ModelsSingelton {
                if (!ModelsSingelton.instance){
                        ModelsSingelton.instance = new ModelsSingelton();
                }
                return ModelsSingelton.instance;
        }

        public async init(): Promise<void> {
                if(!this.availbeModels){      
                const response = await axios.get(ApiEndpoints.MODELS_ENDPOINT);
                if (response.status === 200) {
                        // Assuming the response data is in the expected format
                        this.availbeModels = response.data as Models;
                } else {                
                        throw new Error(`Failed to fetch models. Status code: ${response.status}`);
                }
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