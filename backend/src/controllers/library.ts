import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_VOCAB = [
  { word: 'Synthesize', category: 'Power Words', definition: 'To combine multiple elements or ideas into a coherent whole.', example: 'We need to synthesize the data from both APIs.' },
  { word: 'Leverage', category: 'Power Words', definition: 'To use something to maximum advantage.', example: 'We can leverage the existing caching layer.' },
  { word: 'Orchestrate', category: 'Power Words', definition: 'To arrange or direct the elements of a situation to produce a desired effect.', example: 'Kubernetes will orchestrate the deployment.' },
  { word: 'On the same page', category: 'Idioms', definition: 'Having a shared understanding or agreement.', example: 'Let us make sure we are on the same page.' },
  { word: 'Furthermore', category: 'Connectors', definition: 'In addition; besides.', example: 'Furthermore, this approach reduces latency.' },
  { word: 'Consequently', category: 'Transition Phrases', definition: 'As a result.', example: 'Consequently, the server crashed.' },
  { word: 'Mitigate', category: 'Power Words', definition: 'Make less severe, serious, or painful.', example: 'This patch will mitigate the security risk.' },
  { word: 'Robust', category: 'Power Words', definition: 'Strong and healthy; vigorous.', example: 'We need a robust solution for data validation.' },
  { word: 'Scalable', category: 'Power Words', definition: 'Able to be changed in size or scale.', example: 'This architecture is highly scalable.' },
  { word: 'Bottleneck', category: 'Idioms', definition: 'A point of congestion in a system.', example: 'The database query is the main bottleneck.' },
  { word: 'Refactor', category: 'Power Words', definition: 'Restructure code without changing external behavior.', example: 'We should refactor this component before adding features.' },
  { word: 'Technical Debt', category: 'Idioms', definition: 'The implied cost of additional rework caused by choosing an easy solution now.', example: 'We need to pay down some technical debt this sprint.' },
  { word: 'Paradigm shift', category: 'Idioms', definition: 'A fundamental change in approach or underlying assumptions.', example: 'Moving to serverless is a paradigm shift.' },
  { word: 'Iterate', category: 'Power Words', definition: 'Perform or utter repeatedly.', example: 'We will iterate on this design based on feedback.' },
  { word: 'Deprecate', category: 'Power Words', definition: 'Express disapproval of (a feature or practice, typically one that is obsolete).', example: 'We plan to deprecate the v1 API next month.' },
];

export const getLibrary = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Auto-seed if empty for this user
    const existing = await prisma.libraryItem.count({ where: { userId: String(userId) } });
    
    if (existing === 0) {
      // Seed
      await prisma.libraryItem.createMany({
        data: SEED_VOCAB.map(item => ({
          userId: String(userId),
          word: item.word,
          category: item.category,
          definition: item.definition,
          example: item.example,
          isCustom: false,
          isMarked: false,
        }))
      });
    }

    const items = await prisma.libraryItem.findMany({
      where: { userId: String(userId) },
      orderBy: { word: 'asc' }
    });

    res.status(200).json(items);
  } catch (error: any) {
    console.error('Error fetching library:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
};

export const addCustomWord = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, word, category, definition, example } = req.body;
    if (!userId || !word) return res.status(400).json({ error: 'Missing required fields' });

    const newItem = await prisma.libraryItem.create({
      data: {
        userId,
        word,
        category: category || 'Custom',
        definition,
        example,
        isCustom: true,
        isMarked: true, // Auto-mark custom words
      }
    });

    res.status(201).json(newItem);
  } catch (error: any) {
    console.error('Error adding custom word:', error);
    res.status(500).json({ error: 'Failed to add custom word' });
  }
};

export const toggleMark = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { isMarked } = req.body;

    const updated = await prisma.libraryItem.update({
      where: { id: String(id) },
      data: { isMarked }
    });

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('Error toggling mark:', error);
    res.status(500).json({ error: 'Failed to toggle mark' });
  }
};
