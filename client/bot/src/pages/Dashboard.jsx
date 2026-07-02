import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import "../styles/dashboard.css";
import { useState } from "react";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const userName = localStorage.getItem("userName") || "User";

  return (
    <div className="dashboard">
      {/* Sidebar overlay backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <Sidebar
        history={history}
        setHistory={setHistory}
        setSelectedConversation={setSelectedConversation}
        setMessages={setMessages}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="chat-board">
        <ChatWindow
          messages={messages}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          userName={userName}
          isThinking={isThinking}
        />

        <ChatInput
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          setHistory={setHistory}
          setMessages={setMessages}
          setIsThinking={setIsThinking}
        />
      </main>
    </div>
  );
}

export default Dashboard;
