import Button from "@src/components/common/Button";
import PageTitle from "@src/components/common/PageTitle";
import Spinner from "@src/components/common/spinner";
import DocumentCard from "@src/components/documents/DocumentCard";
import UploadDocumentModal from "@src/components/documents/UploadDocumentModal";
import { useDocumentStore } from "@src/store/useDocumentsStore";
import type { Document } from "@src/types/document";
import { FileText, Plus, Trash, X } from "lucide-react";
import { Activity, useEffect, useState } from "react";

const DocumentListPage = () => {
  const getDocuments = useDocumentStore((state) => state.getDocuments);
  const loadingFetchingDocuments = useDocumentStore(
    (state) => state.loadingFetchingDocuments
  );
  const errorFetchingDocuments = useDocumentStore(
    (state) => state.errorFetchingDocuments
  );
  const documents = useDocumentStore((state) => state.documents);
  const deleteDocumentById = useDocumentStore((state) => state.deleteDocument);
  // states for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // states for deleting confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    getDocuments();
  }, []);

  const handleDeleteRequest = async (doc: Document) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await deleteDocumentById(selectedDoc._id);
    } catch (e) {
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const renderContent = () => {
    if (loadingFetchingDocuments)
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    if (errorFetchingDocuments) return <div>{errorFetchingDocuments}</div>;
    if (documents?.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-8">
              <FileText
                className="w-10 h-10 text-slate-400"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2 tracking-tight">
              No Documents Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Get Started by uploading your first PDF document to start
              learning.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={() => handleDeleteRequest(doc)}
          />
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen ">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size[16px_16px] opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <PageTitle
            title="My Documents"
            subtitle="Manage and Organize your learning materials"
          />
          {documents?.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>
        {renderContent()}
      </div>
      <Activity mode={isUploadModalOpen ? "visible" : "hidden"}>
        <UploadDocumentModal
          toggleUploadModal={(state: boolean) => setIsUploadModalOpen(state)}
        />
      </Activity>
      <Activity mode={isDeleteModalOpen ? "visible" : "hidden"}>
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/50 backdrop-blur-sm ">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">
            <button
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-r from-red-100 to-red-200 flex items-center justify-center mb-4">
                <Trash className="w-6 h-6 text-red-600" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete the document:{" "}
              <span className="font-semibold text-slate-900">
                {selectedDoc?.title}
              </span>{" "}
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleConfirmDelete}
                className="flex-1 h-11 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
};

export default DocumentListPage;
