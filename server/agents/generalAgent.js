const generateResponse = require("../services/aiService");
const prompt = require("../prompts/generalPrompt");

async function generalAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = generalAgent;