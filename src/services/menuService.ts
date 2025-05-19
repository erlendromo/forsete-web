import { BaseModel, AllModels } from '../interfaces/modelInterface.types.js';
import { AppConfig } from '../interfaces/config.types.js';
import axios from 'axios';
import { ApiEndpoints } from '../config/constants.js';



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
   * Returns the models from the singleton as an array of ModelToUI.
   *
   * @returns {Promise<Model>}
   * @throws {Error} if no models are found or the fetch fails.
   */
  public async loadAllModels(): Promise<AllModels> {  
  const lineModels = this.getModels(ApiEndpoints.LINE_MODELS_ENDPOINT);
  const textModels = this.getModels(ApiEndpoints.TEXT_MODELS_ENDPOINT);

  const [line, text] = await Promise.all([lineModels, textModels]);

  return {
    lineModels: line,
    textModels: text
  };
  }

  /**
   * Fetches models from a specified endpoint.
   * @param modelEndpoint - The API endpoint path to fetch models from
   * @returns Promise containing an array of BaseModel objects
   * @throws Will throw an error if the API request fails
   */
  private async getModels(modelEndpoint: string): Promise<BaseModel[]> {
    const url = this.backendUrl + modelEndpoint;
    try {
      console.log(`Fetching models from ${url}`);
      const { data: models } = await axios.get<BaseModel[]>(url);
      if (!models || models.length === 0) {
        console.log(MenuService.ERROR_NO_MODEL_MSG);
      }
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

}
