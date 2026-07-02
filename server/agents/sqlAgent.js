const generateResponse = require("../services/aiService");
const prompt = require("../prompts/sqlPrompt");

async function sqlAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = sqlAgent;