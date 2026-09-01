export function getGameInfo(game, customRulesMap = {}) {
  if (!game) return null;
  const gameName = typeof game === 'string' ? game : game.name;
  
  if (typeof game === 'object' && (game.description || game.rules)) {
    return {
      name: game.name,
      deal: game.deal || '',
      rules: game.description || game.rules,
      winner: game.winner || ''
    };
  }

  // Check custom rules map
  if (customRulesMap && customRulesMap[gameName]) {
    return customRulesMap[gameName];
  }

  // Case-insensitive lookup in custom rules map
  if (customRulesMap) {
    const foundKey = Object.keys(customRulesMap).find(
      k => k.toLowerCase() === (gameName || '').toLowerCase()
    );
    if (foundKey) {
      return customRulesMap[foundKey];
    }
  }

  return {
    name: gameName,
    deal: 'Standard bomb pot deal',
    rules: 'Follow your standard house rules for this bomb pot game.',
    winner: 'Standard bomb pot split rules apply.'
  };
}
