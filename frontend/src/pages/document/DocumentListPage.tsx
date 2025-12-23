import Button from "@src/components/common/Button";
import PageTitle from "@src/components/common/PageTitle";
import Spinner from "@src/components/common/spinner";
import { useDocumentStore } from "@src/store/useDocumentsStore";
import type { Document } from "@src/types/document";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { set } from "zod";

const DocumentListPage = () => {
  const getDocuments = useDocumentStore((state) => state.getDocuments);
  const loadingFetchingDocuments = useDocumentStore(
    (state) => state.loadingFetchingDocuments
  );
  const errorFetchingDocuments = useDocumentStore(
    (state) => state.errorFetchingDocuments
  );
  const documents = useDocumentStore((state) => state.documents);

  // states for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // states for deleting confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    getDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploadFile(file);
    setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUpload = async () => {};

  const handleDeleteRequest = async (doc: Document) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDoc) return;
    setDeleting(true);
    setIsDeleteModalOpen(true);
    try {
    } catch (e) {
      setDeleting(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  if (loadingFetchingDocuments) return <Spinner />;
  if (errorFetchingDocuments) return <div>{errorFetchingDocuments}</div>;
  const renderContent = () => {
    return <div>Render Content</div>;
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
              <Plus className="" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DocumentListPage;
