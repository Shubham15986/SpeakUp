const STOP_WORDS = new Set([
  'a', 'an', 'the', 'i', 'we', 'you', 'they', 'it', 'this', 'that',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'and', 'but', 'or', 'so', 'because', 'if', 'when',
  'is', 'are', 'was', 'were', 'have', 'has', 'do', 'does', 'will', 'can', 'should', 'would', 'could',
  'as', 'be', 'been', 'being', 'am', 'my', 'your', 'their', 'our', 'his', 'her', 'its'
]);

export interface RepetitionResult {
  word: string;
  count: number;
}

export const detectRepetitions = (transcript: string): RepetitionResult[] => {
  const text = transcript.toLowerCase();
  const words = text.match(/\\b[a-z]+\\b/g) || [];
  
  const threshold = words.length > 200 ? 5 : 3;
  const counts: Record<string, number> = {};

  for (const word of words) {
    if (!STOP_WORDS.has(word)) {
      counts[word] = (counts[word] || 0) + 1;
    }
  }

  const results: RepetitionResult[] = [];
  for (const [word, count] of Object.entries(counts)) {
    if (count >= threshold) {
      results.push({ word, count });
    }
  }

  return results.sort((a, b) => b.count - a.count);
};
