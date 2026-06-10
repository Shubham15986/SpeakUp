import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVocabularyGaps = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch all reports for the user
    const reports = await prisma.analysisReport.findMany({
      where: {
        session: {
          userId: String(userId),
        }
      },
      select: {
        vocabularyGaps: true,
      }
    });

    // Aggregate vocabulary gaps
    const allGaps: any[] = [];
    let idCounter = 1;

    reports.forEach((report: any) => {
      if (report.vocabularyGaps && Array.isArray(report.vocabularyGaps)) {
        report.vocabularyGaps.forEach((gap: any) => {
          allGaps.push({
            id: idCounter++,
            weakWord: gap.weakWord,
            strongAlternatives: gap.strongAlternatives || [],
            context: gap.context || 'Used during interview.'
          });
        });
      }
    });

    // Deduplicate (optional, but good for UI)
    const uniqueGapsMap = new Map();
    allGaps.forEach(gap => {
      const key = gap.weakWord.toLowerCase();
      if (!uniqueGapsMap.has(key)) {
        uniqueGapsMap.set(key, gap);
      }
    });

    res.status(200).json(Array.from(uniqueGapsMap.values()));

  } catch (error: any) {
    console.error('Error fetching vocabulary gaps:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary gaps' });
  }
};
