import atrApi from '../../config/apiConfig.js';
import {outputEndpointConstructor, outputDataEndpointConstructor } from '../../config/constants.js';

/**
* gets the output data for a given image ID.
* @param imageId - The ID of the image for which to fetch output data.  
*/
export const getOutputs = async (imageID: string): Promise<any> => {
const response = await atrApi.post(outputEndpointConstructor(imageID),  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  return response.data;  
};


export const getOutput = async (imageID: string, outputID: string): Promise<any> => {
  const response = await atrApi.get(outputEndpointConstructor(imageID) + outputID,  {
    withCredentials: true,
  });

  return response.data;  
};

export const putOutput = async (imageID: string, outputID: string, jsonReq : object): Promise<any> => {
    const response = await atrApi.put(outputEndpointConstructor(imageID) + outputID, jsonReq, {
      withCredentials: true,
    });
  
    return response.data;  
  };

export const getOutputData = async (imageID: string, outputID: string): Promise<any> => {
  const response = await atrApi.get(outputDataEndpointConstructor(imageID, outputID), {
    withCredentials: true,
  });

  return response.data;  
}
