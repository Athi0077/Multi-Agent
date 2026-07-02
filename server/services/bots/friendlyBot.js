const generateAIResponse = require('../aiService');

const getLocalFriendlyReply = (userMessage = '', name = 'friend') => {
  const text = String(userMessage || '').toLowerCase();

  if (/joke|funny|laugh|humor|comedy|tell me/.test(text)) {
    return `Absolutely, ${name}! Here’s a little joke for you: Why did the computer go to therapy? Because it had too many bytes of emotional baggage 😄`;
  }

  if (/plan|today|schedule|routine|goal/.test(text)) {
    return `Absolutely, ${name}! Here’s a simple plan for today: start with one important task, take a short break, then do one small win before the day wraps up. You’ve got this 😊`;
  }

  if (/hello|hi|hey|how are you|what's up|how's it going|who are you/.test(text)) {
    return `Hey ${name}! I’m Bot1, and I’m happy to chat with you. What would you like to do today?`;
  }

  return `Absolutely, ${name}! I’m here for friendly chat, a little humor, or a simple plan for your day. What would you like to do next?`;
};

const friendlyBot = async (user, conversationOrMessage, maybeUserMessage) => {
  const name = user?.name || 'friend';
  const userMessage = typeof maybeUserMessage === 'string'
    ? maybeUserMessage
    : (typeof conversationOrMessage === 'string' ? conversationOrMessage : '');
  const conversation = typeof conversationOrMessage === 'string'
    ? { messages: [] }
    : (conversationOrMessage || { messages: [] });
  const history = (conversation?.messages || [])
    .map((msg) => `${msg.isFromUser ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  if (!process.env.GEMINI_API_KEY) {
    return getLocalFriendlyReply(userMessage, name);
  }

  const prompt = `
You are Bot1, a warm and friendly assistant.
Your style should feel cheerful, supportive, and conversational.
You can help with light chat, jokes, daily plans, and simple encouragement.

Rules:
- Be friendly and upbeat.
- Keep replies short, natural, and human-like.
- If the user asks for a joke, tell one with a light tone.
- If the user asks for a plan, give a simple and practical plan for today.
- If the user says hello or chats casually, respond warmly and keep the conversation going.
- Do not sound robotic or overly formal.

User name: ${name}

Conversation history:
${history || 'No prior messages.'}

Latest message:
${userMessage || 'Hello'}

Reply in a friendly way that feels like a real assistant talking to a friend.
`;

  return generateAIResponse(prompt, userMessage || 'Hello');
};

module.exports = friendlyBot;
