import axios from 'axios';
const errorNoModelMsg = 'No models found.';

interface Model {
    name: string;
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

export async function getModelNames() {
    //const response = await axios.get('http://10.212.172.171:8080/forsete-atr/v1/models/');
    //const data = response.data;

    const mockedResponse = {
        line_segmentation_models: [
          {
            name: 'yolov9-lines-within-regions-1'
          }
        ],
        text_recognition_models: [
          {
            name: 'TrOCR-norhand-v3'
          }
        ]
      };
  
      const data = [mockedResponse];


    if (!checkArray(data)) {
        throw new Error('Response data is not an array.');
    }

    const allNames = data.flatMap((item: Record<string, any>) => {
        return Object.keys(item).flatMap(key => {
            // Checks if it is an item and an array
            if (checkKey(item, key)) {
                return item[key].map((model: Model) => model.name);
            }
            return [];
        });
    });
    if (allNames.length === 0) {
        throw new Error(errorNoModelMsg);
    }
    return allNames;
}