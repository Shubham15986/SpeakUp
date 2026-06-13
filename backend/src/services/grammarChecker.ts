export interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
  type: string;
}

export const checkGrammar = async (transcript: string): Promise<GrammarError[]> => {
  if (!transcript || transcript.trim().length === 0) return [];

  try {
    const params = new URLSearchParams();
    params.append('text', transcript);
    params.append('language', 'en-US');

    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      console.error('LanguageTool API failed:', response.statusText);
      return [];
    }

    const data = await response.json();
    const errors: GrammarError[] = [];

    for (const match of data.matches || []) {
      // Ignore some very generic style suggestions if needed, but for now take all
      const original = transcript.substring(match.offset, match.offset + match.length);
      const correction = match.replacements && match.replacements.length > 0 
        ? match.replacements[0].value 
        : '';
        
      // Ignore errors that are purely capitalization differences, since transcripts often lack perfect casing
      if (correction && original.toLowerCase() === correction.toLowerCase()) {
        continue;
      }
        
      errors.push({
        original,
        correction,
        explanation: match.message || match.rule?.description || 'Grammar issue',
        type: match.rule?.issueType || 'grammar'
      });
    }

    return errors;
  } catch (err) {
    console.error('Error in grammarChecker:', err);
    return [];
  }
};
