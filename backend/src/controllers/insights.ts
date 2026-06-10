import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInsights = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: String(userId) },
      include: { report: true },
      orderBy: { startedAt: 'desc' }
    });

    if (sessions.length === 0) {
      return res.status(200).json({
        totalSessions: 0,
        averageClarity: 0,
        topMistakes: [],
        recentActivity: []
      });
    }

    let totalClarity = 0;
    let reportCount = 0;
    const mistakeCounts: Record<string, number> = {};

    sessions.forEach(session => {
      const report: any = session.report;
      if (report) {
        totalClarity += report.clarityScore || 0;
        reportCount++;

        if (Array.isArray(report.fillerWords)) {
          report.fillerWords.forEach((fw: any) => {
            const word = fw.word.toLowerCase();
            mistakeCounts[word] = (mistakeCounts[word] || 0) + (fw.count || 1);
          });
        }
      }
    });

    const averageClarity = reportCount > 0 ? Math.round(totalClarity / reportCount) : 0;

    const topMistakes = Object.entries(mistakeCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentActivity = sessions.slice(0, 7).map(s => ({
      date: s.startedAt.toISOString().split('T')[0],
      type: s.type,
      score: s.score || 0
    })).reverse(); // Oldest to newest for a chart if needed

    // Calculate weekly sessions
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklySessions = sessions.filter(s => new Date(s.startedAt) >= oneWeekAgo).length;

    // Calculate basic streak (consecutive days)
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dates = Array.from(new Set(sessions.map(s => new Date(s.startedAt).toISOString().split('T')[0]))).sort().reverse();
    
    for (const dateStr of dates) {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(currentDate.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = d;
      } else {
        break;
      }
    }

    res.status(200).json({
      totalSessions: sessions.length,
      weeklySessions,
      streak,
      averageClarity,
      topMistakes,
      recentActivity
    });
  } catch (error: any) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
};
