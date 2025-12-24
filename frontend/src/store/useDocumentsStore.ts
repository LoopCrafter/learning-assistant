import type { Document } from "@src/types/document";
import { API_Paths } from "@src/utils/apiPath";
import Api from "@src/utils/axiosInstance";
import { toast } from "react-toastify";
import { create } from "zustand";

type DocumentStore = {
  documents: Document[];
  getDocuments: () => Promise<void>;
  loadingFetchingDocuments: boolean;
  errorFetchingDocuments: string | null;
  uploadDocument: (formData: FormData) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  getDocumentDetail: (documentId: string) => Promise<Document | undefined>;
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  loadingFetchingDocuments: false,
  errorFetchingDocuments: null,
  getDocuments: async () => {
    try {
      set({ loadingFetchingDocuments: true });
      const result = await Api(API_Paths.DOCUMENTS.GET_DOCUMENTS);
      set({ documents: result.data });
    } catch (error) {
      set({ errorFetchingDocuments: "Something went wrong" });
    } finally {
      set({ loadingFetchingDocuments: false });
    }
  },
  uploadDocument: async (formData) => {
    try {
      await Api.post(API_Paths.DOCUMENTS.UPLOAD_DOCUMENTS, formData);
      await get().getDocuments();
    } catch (error) {}
  },
  deleteDocument: async (documentId: string) => {
    try {
      await Api.delete(API_Paths.DOCUMENTS.DELETE_DOCUMENT(documentId));
      toast.success("Docuemnt has been removed successfully!");
      await get().getDocuments();
    } catch (error) {}
  },
  getDocumentDetail: async (documentId: string) => {
    try {
      const result = await Api.get(
        API_Paths.DOCUMENTS.GET_DOCUMENT_BY_ID(documentId)
      );
      return result.data;
    } catch (error) {}
  },
}));
