import {AllowedMimeType,MAX_FILE_SIZE} from "../../config/constants.js"

/**
 * Validates the file size, within the threshold set by "MAX_MB" or checks if the file 
 * size is smaller than 0 or equal to 0.
 * @param fileSize - The size of the file in bytes.
 * @returns True if the file does not exceed the limit, false otherwise.
 */
export function validateFileSize(fileSize: number): boolean {
    // Check if the file size is greater than 0 and less than or equal to MAX_MB
  if (fileSize > MAX_FILE_SIZE || fileSize <= 0) {
    return false;
  }
  return true;
}

/**
 * Validates the file type against a list of allowed MIME types.
 * @param fileType - The MIME type of the file.
 * 
 * @returns True if the file type is valid, false otherwise.
 */
export function validateFileType(fileType: string): boolean {
   return (Object.values(AllowedMimeType) as string[]).includes(fileType);
}