const generateResponse = require("../services/aiService");
const prompt = require("../prompts/interviewPrompt");

async function interviewAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = interviewAgent;