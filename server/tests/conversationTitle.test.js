const test = require('node:test');
const assert = require('node:assert/strict');

const { buildConversationTitle } = require('../utils/conversationTitle');

test('buildConversationTitle uses the first user message', () => {
  assert.equal(buildConversationTitle('How do I learn React?'), 'How do I learn React?');
});

test('buildConversationTitle trims long titles', () => {
  const longMessage = 'Can you explain how to build a full stack app with React, Node, and MongoDB in detail?';
  assert.equal(
    buildConversationTitle(longMessage),
    'Can you explain how to build a full stack app with React, Node, and MongoDB in detail?'
  );
});
