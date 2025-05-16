/**
 * Represents the common properties of any model entity.
 *
 * @interface BaseModel
 * @property {number} id The id of the model
 * @property {string} model_type The model type (example: "line_segmentation", "text_recognition").
 * @property {string} name The name of the model
 */
export interface BaseModel {
  id: number;
  model_type: string;
  name: string;
}

/**
 * All the models. Including line models and text models.
 *
 * @interface AllModels
 * @property {BaseModel[]} lineModels Array of models of line segmentation.
 * @property {BaseModel[]} textModels Array of models of text recognition.
 */
export interface AllModels {
  lineModels: BaseModel[];
  textModels: BaseModel[];
}

/**
 * A specific model for line segmentation.
 *
 * @interface LineSegmentationModel
 * @property {number} id the id of the model
 * @property {string} name the name of model
 */
export interface LineSegmentationModel {
  id: number;
  name: string;
}

/**
 * A model for text recognition.
 *
 * @interface TextRecognitionModel
 * @property {number} id the id of the model
 * @property {string} name the name of model
 */
export interface TextRecognitionModel {
  id: number;
  name: string;
}
