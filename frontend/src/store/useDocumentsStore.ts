import type { Document } from "@src/types/document";
import { API_Paths } from "@src/utils/apiPath";
import Api from "@src/utils/axiosInstance";
import { create } from "zustand";

type DocumentStore = {
  documents: Document[];
  getDocuments: () => Promise<void>;
  loadingFetchingDocuments: boolean;
  errorFetchingDocuments: string | null;
  uploadDocument: (formData: FormData) => Promise<void>;
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
}));
