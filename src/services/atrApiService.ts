import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { handleRequestError, validateFileExists } from '../utils/error-handling';

type ModelConfig = {
  lineSegmentationModel: string;
  textRecognitionModel: string;
};

type AdditionalFields = Record<string, string | number | boolean>;


/**
 * Builds a FormData object including the image, model settings, and any additional fields.
 */
const buildATRFormData = (
  imagePath: string,
  models: ModelConfig,
  additionalFields: AdditionalFields
): FormData => {
  const formData = new FormData();

  formData.append('image', fs.createReadStream(imagePath));
  formData.append('line_segmentation_model', models.lineSegmentationModel);
  formData.append('text_recognition_model', models.textRecognitionModel);

  Object.entries(additionalFields).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  return formData;
};

/**
 * Sends an ATR request using provided image, models, and fields.
 */
export const postATRRequest = async (
  url: string,
  imagePath: string,
  models: ModelConfig,
  additionalFields: AdditionalFields = {}
): Promise<any> => {
  try {
    validateFileExists(imagePath);
    const formData = buildATRFormData(imagePath, models, additionalFields);

    console.log("Sending request to ATR service...");

    const response = await axios.post(url, formData, {
      headers: formData.getHeaders(),
      timeout: 60000,
      maxContentLength: 100 * 1024 * 1024
    });

    if (!response.data) {
      throw new Error('Empty response received from ATR service');
    }

    return response.data;
  } catch (error: any) {
    handleRequestError(error);
    throw error;
  }
};