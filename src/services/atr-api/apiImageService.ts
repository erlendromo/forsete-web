import atrApi from '../../config/apiConfig.js';
import { ApiEndpoints } from '../../config/constants.js';

export const uploadImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await atrApi.post(ApiEndpoints.UPLOAD_IMAGE_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  return response.data;  
};

export const getImages = async (): Promise<any> => {
  const response = await atrApi.get(ApiEndpoints.IMAGE_LIST_ENDPOINT, {
    withCredentials: true,
  });

  return response.data;  
};

export const getImagebyID = async (imageId: string): Promise<any> => {
  const response = await atrApi.get(ApiEndpoints.IMAGE_LIST_ENDPOINT + imageId, {
    withCredentials: true,
  });

  return response.data;  
};