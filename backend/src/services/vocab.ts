export async function fetchDictionaryData(word: string) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    const entry = data[0];
    if (!entry) return null;

    const meaning = entry.meanings?.[0];
    const def = meaning?.definitions?.[0];

    return {
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || null,
      audioUrl: entry.phonetics?.find((p: any) => p.audio?.length > 0)?.audio || null,
      type: meaning?.partOfSpeech || 'general',
      definition: def?.definition || '',
      example: def?.example || '',
      synonyms: [...(def?.synonyms || []), ...(meaning?.synonyms || [])].slice(0, 5),
    };
  } catch {
    return null;
  }
}

export async function fetchAlternatives(word: string, count = 5) {
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=${count}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const data: any = await res.json();
    return data.map((w: any) => w.word);
  } catch {
    return [];
  }
}

export async function enrichWeakWord(weakWord: string) {
  const [dictData, alternatives] = await Promise.all([
    fetchDictionaryData(weakWord),
    fetchAlternatives(weakWord),
  ]);

  if (!dictData) return null;

  return {
    word: dictData.word,
    phonetic: dictData.phonetic,
    audioUrl: dictData.audioUrl,
    type: dictData.type,
    definition: dictData.definition,
    example: dictData.example,
    synonyms: dictData.synonyms,
    alternatives,
  };
}
