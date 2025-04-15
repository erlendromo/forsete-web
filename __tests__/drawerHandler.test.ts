import { getModelNames } from '../src/index/drawerHandler';
import { loadTestFile } from '../src/mocks/mockutil';
import { workDirPath } from '../src/mocks/mockutil';
const axios = require('axios');
const exampleUrl = ""
jest.mock('axios');

// Positive test
it('returns the name of all the models', async () => {

    const json = 
      {
        "line_segmentation_models": [
          {
            "name": "yolov9-lines-within-regions-1"
          }
        ],
        "text_recognition_models": [
          {
            "name": "TrOCR-norhand-v3"
          }
        ]
      }
//const jsonString = JSON.stringify(json);
//const base64Data = btoa(jsonString); // Use Buffer.from(jsonString).toString('base64') in Node.js
//const dataURL = `data:application/json;base64,${base64Data}`;
  // date = [data]
  const modelNames = await getModelNames(json);
  expect(modelNames).toEqual([
    {
      name: 'yolov9-lines-within-regions-1',
      type: 'line_segmentation_models',
      readableType: 'Line segmentation models'
    },
    {
      name: 'TrOCR-norhand-v3',
      type: 'text_recognition_models',
      readableType: 'Text recognition models'
    }
  ]);
});

// negative tests
it('throws an error when no model arrays are found', async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        unrelatedProperty: "someValue"
      }
    ]
  });

  await expect(getModelNames(Date)).rejects.toThrow('No models found.');
});