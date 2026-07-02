const buildConversationTitle = (message) => {
  if (typeof message !== "string") {
    return "New Chat";
  }

  const trimmed = message.trim().replace(/\s+/g, " ");
  return trimmed || "New Chat";
};

module.exports = {
  buildConversationTitle,
};
