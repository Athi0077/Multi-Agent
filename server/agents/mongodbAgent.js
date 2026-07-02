const generateResponse = require("../services/aiService");
const prompt = require("../prompts/mongodbPrompt");

async function mongodbAgent(message) {
    return await generateResponse(prompt, message);
}

module.exports = mongodbAgent;