//function to load images from the uploads folder
export async function loadUploadedImage(filename: string, imageElementId: string): Promise<void> {
  return new Promise((resolve, reject) => {
      const imageElement = document.getElementById(imageElementId) as HTMLImageElement;
      if (!imageElement) {
          reject(new Error(`Image element with ID '${imageElementId}' not found`));
          return;
      }

      // Direct path to the uploaded file (no extension needed)
      const imagePath = `/uploads/${filename}`;
      
      // Set the image source
      imageElement.src = imagePath;
      
      // Handle load and error events
      imageElement.onload = () => {
          console.log(`Image loaded successfully: ${imagePath}`);
          resolve();
      };
      
      imageElement.onerror = () => {
          console.error(`Failed to load image: ${imagePath}`);
          // Set a fallback image if the main image fails to load
          imageElement.src = '/images/image-placeholder.png'; // Make sure you have this fallback image
          reject(new Error(`Failed to load image: ${imagePath}`));
      };
  });
}