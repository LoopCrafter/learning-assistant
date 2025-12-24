import { useAuthStore } from "@src/store/useAuthStore";
import { useChatStore } from "@src/store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ChatTab = () => {
  const getChatHistory = useChatStore((state) => state.getChatHistory);
  const { id: documentId } = useParams();
  const user = useAuthStore((state) => state.user);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineLoading, setInlineLoading] = useState(false);
  const messageEndRef = useRef<HTMLElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async (documentId: string) => {
      try {
        const response = await getChatHistory(documentId);
        console.log(response);
        //setHistory(response);
      } catch (error) {}
    };
    if (documentId) {
      fetchChatHistory(documentId);
    }
  }, [getChatHistory, documentId]);

  return <div>ChatTab</div>;
};

export default ChatTab;
