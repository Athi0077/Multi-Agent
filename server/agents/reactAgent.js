const generateResponse = require("../services/aiService");
const prompt = require("../prompts/reactPrompt");

async function reactAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = reactAgent;