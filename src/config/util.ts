import { ApiEndpoints } from "./constants";

/**
 * Constructs the endpoint URL for accessing outputs of a specific image.
 *
 * @param {string} imageID - The unique identifier for the image.
 * @returns {string} - The full URL endpoint for retrieving outputs related to the specified image.
 */
export function outputEndpointConstructor(imageID: string): string {
  return ApiEndpoints.VERSION_ATR + 'images/' + imageID + '/outputs/';
}

/**
 * Constructs the URL for accessing the data of a specific output belonging to an image.
 *
 * @param {string} imageID - The unique identifier for the image.
 * @param {string} outputID - The unique identifier for the output.
 * @returns {string} - The full URL endpoint for retrieving data related to the specified output.
 */
export function outputDataEndpointConstructor(imageID: string, outputID: string): string {
  return outputEndpointConstructor(imageID) + outputID + '/data/';
}