import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import FormData from 'form-data';



/**
 * Processes an image using the specified models and saves the result to a temporary file
 */
export async function processImage(options: ATRPiplineConfig): Promise<ATRPiplineProcessResult> {
  const {
    imagePath,
    models,
    apiEndpoint,
    apiKey,
    timeoutMs = 5 * 60 * 1000, // Default timeout: 5 minutes
    onProgress
  } = options;
  
  try {
    // Validate inputs
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    
    if (models.length === 0) {
      throw new Error('At least one model name must be provided');
    }
    
    // Create form data with the image file
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    // Add each model name to the form data
    models.forEach((model) => {
      formData.append(model.modelType, model.modelName);
    });
    
    // Prepare request headers
    const headers: Record<string, string> = {
      ...formData.getHeaders()
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    // Make the request with progress monitoring
    const response = await axios.post(apiEndpoint, formData, {
      headers,
      timeout: timeoutMs,
      responseType: 'json',
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
    
    const tempFilePath = path.join(
      os.tmpdir(),
      `atr-result-${path.parse(path.basename(imagePath)).name}.json`
    );

    // Write the response data to the temporary file
    fs.writeFileSync(
      tempFilePath,
      JSON.stringify(response.data, null, 2),
      'utf8'
    );
    
    return {
      success: true,
      resultFilePath: tempFilePath,
      data: response.data as ATRResult
    };
  } catch (error) {
    // Handle errors
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    console.error('Error processing image:', errorMessage);
    
    return {
      success: false,
      resultFilePath: '',
      error: errorMessage
    };
  }
}