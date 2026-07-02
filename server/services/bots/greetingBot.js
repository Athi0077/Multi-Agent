const greetingBot = async (user, conversation) => {
    if (conversation.messages.length === 1) {
        const name = user?.name || "there";
        return `Hey ${name}! I’m Bot1, and I’m here to help with friendly chat, jokes, and a simple plan for your day 😊`;
    }

    return null;
};

module.exports = greetingBot;