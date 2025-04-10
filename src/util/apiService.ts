import { loadTestFile } from '../mocks/mockutil';
import { ApiEndpoints } from '../config/endpoint';
import axios from 'axios';

const modelResponse = "src/mocks/modelResponse.json";
const atrResponse = "src/mocks/atrResponse.json";

/**
 * A unified method to fetch data from a specified endpoint.
 *
 * This function performs an HTTP GET request to the provided URL using Axios and automatically
 * returns the parsed JSON data from the response. It assumes that the endpoint returns data
 * in JSON format and that Axios's default transform is sufficient to parse the response.
 *
 * @param {string} url - The URL of the endpoint from which to fetch data.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON data from the response.
 */
export async function fetchEndpoint(url:string) {
  const response = await axios.get(url);
  return response.data;
}

/**
 * A method to fetch mock data or real data based on the boolean useMock.
 * Uses the mock implementation when USE_MOCK is true.
 */
export async function handleApiOrMock(url:string, useMock:boolean) {
  if (useMock) {
    return handleMockEndpoints(url);
  } else {
    // Call the external API
    return fetchEndpoint(url);
  }
}

/**
 * A method to handle the different mock endpoints.
 */
export async function handleMockEndpoints(url:string) {
  const errorMsg = "No matching mocking endpoint.";
  if (url.endsWith(ApiEndpoints.MODEL_ENDPOINT)) {
    return loadTestFile(modelResponse);
  } else if (url.endsWith(ApiEndpoints.ATR_ENDPOINT)) {
    return loadTestFile(atrResponse);
  } else {
    throw new Error(errorMsg);
  }
}
