const dsaAgent = require("../agents/dsaAgent");
const reactAgent = require("../agents/reactAgent");
const javascriptAgent = require("../agents/javascriptAgent");
const nodeAgent = require("../agents/nodeAgent");
const mongodbAgent = require("../agents/mongodbAgent");
const htmlcssAgent = require("../agents/htmlcssAgent");
const sqlAgent = require("../agents/sqlAgent");
const interviewAgent = require("../agents/interviewAgent");
const resumeAgent = require("../agents/resumeAgent");
const generalAgent = require("../agents/generalAgent");

const agentRules = [
  {
    name: "dsa",
    agent: dsaAgent,
    keywords: [/\bdsa\b/, /\bleetcode\b/, /\barray\b/, /linked list/, /\bstack\b/, /\bqueue\b/, /binary tree/, /\bgraph\b/, /two sum/, /anagram/],
  },
  {
    name: "react",
    agent: reactAgent,
    keywords: [/\breact\b/, /\bjsx\b/, /useeffect/, /usestate/, /usereducer/, /context api/],
  },
  {
    name: "javascript",
    agent: javascriptAgent,
    keywords: [/\bjavascript\b/, /\bjs\b/, /closure/, /promise/, /async/, /event loop/],
  },
  {
    name: "node",
    agent: nodeAgent,
    keywords: [/node\.js/, /\bnode\b/, /\bexpress\b/, /\bapi\b/, /\bbackend\b/, /\bmiddleware\b/],
  },
  {
    name: "mongodb",
    agent: mongodbAgent,
    keywords: [/\bmongodb\b/, /\bmongoose\b/, /\batlas\b/, /\bschema\b/],
  },
  {
    name: "htmlcss",
    agent: htmlcssAgent,
    keywords: [/\bhtml\b/, /\bcss\b/, /flexbox/, /grid/, /responsive/],
  },
  {
    name: "sql",
    agent: sqlAgent,
    keywords: [/\bsql\b/, /\bmysql\b/, /\bjoin\b/, /\bdatabase\b/],
  },
  {
    name: "resume",
    agent: resumeAgent,
    keywords: [/\bresume\b/, /\bcv\b/, /\bats\b/],
  },
  {
    name: "interview",
    agent: interviewAgent,
    keywords: [/\binterview\b/, /\bhr\b/, /behavioral/],
  },
];

const normalizeMessage = (message) => String(message || "").toLowerCase().trim();

const matchesAnyKeyword = (text, keywords) =>
  keywords.some((keyword) => {
    if (keyword instanceof RegExp) {
      return keyword.test(text);
    }

    return text.includes(keyword.toLowerCase());
  });

async function agentRouter(message) {
  const text = normalizeMessage(message);

  if (!text) {
    return await generalAgent(message);
  }

  for (const rule of agentRules) {
    if (matchesAnyKeyword(text, rule.keywords)) {
      return await rule.agent(message);
    }
  }

  return await generalAgent(message);
}

module.exports = agentRouter;