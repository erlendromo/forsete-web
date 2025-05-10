import { handleApiOrMock } from './apiService.js';
import { Model, AllModels } from '../interfaces/modelInterface.js';
import { AppConfig } from '../interfaces/configInterface.js';
import axios from 'axios';
import { ApiEndpoints } from '../config/constants.js';
import { EnumMember, EnumType } from 'typescript';


/**
 * A service for transforming raw Models data into UI-friendly objects.
 */
export class MenuService {
  private static readonly ERROR_NO_MODEL_MSG = 'No models found.';
  private readonly backendUrl: string;
  private readonly useMock: boolean;
  
  /**
   * Constructs a MenuService instance.
   *
   * @param {AppConfig} config - The application configuration object.
   */
  constructor(config: AppConfig) {
    this.backendUrl = config.urlBackend;
    this.useMock     = config.useMock;
  }

   /**
   * Fetches the raw models from the backend (or mock),
   * then returns them as an array of ModelToUI.
   *
   * @returns {Promise<Model>}
   * @throws {Error} if no models are found or the fetch fails.
   */
  public async loadModelNames(): Promise<AllModels> {  
  const lineModels = this.getModels(ApiEndpoints.LINE_MODELS_ENDPOINT);
  const textModels = this.getModels(ApiEndpoints.TEXT_MODELS_ENDPOINT);

  const [line, text] = await Promise.all([lineModels, textModels]);

  return {
    lineModels: line,
    textModels: text
  };
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
   * Transforms a text string and capitalizes the first letter.
   *
   * @param {string} text - The key to be transformed.
   * @returns {string} A formatted, human-readable string.
   */
  private static getReadableText(text: string): string {
    // Replace underscores with spaces and capitalize first letter
    return text.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
  }

  private async getModels(modelEndpoint: string): Promise<Model[]> {
    const url = this.backendUrl + modelEndpoint;
    try {
      console.log(`Fetching models from ${url}`);
      const { data: models } = await axios.get<Model[]>(url);
      if (!models || models.length === 0) {
        console.log('No models found');
      }
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

}

