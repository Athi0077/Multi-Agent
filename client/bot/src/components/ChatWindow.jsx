import "../styles/dashboard.css";
import { useState } from "react";
import greetingImg from "../assets/greeting.png";
import supportImg from "../assets/suggest.png";
import infoImg from "../assets/response.png";
import feedbackImg from "../assets/feedback.png";

const agents = [
  { id: 1, title: "Bot1", work: "Greeting & Friendly Agent", img: greetingImg },
  { id: 2, title: "Bot2", work: "Support Agent", img: supportImg },
  { id: 3, title: "Bot3", work: "Information Agent", img: infoImg },
  { id: 4, title: "Bot4", work: "Feedback Agent", img: feedbackImg },
];

function ChatWindow({ messages, onToggleSidebar, userName, isThinking }) {
  const [selectedBotId, setSelectedBotId] = useState(null);
  const userMessages = messages.filter((msg) => msg.isFromUser);

  const visibleAgents = selectedBotId
    ? agents.filter((agent) => agent.id === selectedBotId)
    : agents;

  const handleBotClick = (id) => {
    setSelectedBotId(id);
  };

  const clearSelection = () => {
    setSelectedBotId(null);
  };

  return (
    <section className="chat-window">
      <aside className={`user-column ${selectedBotId ? "user-column--hidden" : ""}`}>
        <header className="user-header">
          {/* Hamburger menu to toggle sidebar */}
          <button
            className="hamburger-btn"
            onClick={onToggleSidebar}
            type="button"
            aria-label="Toggle sidebar"
          >
            <span />
            <span />
            <span />
          </button>

          {/* User avatar */}
          <span className="user-avatar" aria-hidden="true" >
            {userName.charAt(0).toUpperCase()}
          </span>

          {/* User label inside user name  */}
          <span className="user-label">{userName}</span>
        </header>

        <div className="user-message-list">
          {userMessages.map((msg, index) => (
            <div className="message user-message" key={`user-${index}`}>
              {msg.content}
            </div>
          ))}
        </div>
      </aside>

      <section className={`bot-grid ${selectedBotId ? "bot-grid--selected" : ""}`}>
        {selectedBotId && (
          <div className="bot-grid__header">
            <button className="bot-grid__back-btn" onClick={clearSelection} type="button">
              ← Back to all bots
            </button>
          </div>
        )}

        {visibleAgents.map((agent) => {
          const botMessages = messages.filter((msg) => msg.senderBot === agent.id);

          return (
            <article
              className={`bot-panel ${selectedBotId ? "bot-panel--selected" : "bot-panel--clickable"}`}
              key={agent.id}
              onClick={() => handleBotClick(agent.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleBotClick(agent.id);
                }
              }}
            >
              <h2>
                {agent.title}
                {agent.img && (
                  <img
                    src={agent.img.startsWith("/") ? agent.img : `/${agent.img}`}
                    alt={agent.title}
                  />
                )}
              </h2>
              <p className="bot-work">{agent.work}</p>

              <div className="bot-message-list">
                {botMessages.map((msg, index) => (
                  <div className="message bot-message" key={`${agent.id}-${index}`}>
                    {msg.content}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {isThinking && (
        <div className="thinking-overlay" role="status" aria-live="polite">
          <div className="thinking-overlay__backdrop" />
          <div className="thinking-overlay__content">
            <div className="thinking-badge">
              <span className="thinking-badge__dot" />
              Thinking...
            </div>
            <div className="thinking-thought">Preparing the perfect answer...</div>
          </div>

          <img src={greetingImg} alt="Bot 1" className="thinking-agent thinking-agent--1" />
          <img src={supportImg} alt="Bot 2" className="thinking-agent thinking-agent--2" />
          <img src={infoImg} alt="Bot 3" className="thinking-agent thinking-agent--3" />
          <img src={feedbackImg} alt="Bot 4" className="thinking-agent thinking-agent--4" />
        </div>
      )}
    </section>
  );
}

export default ChatWindow;
