const generateResponse = require("../services/aiService");
const prompt = require("../prompts/nodePrompt");

async function nodeAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = nodeAgent;