export function buildInitialPlayers() {
  const templates = [
    { name: '不動産王ブランプ', money: 12, trust: 2, time: 1, role: 'estate' },
    { name: '看護師シングルマザー', money: 3, trust: 9, time: 2, role: 'care' },
    { name: 'ニートの山田ひろし', money: 2, trust: 1, time: 12, role: 'info' },
    { name: '難民エンジニアのアーメド', money: 2, trust: 3, time: 8, role: 'engineer' },
  ];

  return templates.map((player, index) => ({
    id: index + 1,
    ...player,
    isAlive: true,
    assets: Math.max(0, player.money * 2),
    happiness: 50,
  }));
}

export function applyAction(state, actionType) {
  const nextPlayers = state.players.map((player) => ({
    ...player,
    trust: Math.max(0, player.trust + (actionType === 'cooperate' ? 1 : 0)),
    money: Math.max(0, player.money + (actionType === 'invest' ? 1 : 0)),
    time: Math.max(0, player.time + (actionType === 'volunteer' ? 1 : 0)),
  }));

  const socialScore = Math.max(0, state.socialScore + (actionType === 'cooperate' ? 12 : -4));
  const environment = Math.max(0, state.environment + (actionType === 'cooperate' ? 8 : -2));

  return {
    ...state,
    players: nextPlayers,
    socialScore,
    environment,
    lastAction: actionType,
  };
}

export function votePolicy(state, proposal) {
  const votes = [...state.votes];
  const support = votes.reduce((sum, value) => sum + value, 0);
  const passed = support >= 3;

  const effect = passed
    ? {
        socialScore: 18,
        trust: 2,
        environment: 6,
      }
    : {
        socialScore: -4,
        trust: -1,
        environment: -1,
      };

  return {
    passed,
    proposal,
    effect,
  };
}
