export interface ReadabilityResult {
  clarityScore: number;
  paceWpm: number;
  paceLabel: string;
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
}

const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const match = word.match(/[aeiouy]{1,2}/g);
  return match ? match.length : 1;
};

export const analyzeReadabilityAndPace = (transcript: string, durationSeconds: number): ReadabilityResult => {
  const text = transcript.trim();
  if (!text) {
    return { clarityScore: 0, paceWpm: 0, paceLabel: 'Unknown', wordCount: 0, sentenceCount: 0, avgSentenceLength: 0 };
  }

  // Count sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const sentenceCount = sentences.length;

  // Count words
  const words = text.match(/\\b\\w+\\b/g) || [];
  const wordCount = words.length;

  // Count syllables
  let syllableCount = 0;
  for (const word of words) {
    syllableCount += countSyllables(word);
  }

  // Flesch Reading Ease Formula
  // 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
  let score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

  // Pace (WPM)
  let paceWpm = 0;
  if (durationSeconds && durationSeconds > 0) {
    paceWpm = Math.round((wordCount / durationSeconds) * 60);
  }

  let paceLabel = 'Ideal';
  if (paceWpm < 110) paceLabel = 'Too slow';
  else if (paceWpm <= 130) paceLabel = 'Ideal for teaching';
  else if (paceWpm <= 160) paceLabel = 'Ideal for technical interviews';
  else if (paceWpm <= 180) paceLabel = 'Fast';
  else paceLabel = 'Too fast';

  return {
    clarityScore: isNaN(score) ? 0 : Math.round(score),
    paceWpm,
    paceLabel,
    wordCount,
    sentenceCount,
    avgSentenceLength: sentenceCount ? Math.round(wordCount / sentenceCount) : 0
  };
};
