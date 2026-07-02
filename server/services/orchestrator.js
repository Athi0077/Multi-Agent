const greetingBot = require("./bots/greetingBot");
const clarificationBot = require("./bots/clarificationBot");
const responseBot = require("./bots/responseBot");
const suggestionBot = require("./bots/suggestionBot");
const friendlyBot = require("./bots/friendlyBot");
const { getMemory } = require("./memory/memoryService");
const extractMemory = require("./memory/memoryExtractor");

const getRequestedBot = (message) => {
    const text = String(message || "").toLowerCase().trim();

    if (/\bbot1\b/.test(text)) return 1;
    if (/\bbot2\b/.test(text)) return 2;
    if (/\bbot4\b/.test(text)) return 4;

    return null;
};

const orchestrator = async (user, conversation, userMessage, requestedBotOverride) => {
    let memory = {
        profile: {},
        preferences: {},
        summary: "",
        save: async () => { },
    };

    try {
        memory = await getMemory(user._id);
    } catch (error) {
        console.error("Memory initialization failed:", error);
    }

    const requestedBot = typeof requestedBotOverride === 'number' ? requestedBotOverride : getRequestedBot(userMessage);
    const responses = [];

    if (requestedBot === 1) {
        const greeting = await greetingBot(user, conversation);
        const friendlyReply = await friendlyBot(user, conversation, userMessage);

        const replyContent = (greeting && conversation.messages.length <= 1)
            ? `${greeting}\n\n${friendlyReply}`
            : friendlyReply;

        responses.push({
            senderBot: 1,
            content: replyContent,
            isFromUser: false,
        });

        return responses;
    }

    if (requestedBot === 2) {
        const clarification = await clarificationBot(userMessage);
        const reply = clarification?.reply || "I can help with that.";

        responses.push({
            senderBot: 2,
            content: reply,
            isFromUser: false,
        });

        return responses;
    }

    if (requestedBot === 3) {
        const answer = await responseBot(conversation, userMessage, memory);

        responses.push({
            senderBot: 3,
            content: answer,
            isFromUser: false,
        });

        return responses;
    }

    if (requestedBot === 4) {
        const suggestion = await suggestionBot(userMessage);

        responses.push({
            senderBot: 4,
            content: suggestion,
            isFromUser: false,
        });

        return responses;
    }

    const greeting = await greetingBot(user, conversation);

    if (greeting) {
        responses.push({
            senderBot: 1,
            content: greeting,
            isFromUser: false,
        });
    }

    const clarification = await clarificationBot(userMessage);
    if (clarification.needsClarification) {
        responses.push({
            senderBot: 2,
            content: clarification.reply,
            isFromUser: false
        });
        return responses;
    }

    const answer = await responseBot(conversation, userMessage, memory);

    responses.push({
        senderBot: 3,
        content: answer,
        isFromUser: false,
    });

    const suggestion = await suggestionBot(answer, conversation, memory);

    responses.push({
        senderBot: 4,
        content: suggestion,
        isFromUser: false,
    });

    try {
        const aiData = await extractMemory(userMessage, memory);

        if (!memory.profile) {
            memory.profile = {};
        }

        if (!memory.preferences) {
            memory.preferences = {};
        }

        memory.profile.name = aiData?.name ?? memory.profile.name;
        memory.profile.goal = aiData?.goal ?? memory.profile.goal;
        memory.summary = aiData?.summary ?? memory.summary;

        if (typeof memory.save === "function") {
            await memory.save();
        }
    } catch (error) {
        console.error("Memory update failed:", error);
    }

    return responses;
};

module.exports = orchestrator;