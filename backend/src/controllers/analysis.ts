import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, context, userId } = req.body;

    if (!transcript || !userId) {
      res.status(400).json({ error: 'Transcript and userId are required.' });
      return;
    }

    const prompt = `
System: You are an expert communication coach for software engineers.
Context: ${context || 'General communication'}
Input Transcript: "${transcript}"

Analyze the input transcript and output a JSON object exactly matching this schema:
{
  "clarityScore": 85,
  "grammarErrors": [{"original": "...", "correction": "...", "explanation": "..."}],
  "fillerWords": [{"word": "basically", "count": 3, "suggestion": "essentially"}],
  "vocabularyGaps": [{"weakWord": "good", "strongAlternatives": ["robust", "optimal", "effective"], "context": "..."}],
  "strengths": ["...", "..."],
  "aiSuggestions": [{"title": "...", "exercise": "..."}]
}
Output nothing but the valid JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const reportData = JSON.parse(resultText);

    // Save to Database
    const session = await prisma.session.create({
      data: {
        userId,
        type: 'DeepAnalysis',
        score: reportData.clarityScore,
        report: {
          create: {
            transcript,
            clarityScore: reportData.clarityScore,
            grammarErrors: reportData.grammarErrors,
            fillerWords: reportData.fillerWords,
            vocabularyGaps: reportData.vocabularyGaps,
            aiSuggestions: reportData.aiSuggestions,
          }
        }
      },
      include: {
        report: true
      }
    });

    res.status(200).json(session.report);
  } catch (error: any) {
    console.error('Error generating analysis report:', error);
    res.status(500).json({ error: 'Failed to generate analysis report.' });
  }
};
