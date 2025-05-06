import { outputEndpointConstructor, outputDataEndpointConstructor } from '../../config/constants.js';
import { config } from "../../config/config.js";

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

export const getOutput = async (imageID: string, outputID: string): Promise<any> => {
  const response = await fetch(outputEndpointConstructor(imageID) + outputID, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to get output: ${response.statusText}`);
  return await response.json();
};

export const putOutput = async (imageID: string, outputID: string, jsonReq: object): Promise<any> => {
  const response = await fetch(outputEndpointConstructor(imageID) + outputID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonReq),
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to update output: ${response.statusText}`);
  return await response.json();
};

export const getOutputData = async (imageID: string, outputID: string): Promise<any> => {
  const response = await fetch(outputDataEndpointConstructor(imageID, outputID), {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to get output data: ${response.statusText}`);
  return await response.json();
};