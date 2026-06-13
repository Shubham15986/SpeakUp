// @ts-ignore
import nlp from 'compromise';

export interface StructureResult {
  runOnCount: number;
  passiveVoiceCount: number;
  incompleteSentences: number;
  summary: string;
}

export const analyzeStructure = (transcript: string): StructureResult => {
  if (!transcript) {
    return { runOnCount: 0, passiveVoiceCount: 0, incompleteSentences: 0, summary: 'No transcript provided.' };
  }

  const doc = nlp(transcript);
  const sentences = doc.sentences().json() as any[];

  let runOnCount = 0;
  let passiveVoiceCount = 0;
  let incompleteSentences = 0;

  for (const s of sentences) {
    const text = s.text;
    const wordCount = text.split(/\\s+/).length;
    
    // Check for run-on (e.g. > 25 words)
    if (wordCount > 25) {
      runOnCount++;
    }

    // Rough check for passive voice using compromise match (e.g., 'was done', 'is shown')
    // We parse just this sentence text for passive
    const sDoc = nlp(text);
    if (sDoc.match('(is|are|was|were|be|been|being) #Adverb? #PastTense (by|with)?').found) {
      passiveVoiceCount++;
    }

    // Check for incomplete (very short, lacking subject+verb)
    if (wordCount < 3) {
      incompleteSentences++;
    }
  }

  const issues = [];
  if (runOnCount > 0) issues.push(`Found ${runOnCount} run-on sentence(s).`);
  if (passiveVoiceCount > 0) issues.push(`Detected passive voice in ${passiveVoiceCount} sentence(s).`);
  if (incompleteSentences > 0) issues.push(`Found ${incompleteSentences} very short or incomplete sentence(s).`);

  return {
    runOnCount,
    passiveVoiceCount,
    incompleteSentences,
    summary: issues.length > 0 ? issues.join(' ') : 'Sentence structure is concise and active.'
  };
};
