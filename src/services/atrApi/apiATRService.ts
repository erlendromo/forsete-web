import { handleRequestError } from '../../utils/error-handling.js';
import { ApiEndpoints } from '../../config/constants.js';
import { ImageProcessingConfig } from '../../interfaces/config.types.js';
import { config } from "../../config/config.js";

/**
 * Sends a POST request to the ATR (Automatic Text Recognition) service with the provided image processing configuration.
 *
 * @param imageConfig - The configuration object for image processing to be sent in the request body.
 * @param token - The Bearer token used for authorization in the request header.
 * @returns A promise that resolves to the response data from the ATR service.
 * @throws Will throw an error if the request fails, times out, or if the response is empty.
 *
 * @remarks
 * - The request will timeout after 6 minutes.
 */
export const postATRRequest = async (
  imageConfig: ImageProcessingConfig,
  token: string
): Promise<any> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 360000); // 6min timeout
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