import { handleRequestError } from '../../utils/error-handling';
import atrApi from '../../config/apiConfig';
import { ApiEndpoints } from '../../config/constants';
import { ImageProcessingConfig } from '../../interfaces/configInterface';

/**
 * Sends an ATR request using provided image, models, and fields.
 */
export const postATRRequest = async (
  config: ImageProcessingConfig
): Promise<any> => {
  try {
    const response = await atrApi.post(ApiEndpoints.ATR_ENDPOINT, config, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials : true,
      timeout: 60000,
      maxContentLength: 100 * 1024 * 1024, // 100 MB
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