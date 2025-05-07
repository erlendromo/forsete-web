
import { getImageByID, uploadImage } from '../services/atr-api/apiImageService.js'; 
import { postATRRequest } from '../services/atr-api/apiATRService.js'; 
import { getOutput, getOutputData } from './atr-api/apiOutputService.js';




/**
 * Handle the file transcribing process (e.g., image or PDF).
 * @param {Express.Multer.File} file - The uploaded file in memory
 * @param {string} token - The authentication token
 * @returns {Promise<{ message: string, atrResponse: any }>} - Response from ATR service
 */
async function handleTranscribe(file: Express.Multer.File, token: string): Promise<{atrResponse: any }> {
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
      line_segmentation_model: "yolov9-lines-within-regions-1",
      text_recognition_model: "TrOCR-norhand-v3",
    };
    // Send the ATR processing request with token
    const atrResponse = await postATRRequest(atrConfig, token);

    return atrResponse;

  } catch (err: any) {
    
    throw new Error('Server Error: ' + err.message);
  }
}

 async function handleGetImageFile(image_id: string, token: string): Promise<{ dataUrl:string }> {
  const imageResponse = await getImageByID(image_id, token)
  if (!imageResponse || !imageResponse.buffer || !imageResponse.mimeType) {
    throw new Error('Image not found or invalid response');
}

const base64 = imageResponse.buffer.toString('base64');
const dataUrl = `data:${imageResponse.mimeType};base64,${base64}`;

return { dataUrl };
  
}

async function hadleGetOutputData(imageId: string, outputId: string, token: string): Promise<{ json:string }> {
  const outputResponse = await getOutputData(imageId,outputId, token);
  if (!outputResponse) {
    throw new Error('Output not found or invalid response');
  }
  return outputResponse;
}

export { handleTranscribe, handleGetImageFile, hadleGetOutputData };