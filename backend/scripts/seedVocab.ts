import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parseCOCA, parseAWL } from './downloadDatasets';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, 'data');

function loadJSON(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Missing: ${filePath} — skipping`);
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e: any) {
    console.warn(`Failed to parse ${filename}:`, e.message);
    return [];
  }
}

async function enrichFromDictionary(word: string) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;

    const data: any = await res.json();
    const entry = data[0];
    if (!entry) return null;

    const meaning = entry.meanings?.[0];
    const def = meaning?.definitions?.[0];

    return {
      phonetic: entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || null,
      audioUrl: entry.phonetics?.find((p: any) => p.audio && p.audio.length > 0)?.audio || null,
      definition: def?.definition || '',
      example: def?.example || null,
      synonyms: [
        ...(def?.synonyms || []),
        ...(meaning?.synonyms || []),
      ].slice(0, 5),
    };
  } catch {
    return null;
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedBatch(words: any[], batchLabel: string, skipEnrichment = false) {
  console.log(`\nSeeding ${words.length} words [${batchLabel}]...`);
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < words.length; i++) {
    const entry = words[i];
    if (!entry.word || entry.word.length < 2) { skipped++; continue; }

    const existing = await prisma.libraryWord.findUnique({
      where: { word: entry.word }
    });
    if (existing) { skipped++; continue; }

    let enriched = null;
    if (!skipEnrichment) {
      enriched = await enrichFromDictionary(entry.word);
      await sleep(200);
    }

    try {
      await prisma.libraryWord.create({
        data: {
          word: entry.word,
          type: entry.type || 'general',
          definition: entry.definition || enriched?.definition || '',
          example: entry.example || enriched?.example || null,
          phonetic: enriched?.phonetic || null,
          audioUrl: enriched?.audioUrl || null,
          synonyms: enriched?.synonyms || [],
          frequencyRank: entry.frequencyRank || null,
          source: entry.source || 'curated',
        },
      });
      inserted++;
    } catch (e: any) {
      console.warn(`  Failed to insert "${entry.word}":`, e.message);
      failed++;
    }

    if ((i + 1) % 100 === 0) {
      console.log(`  Progress: ${i + 1}/${words.length} (inserted:${inserted} skipped:${skipped} failed:${failed})`);
    }
  }

  console.log(`  Done [${batchLabel}]: inserted=${inserted} skipped=${skipped} failed=${failed}`);
}

async function seed() {
  console.log('=====================================');
  console.log('SpeakUp Vocab Library — Seed Script');
  console.log('=====================================\n');

  const cocaWords = parseCOCA(path.join(DATA_DIR, 'coca_5000.csv'));
  const awlWords = parseAWL(path.join(DATA_DIR, 'awl_headwords.txt'));

  const connectors = loadJSON('connectors.json');
  const idioms = loadJSON('idioms.json');
  const interviewPhrases = loadJSON('interview_phrases.json');
  const powerWords = loadJSON('power_words.json');

  awlWords.forEach((w: any) => { w.source = 'AWL'; });
  cocaWords.forEach((w: any) => { w.source = 'COCA'; });

  await seedBatch(connectors, 'connectors');
  await seedBatch(idioms, 'idioms');
  await seedBatch(interviewPhrases, 'interview_phrases');
  await seedBatch(powerWords, 'power_words');
  await seedBatch(awlWords, 'AWL');
  
  // Fast-forward: Skip API enrichment for COCA to save 10+ hours, and only use top 5000 words
  await seedBatch(cocaWords.slice(0, 5000), 'COCA-5000', true);

  const total = await prisma.libraryWord.count();
  console.log(`\nSeed complete. Total words in library_words: ${total}`);
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error('Seed failed:', e);
  prisma.$disconnect();
  process.exit(1);
});
