const generateAIResponse = require("../aiService");

const responseBot = async (conversation, userMessage, memory) => {

  const history = conversation.messages
    .map((msg) => {
      return `${msg.isFromUser ? "User" : "Assistant"}: ${msg.content}`;
    })
    .join("\n");

  const prompt = `
      You are a helpful AI assistant.

      User Memory:

      ${memory?.summary || "No prior memory."}

      Conversation:

      ${history}

      Latest Message:

      ${userMessage}

     Please provide a helpful and concise response to the user's latest message, taking into account the conversation history and user memory.`;

  const response = await generateAIResponse(prompt, userMessage);

  return response;
};

module.exports = responseBot;