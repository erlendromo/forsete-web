import fs from 'fs';
import { fromPath } from "pdf2pic";
import { PDFDocument, sizeInBytes } from 'pdf-lib';

interface PdfSize {
    height: number;
    width: number;
}

// Path to image
// Number of pages
export async function pdfToImage(pages: number, name: string, path: string, density:number) {
    const size = await getPdfSize(path);
    const options = {
        density: density,
        saveFilename: name,
        savePath: "./uploads",
        format: "png",
        width: size.width,
        height: size.height
    };

    const convert = fromPath(path, options);
    const pageToConvertAsImage = pages;
    convert(pageToConvertAsImage, { responseType: "image" })
        .then((resolve) => {
            console.log("Page 1 is now converted as image");
            return resolve;
        });
}

export async function getPdfSize(pdfPath: string): Promise<PdfSize> {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    return { height, width };
}