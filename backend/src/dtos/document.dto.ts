import { getDocumentById } from "../controllers/document.controllers.js";

export interface uploadDocumentDto {
  title: string;
  description?: string;
  tags?: string[];
  file: File;
}

export interface getDocumentByIdDto {
  id: string;
}
