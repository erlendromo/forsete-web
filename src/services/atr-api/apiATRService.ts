import { handleRequestError } from '../../utils/error-handling.js';
import { ApiEndpoints } from '../../config/constants.js';
import { ImageProcessingConfig } from '../../interfaces/configInterface.js';
import { config } from "../../config/config.js";

export const postATRRequest = async (
  imageConfig: ImageProcessingConfig,
  token: string
): Promise<any> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 360000); // 6min timeout
    console.log("Sending ATR request with config:", imageConfig);
    console.log(config.urlBackend+ ApiEndpoints.ATR_ENDPOINT);
    const response = await fetch(config.urlBackend+ ApiEndpoints.ATR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(imageConfig),
      credentials: 'include',
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`ATR request failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Empty response received from ATR service');
    }

    return data;
  } catch (error: any) {
    handleRequestError(error);
    throw error;
  }
};