import PageTitle from "@src/components/common/PageTitle";
import Spinner from "@src/components/common/spinner";
import Tabs from "@src/components/common/Tabs";
import AiActions from "@src/components/documents/AiActions.Tab";
import Chat from "@src/components/documents/Chat.Tab";
import Content from "@src/components/documents/Content.Tab";
import Quizzes from "@src/components/documents/Quizzes.tab";
import FlashcardsManager from "@src/components/flashcards/FlashcardsManager";
import { useDocumentStore } from "@src/store/useDocumentsStore";
import type { Document } from "@src/types/document";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DocumentDetailPage = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState("Content");
  const [loading, setLoading] = useState(false);
  const getDocumentDetail = useDocumentStore(
    (state) => state.getDocumentDetail
  );
  const { id } = useParams();
  useEffect(() => {
    const getDocument = async (id: string) => {
      setLoading(true);
      try {
        const result = await getDocumentDetail(id);
        if (result) {
          setDocument(result);
        }
      } catch (err) {
        console.error("Failed to fetch document", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getDocument(id);
    }
  }, [id, getDocumentDetail]);

  const getPdfUrl = () => {
    if (!document?.filePath) return null;
    const filePath = document.filePath;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const pdfUrl = getPdfUrl() ?? "";
  const tabs = [
    {
      name: "Content",
      label: "Content",
      content: <Content pdfUrl={pdfUrl} />,
    },
    {
      name: "Chat",
      label: "Chat",
      content: <Chat />,
    },
    {
      name: "AI Actions",
      label: "AI Actions",
      content: <AiActions />,
    },
    {
      name: "Flashcards",
      label: "Flashcards",
      content: <FlashcardsManager documentId={id} />,
    },
    {
      name: "Quizzes",
      label: "Quizzes",
      content: <Quizzes />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (!document || !document.filePath) {
    return <div className="text-center p-8">PDF not available</div>;
  }
  return (
    <div className="">
      <div className="">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
        >
          <ArrowLeft className="" size={16} /> Back to Documents
        </Link>
      </div>
      <PageTitle title={document?.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;
