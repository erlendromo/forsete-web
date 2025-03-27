import { fromPath } from "pdf2pic";

const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: "./__tests__",
    format: "png",
    width: 600,
    height: 600
};

// Path to image
// Number of pages
async function pdfToImage(pages: number) {
    const convert = fromPath("./__tests__/dummyData.pdf", options);
    const pageToConvertAsImage = pages;
    convert(pageToConvertAsImage, { responseType: "image" })
        .then((resolve) => {
            console.log("Page 1 is now converted as image");

            return resolve;
        });
}