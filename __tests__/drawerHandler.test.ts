import { getModelNames } from '../src/ts/index/drawerHandler';
const axios = require('axios');

jest.mock('axios');

it('returns the name of all the models', async () => {
  axios.get.mockResolvedValue({
    data: [
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
    ]
  });

  const modelNames = await getModelNames();
  expect(modelNames).toEqual([
    'yolov9-lines-within-regions-1',
    'TrOCR-norhand-v3'
  ]);
});


