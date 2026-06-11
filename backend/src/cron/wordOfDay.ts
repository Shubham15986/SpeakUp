import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { fetchDictionaryData } from '../services/vocab';

const prisma = new PrismaClient();

cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Word of the Day refresh starting...');
  try {
    const count = await prisma.libraryWord.count();
    const skip = Math.floor(Math.random() * count);
    const random = await prisma.libraryWord.findFirst({ skip });
    
    if (!random) {
      console.warn('[CRON] No words in library — skipping');
      return;
    }

    const live = await fetchDictionaryData(random.word);

    await prisma.wordOfDay.deleteMany({});
    await prisma.wordOfDay.create({
      data: {
        word: random.word,
        phonetic: live?.phonetic || random.phonetic || null,
        audioUrl: live?.audioUrl || random.audioUrl || null,
        definition: live?.definition || random.definition,
        example: live?.example || random.example || null,
        synonyms: live?.synonyms || random.synonyms || [],
        type: random.type,
        sourceWordId: random.id,
        date: new Date(),
      },
    });
    console.log(`[CRON] Word of the Day set: "${random.word}"`);
  } catch (err: any) {
    console.error('[CRON] Error:', err.message);
  }
});
