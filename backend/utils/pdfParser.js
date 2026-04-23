import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

/**
 * Extracts text content from a PDF file.
 * @params {string} filepath - Path to file
 * @returns {Promise<{text: string,numPages: number}>}
 */

export const extractTextFromPDF = async (filepath) => {
    try{
        const dataBuffer = await fs.readFile(filepath);
        //pdf-parse expects a Uint8Array, not a Buffer
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();
        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info
        }
}catch(error){
    console.error("PDF parsing Error:", error);
    throw new Error("Failed to parse PDF file");
}
};