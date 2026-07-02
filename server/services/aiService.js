const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const FALLBACK_RESPONSE = "I’m having trouble answering right now. Please try again in a moment.";

async function generateResponse(systemPrompt, userPrompt) {
    const instruction = typeof systemPrompt === "string" && systemPrompt.trim()
        ? systemPrompt
        : "You are a helpful AI assistant.";

    const promptText = typeof userPrompt === "string" && userPrompt.trim()
        ? userPrompt
        : (typeof systemPrompt === "string" ? systemPrompt : "");

    if (!process.env.GEMINI_API_KEY) {
        return FALLBACK_RESPONSE;
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: instruction,
        });

        const result = await model.generateContent(promptText);
        return result?.response?.text?.() || FALLBACK_RESPONSE;
    } catch (error) {
        console.error("AI generation failed:", error);

        if (error?.status === 429 || String(error?.message).toLowerCase().includes("quota")) {
            return "AI service is temporarily unavailable due to quota or rate limits. Please try again later.";
        }

        return FALLBACK_RESPONSE;
    }
}

module.exports = generateResponse;