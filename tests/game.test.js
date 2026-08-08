import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInitialPlayers, applyAction, votePolicy } from '../src/game-core.js';

test('initial players are created with resource values', () => {
  const players = buildInitialPlayers();
  assert.equal(players.length >= 2, true);
  players.forEach((player) => {
    assert.ok(player.name);
    assert.ok(typeof player.money === 'number');
    assert.ok(typeof player.trust === 'number');
    assert.ok(typeof player.time === 'number');
  });
});

test('cooperation action improves collective score', () => {
  const players = buildInitialPlayers();
  const state = { players, socialScore: 50, environment: 50, chapter: 1 };
  const result = applyAction(state, 'cooperate');
  assert.ok(result.socialScore >= 50);
  assert.ok(result.players.every((player) => player.trust >= 0));
});

test('policy voting can pass a proposal', () => {
  const result = votePolicy({ proposals: ['公共交通を拡充'], votes: [2, 1, 1] }, '公共交通を拡充');
  assert.equal(result.passed, true);
  assert.ok(result.effect.socialScore > 0);
});
