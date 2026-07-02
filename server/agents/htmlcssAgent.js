const generateResponse = require("../services/aiService");
const prompt = require("../prompts/htmlcssPrompt");

async function htmlcssAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = htmlcssAgent;