import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  getConversation,
  getHistory,
  startConversation,
  renameConversation,
  deleteConversation,
} from "../services/chatService";

function Sidebar({ history, setHistory, setSelectedConversation, setMessages, isOpen, onClose }) {
  const navigate = useNavigate();
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const menuRef = useRef(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data.conversations || []);
      } catch (err) {
        console.error("Failed to load history:", err.response?.data || err.message);
      }
    };

    loadHistory();
  }, [setHistory]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const handleNewChat = async () => {
    try {
      const data = await startConversation();

      setHistory((currentHistory) => [data.conversation, ...currentHistory]);
      setSelectedConversation(data.conversation);
      setMessages(data.conversation.messages || []);
      onClose();
    } catch (err) {
      console.error("Failed to start chat:", err.response?.data || err.message);
    }
  };

  const loadConversation = async (id) => {
    try {
      const data = await getConversation(id);

      setSelectedConversation(data.conversation);
      setMessages(data.conversation.messages || []);
      onClose();
    } catch (err) {
      console.error("Failed to load conversation:", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ── Rename ──
  const startRename = (chat) => {
    setRenamingId(chat._id);
    setRenameValue(chat.title);
    setMenuOpenId(null);
  };

  const confirmRename = async (id) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }

    try {
      await renameConversation(id, renameValue.trim());
      setHistory((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title: renameValue.trim() } : c))
      );
    } catch (err) {
      console.error("Failed to rename:", err.response?.data || err.message);
    } finally {
      setRenamingId(null);
    }
  };

  const handleRenameKeyDown = (e, id) => {
    if (e.key === "Enter") {
      confirmRename(id);
    } else if (e.key === "Escape") {
      setRenamingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    setMenuOpenId(null);

    try {
      await deleteConversation(id);
      setHistory((prev) => prev.filter((c) => c._id !== id));
      setSelectedConversation((prev) => {
        if (prev?._id === id) {
          // Clear messages when the active conversation is deleted
          setMessages([]);
          return null;
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to delete:", err.response?.data || err.message);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Chats</span>
        <button className="sidebar-close-btn" onClick={onClose} type="button" aria-label="Close sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <button className="new-chat-button" onClick={handleNewChat} type="button">
        + New Chat
      </button>

      <div className="history-label">History</div>

      <ul className="history-list">
        {history.map((chat) => (
          <li key={chat._id} className="history-item">
            {renamingId === chat._id ? (
              /* ── Rename Input ── */
              <input
                ref={renameInputRef}
                className="rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => handleRenameKeyDown(e, chat._id)}
                onBlur={() => confirmRename(chat._id)}
              />
            ) : (
              /* ── Normal Chat Item ── */
              <>
                <button
                  className="history-item-btn"
                  onClick={() => loadConversation(chat._id)}
                  type="button"
                >
                  {chat.title}
                </button>

                <div className="history-item-actions" ref={menuOpenId === chat._id ? menuRef : null}>
                  <button
                    className="more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === chat._id ? null : chat._id);
                    }}
                    type="button"
                    aria-label="More options"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>

                  {menuOpenId === chat._id && (
                    <div className="context-menu">
                      <button
                        className="context-menu-item"
                        onClick={() => startRename(chat)}
                        type="button"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Rename
                      </button>
                      <button
                        className="context-menu-item context-menu-item--danger"
                        onClick={() => handleDelete(chat._id)}
                        type="button"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button className="login-button" onClick={handleLogout} type="button">
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
