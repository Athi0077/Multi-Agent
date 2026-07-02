import { useState } from "react";
import { sendMessage, startConversation } from "../services/chatService";

function ChatInput({
  selectedConversation,
  setSelectedConversation,
  setHistory,
  setMessages,
  setIsThinking,
}) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedBot, setSelectedBot] = useState("auto");

  const handleSend = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setIsThinking(true);

    try {
      let conversation = selectedConversation;

      if (!conversation) {
        const data = await startConversation();
        conversation = data.conversation;
        setSelectedConversation(conversation);
        setHistory((currentHistory) => [conversation, ...currentHistory]);
      }

      const payload = {
        conversationId: conversation._id,
        message: text,
      };

      if (selectedBot && selectedBot !== "auto") {
        payload.botId = Number(selectedBot);
      }

      const response = await sendMessage(payload);

      setMessages(response.messages);
      const updatedTitle = response.conversation?.title || conversation.title;

      setSelectedConversation((currentConversation) => {
        if (!currentConversation || currentConversation._id !== conversation._id) {
          return currentConversation;
        }

        return {
          ...currentConversation,
          title: updatedTitle,
        };
      });

      setHistory((currentHistory) => {
        const existing = currentHistory.find((item) => item._id === conversation._id);
        if (!existing) {
          return [{ ...conversation, title: updatedTitle }, ...currentHistory];
        }

        return currentHistory.map((item) => {
          if (item._id !== conversation._id) {
            return item;
          }

          return {
            ...item,
            title: updatedTitle,
          };
        });
      });
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err.message);
    } finally {
      setIsSending(false);
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSending) {
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <select
        value={selectedBot}
        onChange={(e) => setSelectedBot(e.target.value)}
        aria-label="Select bot"
        className="bot-select"
      >
        <option value="auto">Auto</option>
        <option value="1">Bot1</option>
        <option value="2">Bot2</option>
        <option value="3">Bot3</option>
        <option value="4">Bot4</option>
      </select>

      <div className="chat-input-field-wrap">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isSending ? "Thinking..." : "ask anything..."}
          id="chat-input-field"
          className="chat-input-field"
          disabled={isSending}
        />
      </div>
      <button
        className="send-btn"
        aria-label="Send message"
        disabled={isSending}
        onClick={handleSend}
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}

export default ChatInput;
