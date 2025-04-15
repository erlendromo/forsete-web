import { fromPath } from "pdf2pic";
import fs from "fs";
import path from "path";
import { getPdfSize } from '../src/util/pdfUtils';



describe('getPdfSize', () => {
  it('should return the correct dimensions for the first page of the PDF', async () => {
    // Setup
    const pdfPath = path.resolve(__dirname, 'testData', 'dummyData.pdf');
    const size = await getPdfSize(pdfPath);
    const ratio = size.height / size.width;

    // Basic assertions: check that properties exist.
    expect(size).toHaveProperty('width');
    expect(size).toHaveProperty('height');
    // Ratio for 'A4' page. 
    expect(ratio).toBeCloseTo(1.414);
    // Negative test, with arbitrary
    expect(ratio).not.toBeCloseTo(3);
  });
});

describe("PDF to Image Conversion", () => {

  // Path to a sample PDF that exists for testing.
  // Ensure you have a sample.pdf inside a fixtures folder in your test directory.

  it("should convert the first page of a PDF to an image", async () => {
    // Setup
    const pdfPath = path.resolve(__dirname, 'testData', 'dummyData.pdf');
    const size = await getPdfSize(pdfPath);

    // Define the conversion options
    const options = {
      density: 100,
      saveFilename: "dummyData",
      savePath: "./__tests__/testData/images",
      format: "png",
      width: size.width,
      height: size.height,
    };
    const convert = fromPath(pdfPath, options);
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
