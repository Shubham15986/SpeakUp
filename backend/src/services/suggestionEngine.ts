import { GoogleGenAI } from '@google/genai';

export interface GeminiSuggestions {
  aiSuggestions: { title: string; exercise: string }[];
  flowAndStructure: string;
  modelAnswer: string;
  technicalAccuracyScore: number;
}

export const generateSuggestions = async (summary: any): Promise<GeminiSuggestions> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
System: You are an expert technical interviewer and communication coach.
We have already run deterministic analysis on the user's speech.
Here are the pre-computed metrics:
- Context/Topic: ${summary.context}
- Clarity Score: ${summary.clarityScore}/100
- Pace: ${summary.paceWpm} WPM (${summary.paceLabel})
- Fillers used: ${summary.fillers.map((f: any) => f.word).join(', ')}
- Grammar issues: ${summary.grammarErrors.length}
- Weak vocabulary words: ${summary.weakWords.map((w: any) => w.word).join(', ')}
- Structure summary: ${summary.structureSummary}
- Transcript: "${summary.transcript}"

Task:
1. Provide 3-5 specific improvement suggestions based strictly on the above data.
2. Evaluate the logical flow and structure of the actual response content.
3. Provide a 'model answer' showing the ideal way to respond to the topic.
4. Give a technical accuracy score (0-100) if the context is technical, else default to 90.

Output purely JSON matching this exact schema:
{
  "aiSuggestions": [{"title": "...", "exercise": "..."}],
  "flowAndStructure": "A brief paragraph...",
  "modelAnswer": "Full ideal response text...",
  "technicalAccuracyScore": 90
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const resultText = response.text || "{}";
    const cleanJson = resultText.replace(/```json\\n?|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return {
      aiSuggestions: [],
      flowAndStructure: "Unavailable due to AI quota.",
      modelAnswer: "Unavailable.",
      technicalAccuracyScore: 0
    };
  }
};
