
import { getImageByID, uploadImage } from '../services/atr-api/apiImageService.js'; 
import { postATRRequest } from '../services/atr-api/apiATRService.js'; 
import { putOutput, getOutputData, getOutputs } from './atr-api/apiOutputService.js';
import { ATRResult } from '../interfaces/atr-result.js';




/**
 * Handle the file transcribing process (e.g., image or PDF).
 * @param {Express.Multer.File} file - The uploaded file in memory
 * @param {string} token - The authentication token
 * @param {string} textModel - The text recognition model to be used
 * @param {string} lineModel - The line segmentation model to be used
 * @returns {Promise<{ message: string, atrResponse: any }>} - Response from ATR service
 */
async function handleTranscribe(file: Express.Multer.File, token: string, textModel: string, lineModel: string): Promise<{atrResponse: any }> {
  try {
    const imageBuffer = file.buffer; // Get the image buffer from the memory storage
    const filename = file.originalname; // Get the original file name

    // Upload the image to ATR API
    const imageUploadResponse = await uploadImage(imageBuffer, filename, token);
    if (!imageUploadResponse) {
      throw new Error("Failed to upload image");
    }
    let imageIDs: string[] = [];
    if (Array.isArray(imageUploadResponse)) {
      // If it's an array, use map
      imageIDs = imageUploadResponse.map((image: { id: string }) => image.id);
    } else if (imageUploadResponse && typeof imageUploadResponse === 'object') {
      // If it's a single object, just extract the id
      imageIDs = [imageUploadResponse.id];
    } 
    // Prepare ATR request configuration
    const atrConfig = {
      image_ids: imageIDs,
      line_segmentation_model: lineModel,
      text_recognition_model: textModel,
    };
    // Send the ATR processing request with token
    const atrResponse = await postATRRequest(atrConfig, token);

    return atrResponse;

  } catch (err: any) {
    
    throw new Error('Server Error: ' + err.message);
  }
}

 async function handleGetImageFile(image_id: string, token: string): Promise<{ mimeType:any, data: any }> {
  const blob = await getImageByID(image_id, token); // Already a Blob
  const arrayBuffer = await blob.arrayBuffer(); // Convert to ArrayBuffer
  const mimeType = blob.type; // MIME type is part of Blob object
  return { data: arrayBuffer, mimeType };
}




async function hadleGetOutputData(imageId: string, outputId: string, token: string): Promise<{ json:any}> {
  const outputResponse = await getOutputData(imageId,outputId, token);
  if (!outputResponse) {
    throw new Error('Output not found or invalid response');
  }
  return outputResponse;
}

async function handlePostOutputData(SaveDate: any,imageId: string, outputId:string, token: string): Promise<{ json:any}> {
  const outputResponse = await putOutput(imageId,  outputId, SaveDate, token);
  return outputResponse;
}

async function handleGetOutputs( imageId: string, token: string): Promise<{ json:any}> {
  const outputResponse = await getOutputs(imageId, token);
  if (!outputResponse) {
    throw new Error('Output not found or invalid response');
  }

  return outputResponse[0];
}

export { handleTranscribe, handleGetImageFile, hadleGetOutputData, handlePostOutputData, handleGetOutputs };