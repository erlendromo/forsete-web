import axios from 'axios';
import { handleMockEndpoints } from '../src/util/apiService'; 
import { fetchEndpoint } from '../src/util/apiService'; 
import { handleApiOrMock } from '../src/util/apiService'; 
import { ApiEndpoints } from '../src/config/endpoint'; 
import { ImageData } from '../src/interfaces/htrInterface';
import { Models } from '../src/interfaces/modelInterface';

import { loadTestFile } from '../src/mocks/mockutil';

// Use mock data
jest.mock('axios');
jest.mock('../src/mocks/mockutil');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLoadTestFile = loadTestFile as jest.Mock;

describe('API Handler Functions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('fetchEndpoint', () => {
    it('should call axios.get and return response data', async () => {
      // Arrange: define expected data and set axios.get to return it.
      const expectedData = { id: 1, name: 'Test Data' };
      mockedAxios.get.mockResolvedValueOnce({ data: expectedData });
      
      // Act: call fetchEndpoint with a test URL.
      const result = await fetchEndpoint<typeof expectedData>('http://example.com/api/data');
      
      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('http://example.com/api/data');
      expect(result).toEqual(expectedData);
    });
  });

  describe('handleApiOrMock', () => {
    it('should call handleMockEndpoints when useMock is true', async () => {
      // Arrange: Create dummy mock data.
      const mockData: Models = {
        line_segmentation_models: [{ name: "MockLineModel" }],
        text_recognition_models: [{ name: "MockTextModel" }],
        region_segmentation_models: [{ name: "MockRegionModel" }]
      };

      // Make the loadTestFile mock resolve to our dummy mock data.
      mockedLoadTestFile.mockReturnValueOnce(mockData);
      const testUrl = `http://example.com${ApiEndpoints.MODEL_ENDPOINT}`;
      const result = await handleApiOrMock(testUrl, true);

      // Assert: should return our dummy mock data.
      expect(result).toEqual(mockData);
      // Ensure loadTestFile was called with the correct file path.
      expect(mockedLoadTestFile).toHaveBeenCalledWith("src/mocks/modelResponse.json");
    });

    it('should call fetchEndpoint when useMock is false', async () => {
      
    });
  });

  describe('handleMockEndpoints', () => {
    it('should return model data for MODEL_ENDPOINT', async () => {
      // Arrange
      const mockModelData: Models = {
        line_segmentation_models: [{ name: "Model1" }],
        text_recognition_models: [{ name: "Model2" }],
        region_segmentation_models: [{ name: "Model3" }]
      };
      mockedLoadTestFile.mockReturnValueOnce(mockModelData);
      const testUrl = `http://example.com${ApiEndpoints.MODEL_ENDPOINT}`;
      const result = await handleMockEndpoints(testUrl);

      // Assert
      expect(result).toEqual(mockModelData);
      expect(mockedLoadTestFile).toHaveBeenCalledWith("src/mocks/modelResponse.json");
    });

    it('should return image data for ATR_ENDPOINT', async () => {
      
    });
  });
});