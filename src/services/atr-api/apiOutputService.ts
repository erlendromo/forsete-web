import { outputEndpointConstructor, outputDataEndpointConstructor } from '../../config/constants.js';
import { config } from "../../config/config.js";
import { url } from 'inspector';

export const getOutputs = async (imageID: string, token: string): Promise<any> => {
  const response = await fetch(config.urlBackend + outputEndpointConstructor(imageID), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to get outputs: ${response.statusText}`);
  return await response.json();
};

export const getOutput = async (imageID: string, outputID: string, token: string): Promise<any> => {
  const response = await fetch(outputEndpointConstructor(imageID) + outputID, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to get output: ${response.statusText}`);
  return await response.json();
};

export const putOutput = async (imageID: string, outputID: string, jsonReq: object, token: string): Promise<any> => {
  const response = await fetch(outputEndpointConstructor(imageID) + outputID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jsonReq),
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to update output: ${response.statusText}`);
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
  if (!response.ok) throw new Error(`Failed to get output data: ${response.statusText}`);
  return await response.json();
};