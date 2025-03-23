import { fromPath } from "pdf2pic";
import fs from "fs";
import path from "path";

describe("PDF to Image Conversion", () => {
  // Define the conversion options
  const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: "./images",
    format: "png",
    width: 600,
    height: 600,
  };

  // Path to a sample PDF that exists for testing.
  // Ensure you have a sample.pdf inside a fixtures folder in your test directory.
  const samplePdfPath = path.resolve(__dirname, "./dummyData.pdf");

  it("should convert the first page of a PDF to an image", async () => {
    const convert = fromPath(samplePdfPath, options);
    const pageToConvertAsImage = 1;

    // Convert the first page and await the result
    const result = await convert(pageToConvertAsImage, { responseType: "image" });

    // Assert that the result is defined and contains a 'path' property
    expect(result).toBeDefined();
    expect(result).toHaveProperty("path");

    // Optionally, verify that the generated file exists on disk
    const imagePath: string = result.path!;
    const fileExists = fs.existsSync(imagePath);
    expect(fileExists).toBe(true);

    // Optional: Clean up generated image file if desired
    // fs.unlinkSync(imagePath);
  });
});
