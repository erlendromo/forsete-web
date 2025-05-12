import { outputEndpointConstructor, outputDataEndpointConstructor } from '../../config/constants.js';
import { config } from "../../config/config.js";
import { ATRResult } from '../../interfaces/atr-result.js';

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