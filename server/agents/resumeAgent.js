const generateResponse = require("../services/aiService");
const prompt = require("../prompts/resumePrompt");

async function resumeAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = resumeAgent;