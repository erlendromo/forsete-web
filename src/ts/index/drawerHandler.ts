import axios from 'axios';
// @ts-ignore mockModelResponse
import mockModelResponse from "../../../src/mocks/modelResponse.json" with { type: 'json' };
import { json } from 'stream/consumers';
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
 * Fetch data using either a mock or a provided HTTP request function.
 *
 * @param url - The URL to fetch real data from.
 * @param useMock - When true, the function uses the static mock data.
 * @param requestFn - A function that performs the HTTP request.
 *                    By default, it uses axios.get.
 * @returns The raw data.
 */
/*
export async function fetchData(
  url: string,
  useMock: boolean,
  requestFn: (url: string) => Promise<{ data: any }> = (url: string) => axios.get(url)
): Promise<any> {
  if (useMock) {
    console.log("Using mock data.");
    return mockModelResponse;
  } else {
    console.log("Requesting URL:", url);
    const response = await requestFn(url);
    return response.data;
  }
}
  */

export async function getModelNames(url: string, data:any): Promise<Model[]> {
  //let data: any;
  //data = fetchData(url, use_mock);
  data = JSON.parse(data);
  data = [data];
  const models = data.flatMap((item: Record<string, any>) => {
    return Object.keys(item).flatMap(key => {
      // Checks if it is an item and an array
      if (checkKey(item, key)) {
        return item[key].map((model: Model) => ({
          name: model.name,
          type: key,
          readableType: getReadableModelType(key)
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


function getReadableModelType(key: string) {
  switch (key) {
    case 'line_segmentation_models':
      return 'Line segmentation models';
    case 'text_recognition_models':
      return 'Text recognition models';
    case 'region_segmentation_models':
      return 'Region segmentation models';
    default:
      // Fallback: Replace underscores with spaces and capitalize first letter
      return key.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
  }
}