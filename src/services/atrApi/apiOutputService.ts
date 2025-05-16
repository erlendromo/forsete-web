import { outputEndpointConstructor, outputDataEndpointConstructor } from '../../config/util.js';
import { config } from "../../config/config.js";
import { ATRResult } from '../../interfaces/atrResult.types.js';

/**
 * Retrieves outputs from the API for a specific image using a bearer token for authentication.
 * 
 * @param imageID - The unique identifier of the image to get outputs for
 * @param token - The authentication token to be used as a bearer token
 * @returns A promise that resolves to the output data for the specified image
 * @throws Will throw an error if the fetch request fails or if the response cannot be parsed as JSON
 */
export const getOutputs = async (imageID: string, token: string): Promise<any> => {
  const response = await fetch(config.urlBackend + outputEndpointConstructor(imageID), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  const data = await response.json();
  return data
};

/**
 * Retrieves specific output data for a given image and output ID from the ATR-API.
 * 
 * @param {string} imageID - The ID of the image to retrieve output for
 * @param {string} outputID - The ID of the specific output to retrieve
 * @param {string} token - Authentication token for API access
 * @returns {Promise<any>} A promise that resolves to the output data
 * @throws {Error} If the API request fails
 */
export const getOutput = async (imageID: string, outputID: string, token: string): Promise<any> => {
  const response = await fetch(config.urlBackend + outputEndpointConstructor(imageID) + outputID, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  return await response.json();
};

/**
 * Updates an existing output for a specific image using the ATR-API
 * 
 * @param imageID - The ID of the image to update the output for
 * @param outputID - The ID of the output to update
 * @param jsonReq - The ATR result data to update with
 * @param token - Authentication token for the API request
 * @returns Promise containing the JSON response from the API
 * @throws Will throw an error if the network request fails
 */
export const putOutput = async (imageID: string, outputID: string, jsonReq: ATRResult, token: string): Promise<any> => {
  const response = await fetch(config.urlBackend + outputEndpointConstructor(imageID) + outputID + '/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jsonReq),
    credentials: 'include',
  });

  return await response.json();
};

/**
 * Fetches output data from the API using image and output IDs.
 * 
 * @param imageID - The ID of the image to get output data for
 * @param outputID - The ID of the specific output to retrieve
 * @param token - Authentication token for API access
 * @returns Promise that resolves to the output data from the API
 * @throws {Error} If the network request fails or returns invalid JSON
 */
export const getOutputData = async (imageID: string, outputID: string, token: string): Promise<any> => {
  const outputUrl = config.urlBackend + outputDataEndpointConstructor(imageID, outputID);
  const response = await fetch(outputUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  return await response.json();
};