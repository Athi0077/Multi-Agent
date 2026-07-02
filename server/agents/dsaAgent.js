const generateResponse = require("../services/aiService");
const prompt = require("../prompts/dsaPrompt");

async function dsaAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = dsaAgent;