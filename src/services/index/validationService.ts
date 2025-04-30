const MAX_MB =  32*1024**2; // 32MB
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/tiff",
  "application/pdf"
] as const;

/**
 * Validates the file size, within the threshold set by "MAX_MB".
 * @param fileSize - The size of the file in bytes.
 * @returns True if the file does not exceed the limit, false otherwise.
 */
export function validateFileSize(fileSize: number): boolean {
  if (fileSize > MAX_MB) {
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
  if (!ALLOWED.includes(fileType as typeof ALLOWED[number])) {
    return false;
  }
  return true;
}