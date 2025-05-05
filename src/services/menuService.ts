import { Models, ModelToUI } from '../interfaces/modelInterface.js';
import { ModelsSingelton } from '../config/atrModels.js';

/**
 * A service for transforming raw Models data into UI-friendly objects.
 */
export class MenuService {
  private static readonly ERROR_NO_MODEL_MSG = 'No models found.';

  constructor() {}

  /**
   * Returns the models from the singleton as an array of ModelToUI.
   *
   * @returns {Promise<ModelToUI[]>}
   * @throws {Error} if no models are found.
   */
  public async loadModelNames(): Promise<ModelToUI[]> {
    const models = ModelsSingelton.getInstance().getModels();
    return this.getModelNames(models);
  }

  private static checkArray(value: any): boolean {
    return Array.isArray(value);
  }

  private static checkKey(item: Record<string, any>, key: string): boolean {
    return key in item && MenuService.checkArray(item[key]);
  }

  public async getModelNames(data: Models): Promise<ModelToUI[]> {
    const dataArr = [data];
    const models = dataArr.flatMap((item: Record<string, any>) =>
      Object.keys(item).flatMap(key => {
        if (MenuService.checkKey(item, key)) {
          return item[key].map((model: ModelToUI) => ({
            name: model.name,
            type: key,
            readableType: MenuService.getReadableText(key)
          }));
        }
        return [];
      })
    );
    if (models.length === 0) {
      throw new Error(MenuService.ERROR_NO_MODEL_MSG);
    }
    return models;
  }

  private static getReadableText(text: string): string {
    return text.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
  }
}