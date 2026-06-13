import { detectFillers } from './fillerDetector';
import { checkGrammar } from './grammarChecker';
import { analyzeReadabilityAndPace } from './readabilityScorer';
import { assessVocabulary } from './vocabAssessor';
import { detectRepetitions } from './repetitionDetector';
import { analyzeStructure } from './structureAnalyser';
import { generateSuggestions } from './suggestionEngine';

export interface AnalysisOptions {
  transcript: string;
  durationSeconds?: number;
  context: string;
}

export interface AnalysisReport {
  transcript: string;
  clarityScore: number;
  technicalAccuracyScore: number;
  flowAndStructure: string;
  modelAnswer: string;
  grammarErrors: any[];
  fillerWords: any[];
  vocabularyGaps: any[];
  strengths: string[];
  aiSuggestions: any[];
}

export const runAnalysis = async (options: AnalysisOptions): Promise<AnalysisReport> => {
  const { transcript, durationSeconds = 60, context } = options;

  // Run all local, deterministic steps in parallel (grammar is an API call but independent)
  const [
    fillers,
    grammar,
    readability,
    vocab,
    repetitions,
    structure
  ] = await Promise.all([
    Promise.resolve(detectFillers(transcript)),
    checkGrammar(transcript),
    Promise.resolve(analyzeReadabilityAndPace(transcript, durationSeconds)),
    assessVocabulary(transcript),
    Promise.resolve(detectRepetitions(transcript)),
    Promise.resolve(analyzeStructure(transcript))
  ]);

  // Pass summary to Gemini for Suggestions, Flow, and Technical Answer
  const summaryForGemini = {
    context,
    clarityScore: readability.clarityScore,
    paceWpm: readability.paceWpm,
    paceLabel: readability.paceLabel,
    fillers,
    grammarErrors: grammar,
    weakWords: vocab.weakWords,
    structureSummary: structure.summary,
    transcript
  };

  const aiResult = await generateSuggestions(summaryForGemini);

  // Map vocabulary into the schema the frontend expects
  const formattedVocabGaps = vocab.weakWords.map(w => ({
    weakWord: w.word,
    strongAlternatives: w.suggestions,
    context: `You said "${w.word}" during your response.`
  }));

  // Create formatted strengths array based on deterministic data
  const strengths = [];
  if (readability.clarityScore > 70) strengths.push('Excellent clarity and readability.');
  if (vocab.strongWords.length > 0) strengths.push(`Used strong professional vocabulary (${vocab.strongWords.slice(0, 3).join(', ')}).`);
  if (grammar.length === 0) strengths.push('Flawless grammar usage.');
  if (fillers.length === 0) strengths.push('No filler words detected, excellent fluency.');
  
  // Format fillers into expected schema
  const formattedFillers = fillers.map(f => ({
    word: f.word,
    count: f.count,
    suggestion: f.suggestion
  }));

  return {
    transcript,
    clarityScore: readability.clarityScore,
    technicalAccuracyScore: aiResult.technicalAccuracyScore || 90,
    flowAndStructure: aiResult.flowAndStructure,
    modelAnswer: aiResult.modelAnswer,
    grammarErrors: grammar,
    fillerWords: formattedFillers,
    vocabularyGaps: formattedVocabGaps,
    strengths,
    aiSuggestions: aiResult.aiSuggestions
  };
};
