// @ts-ignore mockModelResponse
import { Models } from '@interfaces/modelInterface';
const errorNoModelMsg = 'No models found.';

interface Model {
  type: string;
  name: string;
  readableType?: string;
}

/**
 * Checks whether the provided value is an array.
 *
 * @param {any} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is an array; otherwise, returns false.
 */
function checkArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Checks whether the specified key exists in the object and its value is an array.
 *
 * @param {Record<string, any>} item - The object to check. This object can have any keys with values of any type.
 * @param {string} key - The key to look for within the object.
 * @returns {boolean} - Returns true if the key exists and its value is an array; otherwise, returns false.
 */
function checkKey(item: Record<string, any>, key: string): boolean {
  return key in item && checkArray(item[key]);
}

/**
 * Transforms the data from a JSON response into an array of Model objects.
 *
 * The data parameter must apply to the Models interface, where each key maps to an array
 * of models. For each key that passes the checkKey test, the function maps each model by adding a
 * 'readableType' property obtained from getReadableText.
 *
 * @param {Models} data - The JSON response data containing model arrays.
 * @returns {Promise<Model[]>} A promise that resolves to an array of transformed Model objects.
 */
export async function getModelNames(data:Models): Promise<Model[]> {
  const dataArr = [data];
  const models = dataArr.flatMap((item: Record<string, any>) => {
    return Object.keys(item).flatMap(key => {
      // Checks if it is an item and an array
      if (checkKey(item, key)) {
        return item[key].map((model: Model) => ({
          name: model.name,
          type: key,
          readableType: getReadableText(key)
        }));
      }
      return [];
    });
  });
  if (models.length === 0) {
    throw new Error(errorNoModelMsg);
  }
  return models;
}

/**
 * Transforms a text string and capitalizes the first letter.
 *
 * @param {string} text - The key to be transformed.
 * @returns {string} A formatted, human-readable string.
 */
function getReadableText(text: string): string {
  // Replace underscores with spaces and capitalize first letter
  return text.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
}