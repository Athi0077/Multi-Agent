const generateAIResponse = require("../aiService");

const suggestionBot = async(answer)=>{

const prompt=`

You are an AI assistant.

Based on this answer,

suggest ONLY 3 useful next actions.

Answer:

${answer}

Format:

• ...

• ...

• ...

`;

return await generateAIResponse(prompt, answer);

}

module.exports=suggestionBot;