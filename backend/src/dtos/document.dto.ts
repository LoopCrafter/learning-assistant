export interface uploadDocumentDto {
  title: string;
  description?: string;
  tags?: string[];
  file: File;
}
