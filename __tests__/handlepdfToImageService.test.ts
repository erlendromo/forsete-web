import path from 'path';
import fs from 'fs';
import { pdfBufferToPngBuffer } from '../src/services/index/handlepdfToImageService';

describe(' pdfBufferToPngBuffer ', () => {
  it('converts PDF to PNG buffer', async () => {
    const pdf = path.resolve(__dirname, 'testData', 'dummyData.pdf');
    const pdfBuffer = fs.readFileSync(pdf);
    const result = await pdfBufferToPngBuffer(pdfBuffer);
    // Check if the result is a Buffer and has a non-zero length
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(100);
  });
});