import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';
import { runAnalysis } from '../services/analysisEngine';

const prisma = new PrismaClient();

export const generateReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const { context, userId, durationSeconds } = req.body;
    const file = req.file;
    let transcript = req.body.transcript || '';

    if (!transcript && !file) {
      res.status(400).json({ error: 'Either a transcript or an audio file is required.' });
      return;
    }

    // If we only got an audio file without a transcript, transcribe it first
    if (!transcript && file) {
       const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
       const contents = [
         {
           inlineData: {
             mimeType: file.mimetype,
             data: file.buffer.toString('base64')
           }
         },
         "Please transcribe this audio file accurately. Output ONLY the raw text transcript."
       ];
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: contents,
       });
       transcript = response.text?.trim() || "";
    }

    // Run the new hybrid analysis engine
    const reportData = await runAnalysis({
      transcript,
      context: context || 'General communication',
      durationSeconds: durationSeconds ? parseInt(durationSeconds) : 60
    });

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
            transcript: transcript,
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
