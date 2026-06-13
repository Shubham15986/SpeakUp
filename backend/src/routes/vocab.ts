import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { fetchDictionaryData, enrichWeakWord } from '../services/vocab';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/vocab/library
router.get('/library', requireAuth, async (req, res) => {
  const { type, page = '1', limit = '20', search } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const where: any = {
    ...(type ? { type } : {}),
    ...(search ? { word: { contains: search as string, mode: 'insensitive' } } : {}),
  };

  const [words, total] = await Promise.all([
    prisma.libraryWord.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      orderBy: { frequencyRank: { sort: 'asc', nulls: 'last' } },
    }),
    prisma.libraryWord.count({ where }),
  ]);

  res.json({ words, total, page: parseInt(page as string), limit: parseInt(limit as string) });
});

// GET /api/vocab/search?q=word
router.get('/search', requireAuth, async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string' || q.trim().length < 2) return res.json({ result: null });

  const term = q.trim().toLowerCase();

  let local = await prisma.libraryWord.findFirst({
    where: { word: { equals: term, mode: 'insensitive' } },
  });

  // If local exists but has no definition, let's fetch it on-demand and update the DB!
  if (local && !local.definition) {
    const dict = await fetchDictionaryData(term);
    if (dict && dict.definition) {
      local = await prisma.libraryWord.update({
        where: { id: local.id },
        data: {
          definition: dict.definition,
          example: dict.example,
          phonetic: dict.phonetic,
          audioUrl: dict.audioUrl,
          synonyms: dict.synonyms
        }
      });
    }
  }

  if (local) return res.json({ result: local, source: 'library' });

  const personal = await prisma.vocabulary.findFirst({
    where: { userId: req.user.id, word: { equals: term, mode: 'insensitive' } },
  });
  if (personal) return res.json({ result: personal, source: 'my_words' });

  const dict = await fetchDictionaryData(term);
  if (!dict) return res.json({ result: null, source: null });

  res.json({ result: dict, source: 'dictionary_api' });
});

// GET /api/vocab/word-of-day
router.get('/word-of-day', requireAuth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const wotd = await prisma.wordOfDay.findFirst({
    where: { date: { gte: today } },
  });
  if (wotd) return res.json({ result: wotd });

  const count = await prisma.libraryWord.count();
  const random = await prisma.libraryWord.findFirst({
    skip: Math.floor(Math.random() * count),
  });
  if (!random) return res.json({ result: null });

  res.json({ result: random, source: 'fallback' });
});

// POST /api/vocab/save
router.post('/save', requireAuth, async (req, res) => {
  const { word, type, definition, example, phonetic, audioUrl, synonyms } = req.body;
  const userId = req.user.id;

  const existing = await prisma.vocabulary.findFirst({
    where: { userId, word: { equals: word, mode: 'insensitive' } },
  });
  if (existing) return res.json({ saved: false, message: 'Already in My Words' });

  const saved = await prisma.vocabulary.create({
    data: { 
      userId, 
      word, 
      category: type || 'general', 
      definition: definition || '', 
      example: example || '' 
    },
  });
  res.json({ saved: true, entry: saved });
});

// GET /api/vocab/gaps
router.get('/gaps', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reports = await prisma.analysisReport.findMany({
      where: { session: { userId: userId } },
      select: { vocabularyGaps: true }
    });

    const gapsMap = new Map<string, any>();
    let idCounter = 1;
    for (const report of reports) {
      if (Array.isArray(report.vocabularyGaps)) {
        for (const gap of report.vocabularyGaps) {
          if (gap && gap.weakWord && !gapsMap.has(gap.weakWord.toLowerCase())) {
            gapsMap.set(gap.weakWord.toLowerCase(), {
              id: idCounter++, 
              weakWord: gap.weakWord,
              strongAlternatives: gap.strongAlternatives || [],
              context: gap.context || ''
            });
          }
        }
      }
    }

    res.json(Array.from(gapsMap.values()));
  } catch (error) {
    console.error('Failed to fetch vocab gaps:', error);
    res.status(500).json({ error: 'Failed to fetch vocab gaps' });
  }
});

export default router;
