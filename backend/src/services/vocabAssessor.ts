import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WEAK_WORDS: Record<string, string[]> = {
  'very': ['highly', 'significantly', 'considerably'],
  'good': ['effective', 'robust', 'optimal', 'efficient'],
  'bad': ['inefficient', 'flawed', 'problematic', 'suboptimal'],
  'big': ['substantial', 'significant', 'considerable'],
  'use': ['leverage', 'apply', 'utilise', 'employ'],
  'show': ['demonstrate', 'illustrate', 'indicate'],
  'think': ['conclude', 'determine', 'assess', 'identify'],
  'basically': ['fundamentally', 'essentially', 'in essence'],
  'get': ['obtain', 'acquire', 'retrieve', 'achieve'],
  'make': ['create', 'generate', 'produce', 'establish'],
  'do': ['execute', 'perform', 'implement', 'carry out'],
  'things': ['aspects', 'components', 'factors', 'elements'],
  'stuff': ['material', 'content', 'components', 'data']
};

export interface VocabResult {
  strongWords: string[];
  weakWords: { word: string; suggestions: string[] }[];
}

export const assessVocabulary = async (transcript: string): Promise<VocabResult> => {
  const text = transcript.toLowerCase();
  const words = text.match(/\\b[a-z]+\\b/g) || [];
  const uniqueWords = Array.from(new Set(words));

  const weakWordsFound: { word: string; suggestions: string[] }[] = [];
  const strongWordsFound: string[] = [];

  for (const word of uniqueWords) {
    if (WEAK_WORDS[word]) {
      weakWordsFound.push({
        word,
        suggestions: WEAK_WORDS[word]
      });
    }
  }

  // Find strong words by checking our libraryWord DB
  // For performance, we check in one big query instead of N queries
  if (uniqueWords.length > 0) {
    const dbWords = await prisma.libraryWord.findMany({
      where: {
        word: { in: uniqueWords }
      },
      select: { word: true, frequencyRank: true, type: true }
    });

    for (const dbW of dbWords) {
      // If it has a frequency rank > 1000 or is a specialized type, it's strong
      if ((dbW.frequencyRank && dbW.frequencyRank > 1000) || dbW.type !== 'general') {
        strongWordsFound.push(dbW.word);
      }
    }
  }

  return {
    strongWords: strongWordsFound,
    weakWords: weakWordsFound
  };
};
