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
): Promise<any> {
  // Create FormData instance
  const formData = new FormData();
  
  try {
    // Validate file exists before creating read stream
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File does not exist: ${imagePath}`);
    }
    
    // Add image file
    formData.append('image', fs.createReadStream(imagePath));
    
    // Add model selections
    formData.append('line_segmentation_model', models.lineSegmentationModel);
    formData.append('text_recognition_model', models.textRecognitionModel);
    
    // Add any additional fields
    Object.entries(additionalFields).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    console.log("Sending request to ATR service...");
    
    // Add timeout to prevent hanging requests
    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 60000, // 1 minute timeout
        maxContentLength: 100 * 1024 * 1024 // Allow large responses (100MB)
      }
    );
    
    // Validate response has data
    if (!response.data) {
      throw new Error('Empty response received from ATR service');
    }
    
    // Store the response data
    const atrJson = response.data;
    
    return atrJson;
  } catch (error: any) {
    console.error('Error in sendATRRequest:', error.message);
    
    // Improve error details
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('ATR service error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from ATR service');
    }
    
    // Rethrow with more context
    throw error;
  }
}

// Helper function to save JSON to file with error handling
export function saveJsonToFile(data: any, filePath: string): void {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2),
      'utf8'
    );
    console.log(`JSON data saved to ${filePath}`);
  } catch (error) {
    console.error(`Error saving JSON to ${filePath}:`, error);
    // Don't throw here - we don't want to fail the response if just the save fails
  }
}