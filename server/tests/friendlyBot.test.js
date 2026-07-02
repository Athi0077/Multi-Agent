const test = require('node:test');
const assert = require('node:assert/strict');
const friendlyBot = require('../services/bots/friendlyBot');

test('friendlyBot returns a warm reply for jokes, plans, and casual chat', async () => {
  const replies = await Promise.all([
    friendlyBot({}, 'Tell me a joke'),
    friendlyBot({}, 'Make me a plan for today'),
    friendlyBot({}, 'How are you today?')
  ]);

  assert.match(replies[0].toLowerCase(), /joke|laugh|smile/i);
  assert.match(replies[1].toLowerCase(), /plan|today|schedule|focus/i);
  assert.match(replies[2].toLowerCase(), /friend|happy|chat|today|here/i);
});
