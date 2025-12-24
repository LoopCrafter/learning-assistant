import { ExternalLink } from "lucide-react";

type ContentTabProps = {
  pdfUrl: string;
};
const ContentTab: React.FC<ContentTabProps> = ({ pdfUrl }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
        <span className="text-sm font-medium text-gray-700">
          Document Viewer
        </span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium "
        >
          <ExternalLink width={16} />
          Open in new tab
        </a>
      </div>
      <div className="bg-gray-100 p-1">
        <iframe
          src={pdfUrl}
          className="w-full h-[70vh] bg-white rounded border border-gray-300"
          title="pdf Viewer"
          style={{ colorScheme: "light" }}
        ></iframe>
      </div>
    </div>
  );
};

export default ContentTab;
