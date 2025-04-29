import { fromPath } from "pdf2pic";
import path from "path";

const options = {
    density: 100,
    saveFilename: "untitled",
    saveDirectory: "./uploads/",
    format: "png",
    width: 600,
    height: 600
};

/**
 * Convert a single page of a PDF to an image.
 *
 * @param pdfFilePath - Absolute or relative path to the PDF file.
 * @param pages  - 1-based index of the page to convert.
 * @returns A promise resolving to the conversion result, including the output file path.
 * @throws  Will throw if conversion fails.
 */
async function pdfToImage(pdfFilePath:string, pages: number) {
    const absolutePdfPath = path.resolve(options.saveDirectory, pdfFilePath)
    const convert = fromPath(absolutePdfPath, options);
    const pageToConvertAsImage = pages;
    convert(pageToConvertAsImage, { responseType: "image" })
        .then((resolve) => {
            console.log("Page 1 is now converted as image");
            return resolve;
        });
}