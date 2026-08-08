import { buildInitialPlayers, applyAction, votePolicy } from './src/game-core.js';

const state = {
  players: buildInitialPlayers(),
  socialScore: 50,
  trust: 50,
  timeValue: 50,
  environment: 50,
  chapter: 1,
  votes: [2, 1, 1],
};

const playerListEl = document.querySelector('#player-list');
const gapScoreEl = document.querySelector('#gap-score');
const trustScoreEl = document.querySelector('#trust-score');
const timeScoreEl = document.querySelector('#time-score');
const environmentScoreEl = document.querySelector('#environment-score');
const chapterToggleButton = document.querySelector('#chapter-toggle');

function renderPlayers() {
  playerListEl.innerHTML = state.players
    .map(
      (player) => `
        <article class="player-card">
          <h3>${player.name}</h3>
          <div class="player-meta">
            <span>💰 ${player.money}</span>
            <span>🤝 ${player.trust}</span>
            <span>⏰ ${player.time}</span>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderStats() {
  gapScoreEl.textContent = String(state.socialScore);
  trustScoreEl.textContent = String(state.trust);
  timeScoreEl.textContent = String(state.timeValue);
  environmentScoreEl.textContent = String(state.environment);
}

function applyPlayerAction(action) {
  const next = applyAction(state, action);
  state.players = next.players;
  state.socialScore = next.socialScore;
  state.environment = next.environment;
  state.trust = Math.min(100, Math.max(0, state.trust + (action === 'cooperate' ? 5 : 0)));
  state.timeValue = Math.min(100, Math.max(0, state.timeValue + (action === 'volunteer' ? 6 : 0)));
  renderPlayers();
  renderStats();
}

function handleVote() {
  const result = votePolicy(state, '公共交通を拡充');
  if (result.passed) {
    state.socialScore += result.effect.socialScore;
    state.trust += result.effect.trust;
    state.environment += result.effect.environment;
  }
  renderStats();
}

chapterToggleButton.addEventListener('click', () => {
  state.chapter = state.chapter === 1 ? 2 : 1;
  chapterToggleButton.textContent = state.chapter === 1 ? '第1章を開始' : '第2章へ進む';
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => applyPlayerAction(button.dataset.action));
});

document.querySelector('#vote-policy').addEventListener('click', handleVote);

renderPlayers();
renderStats();
