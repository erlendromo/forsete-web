// Use native FormData instead of the 'form-data' package
import { config } from "../../config/config.js";
import { ApiEndpoints } from '../../config/constants.js';


/**
 * Upload the image buffer to the ATR service.
 * @param {Buffer} buffer - The image buffer
 * @param {string} filename - The name of the file
 * @returns {Promise<any>} - The response from the ATR API
 */
export const uploadImage = async (buffer: Buffer, filename: string,token :string): Promise<any> => {
  const formData = new FormData();
  
  // Append the buffer directly as 'image'
  const blob = new Blob([buffer], { type: 'image/png' });
  formData.append('images', blob, filename);
  // Send the FormData to the ATR API
  const response = await fetch(config.urlBackend + ApiEndpoints.UPLOAD_IMAGE_ENDPOINT, {
    method: 'POST',
    body: formData,
    headers: {
    
      'Authorization': `Bearer ${token}`
    },
  });
  
  const responseData = await response.json();
  return responseData;
};

export const getImageByID = async (imageID: string, token: string): Promise<any> => {
  console.log("Fetching image with ID:", imageID);
  const url = config.urlBackend + ApiEndpoints.IMAGE_LIST_ENDPOINT + imageID + '/data/';
  const response = await fetch(url , {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  
  const responseData = await response.blob();
  return responseData;
};

export const getImages = async (token: string): Promise<any> => {
  const response = await fetch(config.urlBackend + ApiEndpoints.IMAGE_LIST_ENDPOINT, {
    method: 'GET',
    headers: {
    
        'Authorization': `Bearer ${token}`
      },
    });
    
    const responseData = await response.json();
    return responseData;
  };