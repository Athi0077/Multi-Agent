
const clarificationBot = async (message) => {
    const shortMessages = [
        "help",
        "hello",
        "hi",
        "issue",
        "problem",
        "error",
        "question",
    ];

    const text = String(message || "").toLowerCase().trim();

    const isQuestion = /\b(why|what|how|when|where|who|which|does|do|is|are|can|could|would|should)\b/.test(text) || text.endsWith("?");

    if (shortMessages.includes(text)) {
        return {
            needsClarification: true,
            reply: "Could you tell me more about what you need help with?",
        };
    }

    if (text.length < 12 && !isQuestion) {
        return {
            needsClarification: true,
            reply: "Can you explain your question in a little more detail?",
        };
    }

    return {
        needsClarification: false,
        reply: null,
    };
};

module.exports = clarificationBot;