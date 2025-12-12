import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

type TextResult = {
  text: string;
};

type InfoResult = {
  total: number;
  info?: object;
  pages?: Array<object>;
};

export const extractTextFromPdf = async (
  filePath: string
): Promise<{
  text: string;
  numPages: number;
  info?: object;
}> => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const textResult: TextResult = await parser.getText();
    const infoResult: InfoResult = await parser.getInfo();

    return {
      text: textResult.text,
      numPages: infoResult.total,
      info: infoResult.info ?? {},
    };
  } catch (error) {
    console.log(`Error reading PDF file: ${error}`);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
};
