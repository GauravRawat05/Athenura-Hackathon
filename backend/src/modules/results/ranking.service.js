export const computeRankings = (aggregatedResults) => {
  // Sort descending by aggregated score
  const sorted = [...aggregatedResults].sort((a, b) => b.aggregatedScore - a.aggregatedScore);
  
  const ranked = [];
  let currentRank = 1;
  let unresolvedTies = false;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = i > 0 ? sorted[i - 1] : null;

    if (prev && current.aggregatedScore === prev.aggregatedScore && current.aggregatedScore > 0) {
      current.isTie = true;
      prev.isTie = true;
      current.rank = prev.rank; // same rank
      unresolvedTies = true;
    } else {
      current.isTie = false;
      current.rank = currentRank;
    }
    
    ranked.push(current);
    currentRank++;
  }

  return {
    rankedResults: ranked,
    unresolvedTies
  };
};