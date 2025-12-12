import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

type Parser = {
  numpages: number;
  numrender: number;
  info: object;
  metadata: object;
  text: string;
  version: string;
};

export const extractTextFromPdf = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const data: Parser = await parser.getText();
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.log(`Error reading PDF file: ${error}`);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
};
