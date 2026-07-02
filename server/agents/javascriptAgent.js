const generateResponse = require("../services/aiService");
const prompt = require("../prompts/javascriptPrompt");

async function javascriptAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = javascriptAgent;