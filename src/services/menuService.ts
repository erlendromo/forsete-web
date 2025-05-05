import { handleApiOrMock } from './apiService.js';
import { Models } from '../interfaces/modelInterface.js';
import { ModelToUI } from '../interfaces/modelInterface.js';
import { AppConfig } from '../interfaces/configInterface.js';


/**
 * A service for transforming raw Models data into UI-friendly objects.
 */
export class MenuService {
  private static readonly ERROR_NO_MODEL_MSG = 'No models found.';
  private readonly endpointUrl: string;
  private readonly useMock: boolean;
  
  /**
   * Constructs a MenuService instance.
   *
   * @param {AppConfig} config - The application configuration object.
   * @param {string} endpoint - The API endpoint to fetch models from.
   */
  constructor(config: AppConfig, endpoint: string) {
    // build the full URL once
    this.endpointUrl = config.urlBackend+endpoint;
    this.useMock     = config.useMock
  }

   /**
   * Fetches the raw models from the backend (or mock),
   * then returns them as an array of ModelToUI.
   *
   * @returns {Promise<ModelToUI[]>}
   * @throws {Error} if no models are found or the fetch fails.
   */
  public async loadModelNames(): Promise<ModelToUI[]> {
    const response = await handleApiOrMock(this.endpointUrl,this.useMock);
    
    return this.getModelNames(response as Models);
  }

  /**
   * Checks whether the provided value is an array.
   *
   * @param {any} value - The value to be checked.
   * @returns {boolean} - Returns true if the value is an array; otherwise, returns false.
   */
  private static checkArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Checks whether the specified key exists in the object and its value is an array.
   *
   * @param {Record<string, any>} item - The object to check. This object can have any keys with values of any type.
   * @param {string} key - The key to look for within the object.
   * @returns {boolean} - Returns true if the key exists and its value is an array; otherwise, returns false.
   */
  private static checkKey(item: Record<string, any>, key: string): boolean {
    return key in item && MenuService.checkArray(item[key]);
  }

  /**
   * Transforms the data from a JSON response into an array of Model objects.
   *
   * The data parameter must apply to the Models interface, where each key maps to an array
   * of models. For each key that passes the checkKey test, the function maps each model by adding a
   * 'readableType' property obtained from getReadableText.
   *
   * @param {Models} data - The JSON response data containing model arrays.
   * @returns {Promise<ModelToUI[]>} A promise that resolves to an array of transformed Model objects.
   * @throws {Error} If no models are found in the data.
   */
  public async getModelNames(data: Models): Promise<ModelToUI[]> {
    const dataArr = [data];
    const models = dataArr.flatMap((item: Record<string, any>) =>
      Object.keys(item).flatMap(key => {
        // Check if the key exists and its value is an array
        if (MenuService.checkKey(item, key)) {
          // Map each model to a new object with 'name', 'type', and 'readableType'
          return item[key].map((model: ModelToUI) => ({
            name: model.name,
            type: key,
            readableType: MenuService.getReadableText(key)
          }));
        }
        // If the key doesn't exist or its value is not an array, return an empty array
        return [];
      })
    );
    if (models.length === 0) {
      throw new Error(MenuService.ERROR_NO_MODEL_MSG);
    }

    return models;
  }

  /**
   * Transforms a text string and capitalizes the first letter.
   *
   * @param {string} text - The key to be transformed.
   * @returns {string} A formatted, human-readable string.
   */
  private static getReadableText(text: string): string {
    // Replace underscores with spaces and capitalize first letter
    return text.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
  }
}
