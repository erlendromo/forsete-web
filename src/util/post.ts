import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';


export async function sendATRRequest(
  url: string,
  imagePath: string,
  models: {
    lineSegmentationModel: string;
    textRecognitionModel: string;
  },
  additionalFields: Record<string, string | number | boolean> = {}
) {
  // Create FormData instance
  const formData = new FormData();
  
  // Add image file
  formData.append('image', fs.createReadStream(imagePath));
  
  // Add model selections
  formData.append('line_segmentation_model', models.lineSegmentationModel);
  formData.append('text_recognition_model', models.textRecognitionModel);
  
  // Add any additional fields
  Object.entries(additionalFields).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  
  try {
    // Send the request
    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );
    
    // Store both the original and current version
    const originalResponse = JSON.parse(JSON.stringify(response.data));
    
    return {
      original: originalResponse,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}