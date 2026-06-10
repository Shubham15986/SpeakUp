import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { context, userId } = req.body;
    const file = req.file;
    let transcript = req.body.transcript || '';

    if (!transcript && !file) {
      res.status(400).json({ error: 'Either a transcript or an audio file is required.' });
      return;
    }

    const prompt = `
System: You are an expert technical interviewer and communication coach for software engineers.
Context: ${context || 'General communication'}
${transcript ? `Input Transcript: "${transcript}"` : `Task: First, listen to the attached audio file and transcribe it accurately. Then, analyze it.`}

Analyze the input (audio or text) based on BOTH communication delivery and technical content. Output a JSON object exactly matching this schema:
{
  "transcript": "The full exact transcript of what was spoken (critical if an audio file was provided, otherwise just repeat the input)",
  "clarityScore": 85,
  "technicalAccuracyScore": 90,
  "flowAndStructure": "A brief paragraph evaluating the logical flow and structure of the answer (e.g., use of STAR method, problem-solving flow).",
  "modelAnswer": "A full, perfect 'ideal response' to the context/question that the user can learn from.",
  "grammarErrors": [{"original": "...", "correction": "...", "explanation": "..."}],
  "fillerWords": [{"word": "basically", "count": 3, "suggestion": "essentially"}],
  "vocabularyGaps": [{"weakWord": "good", "strongAlternatives": ["robust", "optimal", "effective"], "context": "..."}],
  "strengths": ["...", "..."],
  "aiSuggestions": [{"title": "...", "exercise": "..."}]
}
Output nothing but the valid JSON.
`;

    let contents: any = prompt;

    if (file) {
      contents = [
        {
          inlineData: {
            mimeType: file.mimetype,
            data: file.buffer.toString('base64')
          }
        },
        prompt
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    let reportData;
    try {
      // Sometimes Gemini wraps JSON in markdown blocks
      const cleanJson = resultText.replace(/```json\n?|```/g, '').trim();
      reportData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", resultText);
      return res.status(500).json({ error: "Invalid JSON response from AI" });
    }

    // Ensure user exists before creating session to satisfy foreign key constraint
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@placeholder.com`, // Just a placeholder if we only have an ID for now
      }
    });

    const session = await prisma.session.create({
      data: {
        userId: dbUser.id,
        type: context.includes('DSA') ? 'DSASimulator' : (context.includes('Custom') ? 'CustomSimulator' : 'DeepAnalysis'),
        score: reportData.clarityScore,
        report: {
          create: {
            transcript: transcript || 'Audio File Transcription',
            clarityScore: reportData.clarityScore,
            technicalAccuracyScore: reportData.technicalAccuracyScore || 0,
            flowAndStructure: reportData.flowAndStructure || '',
            modelAnswer: reportData.modelAnswer || '',
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

    res.status(200).json({ ...reportData, sessionId: session.id });
  } catch (error: any) {
    console.error('Error generating analysis report:', error);
    res.status(500).json({ error: 'Failed to generate analysis report.' });
  }
};

export const transcribeAudio = async (req: Request, res: Response): Promise<any> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'An audio file is required for transcription.' });
    }

    const contents = [
      {
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString('base64')
        }
      },
      "Please transcribe this audio file accurately. Output ONLY the raw text transcript without any markdown formatting or extra commentary."
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    const transcript = response.text?.trim() || "";
    res.status(200).json({ transcript });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio file.' });
  }
};
