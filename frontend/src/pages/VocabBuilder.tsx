import { apiFetch } from "../lib/api";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const VocabBuilder = () => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [vocabGaps, setVocabGaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVocab = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const res = await apiFetch(`http://localhost:5001/api/vocab/gaps?userId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch vocabulary');
        const data = await res.json();
        setVocabGaps(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocab();
  }, [user]);

  const toggleCard = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="px-margin-mobile pt-lg flex flex-col gap-6 md:px-margin-desktop min-h-screen max-w-5xl mx-auto w-full pb-32">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Vocabulary Builder</h1>
        <p className="font-body-md text-body-md text-on-surface-variant font-bold">Review your weak words from past interviews and learn stronger alternatives.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
           <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
        </div>
      ) : error ? (
        <div className="text-error bg-error-container/20 p-4 rounded-xl border border-error-container">
          Error loading vocabulary: {error}
        </div>
      ) : vocabGaps.length === 0 ? (
        <div className="mt-8 bg-surface-container-low border-[0.5px] border-outline-variant rounded-xl p-6 flex flex-col items-center text-center gap-2">
          <span className="material-symbols-outlined text-primary text-4xl">celebration</span>
          <h3 className="font-title-md text-on-surface">No Weak Words Yet!</h3>
          <p className="font-body-md text-on-surface-variant max-w-md">
            Complete an interview or deep analysis session, and if the AI detects repetitive filler words or weak vocabulary, they will appear here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {vocabGaps.map((vocab) => {
            const isFlipped = flippedCards[vocab.id];
            return (
              <div 
                key={vocab.id} 
                className="relative h-64 w-full cursor-pointer perspective-1000"
                onClick={() => toggleCard(vocab.id)}
              >
                <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* Front of Card (Weak Word) */}
                  <div className="absolute w-full h-full backface-hidden bg-error-container/20 border-[0.5px] border-error-container rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
                    <span className="font-label-md text-error uppercase tracking-widest bg-error/10 px-3 py-1 rounded-full">Weak Word</span>
                    <h2 className="font-display text-4xl text-on-error-container font-bold line-through opacity-80">{vocab.weakWord}</h2>
                    <p className="font-body-sm text-on-surface-variant mt-2">Tap to flip</p>
                  </div>

                  {/* Back of Card (Strong Alternatives) */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-primary-container border-[0.5px] border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
                    <span className="font-label-md text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Strong Alternatives</span>
                    <div className="flex flex-col gap-2">
                      {vocab.strongAlternatives.map((alt: string, i: number) => (
                        <span key={i} className="font-title-lg text-on-primary-container font-bold">{alt}</span>
                      ))}
                    </div>
                    <p className="font-body-sm text-on-primary-container/80 mt-2 italic text-[12px] leading-tight max-w-[80%]">"{vocab.context}"</p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
