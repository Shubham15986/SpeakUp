const FILLER_WORDS = [
  'um', 'umm', 'uh', 'er', 'ah', 
  'basically', 'literally', 'actually', 'honestly', 'obviously',
  'you know', 'i mean', 'you see', 'right', 'okay so', 'so yeah',
  'kind of', 'sort of', 'like', 'pretty much'
];

export interface FillerResult {
  word: string;
  count: number;
  suggestion: string;
}

export const detectFillers = (transcript: string): FillerResult[] => {
  const text = transcript.toLowerCase();
  const results: FillerResult[] = [];

  for (const filler of FILLER_WORDS) {
    // Word boundary regex to prevent partial matches (e.g., 'like' inside 'alike')
    const regex = new RegExp(`\\b${filler}\\b`, 'g');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      let suggestion = 'Consider pausing instead.';
      if (filler === 'basically') suggestion = 'essentially';
      if (filler === 'actually') suggestion = 'in fact';
      if (filler === 'like') suggestion = 'such as / for example';
      if (filler === 'you know') suggestion = '[pause]';

      results.push({
        word: filler,
        count: matches.length,
        suggestion
      });
    }
  }

  // Sort by count descending
  return results.sort((a, b) => b.count - a.count);
};
