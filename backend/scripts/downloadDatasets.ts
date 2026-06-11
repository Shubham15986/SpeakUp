import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

export function parseCOCA(csvPath: string) {
  if (!fs.existsSync(csvPath)) {
    console.warn('COCA CSV not found at', csvPath);
    console.warn('Download from: https://www.wordfrequency.info/samples.asp');
    console.warn('Save as: scripts/data/coca_5000.csv');
    return [];
  }

  const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').slice(1);
  const words = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const [rank, word, pos] = line.split(',');
    if (!word || word.length < 2) continue;

    const typeMap: Record<string, string> = {
      n: 'general', v: 'general', j: 'general',
      r: 'general', i: 'connector', c: 'connector',
    };

    words.push({
      word:          word.toLowerCase().trim(),
      type:          typeMap[pos?.trim()] || 'general',
      frequencyRank: parseInt(rank),
      source:        'COCA',
    });
  }

  console.log(`Parsed ${words.length} words from COCA CSV`);
  return words;
}

export function parseAWL(txtPath: string) {
  if (!fs.existsSync(txtPath)) {
    console.warn('AWL headwords not found at', txtPath);
    console.warn('Download from: https://www.victoria.ac.nz/lals/resources/academicwordlist');
    console.warn('Extract headwords and save as: scripts/data/awl_headwords.txt');
    return [];
  }

  const lines = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const words = lines
    .map(l => l.trim().toLowerCase())
    .filter(l => l.length > 1)
    .map((word) => ({
      word,
      type:          'awl',
      frequencyRank: null,
      source:        'AWL',
    }));

  console.log(`Parsed ${words.length} words from AWL`);
  return words;
}
