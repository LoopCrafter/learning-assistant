import { useAuthStore } from "@src/store/useAuthStore";
import { useChatStore } from "@src/store/useChatStore";
import { RolesEnum, type Message } from "@src/types/chat";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../common/spinner";

const ChatTab = () => {
  const getChatHistory = useChatStore((state) => state.getChatHistory);
  const chatWithFile = useChatStore((state) => state.chatWithFile);
  const { id: documentId } = useParams();
  const user = useAuthStore((state) => state.user);
  const [history, setHistory] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    const fetchChatHistory = async (documentId: string) => {
      try {
        const response = await getChatHistory(documentId);
        setHistory(response);
      } catch (error) {
      } finally {
        setInitialLoading(false);
      }
    };
    if (documentId) {
      fetchChatHistory(documentId);
    }
  }, [getChatHistory, documentId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      releveantChunks: [],
    };
    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    if (documentId) {
      try {
        const response = await chatWithFile(documentId, message);
        if (response) {
          setHistory((prev) => [...prev, response]);
        }
      } catch (error) {
        const AiError = {
          role: RolesEnum.ASSISTANT,
          content: "Sorry! I encounterd an error. Please try again later.",
          timestamp: new Date().toISOString(),
          releveantChunks: [],
        };
        setHistory((prev) => [...prev, AiError]);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderMessages = () => {
    return "render messages";
  };
  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] items-center gap-4 justify-center bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50">
        <div className="size-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-emerald-600" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="text-sm text-slate-500 mt-3 font-medium  ">
          Loading chat history...
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-y-auto">
      <div className="flex-1 p-6 overflow-auto bg-linear-to-br from-slate-50/50 via-white/50 to-slate-50/50">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/25">
              <MessageSquare
                className="w-8 h-8 text-emerald-600"
                strokeWidth={2}
              />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-slate-500">
              Ask me anything about the document
            </p>
          </div>
        ) : (
          <div className=""></div>
        )}
        <div ref={messageEndRef} />
        {loading && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200/60">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* // Input Area */}
      <div className="p-5 border-t border-slate-200/60 bg-white/80">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/20 "
          />
          <button
            type="submit"
            className="shrink-0 w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
            disabled={loading || !message.trim}
          >
            <Send className="w-5 h-5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
