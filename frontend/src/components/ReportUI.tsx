import { useState } from 'react';

interface ReportProps {
  report: {
    clarityScore: number;
    grammarErrors: { original: string; correction: string; explanation: string }[];
    fillerWords: { word: string; count: number; suggestion: string }[];
    vocabularyGaps: { weakWord: string; strongAlternatives: string[]; context: string }[];
    strengths: string[];
    aiSuggestions: { title: string; exercise: string }[];
    transcript: string;
  };
  onClose: () => void;
}

export const ReportUI = ({ report, onClose }: ReportProps) => {
  const [activeMistake, setActiveMistake] = useState<any>(null);

  // Helper to render highlighted transcript (basic implementation)
  const renderHighlightedTranscript = () => {
    let html = report.transcript;
    
    // Highlight fillers (yellow)
    report.fillerWords.forEach(filler => {
      const regex = new RegExp(`\\b(${filler.word})\\b`, 'gi');
      html = html.replace(regex, `<span class="bg-warning/30 text-warning font-bold px-1 rounded cursor-pointer border-[0.5px] border-warning/50" data-type="filler" data-word="$1">$&</span>`);
    });

    // Highlight vocab gaps (purple)
    report.vocabularyGaps.forEach(gap => {
      const regex = new RegExp(`\\b(${gap.weakWord})\\b`, 'gi');
      html = html.replace(regex, `<span class="bg-secondary-fixed/30 text-secondary font-bold px-1 rounded cursor-pointer border-[0.5px] border-secondary-fixed/50" data-type="vocab" data-word="$1">$&</span>`);
    });

    // Note: Grammar highlighting requires exact string matching which can be tricky if transcription doesn't perfectly match
    // For MVP, we'll just list grammar errors below.

    return (
      <div 
        className="font-body-lg leading-relaxed text-on-surface p-4 bg-surface rounded-lg border-[0.5px] border-outline-variant"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e: any) => {
          // Simple delegation for clicks on highlighted spans
          if(e.target.tagName === 'SPAN') {
            const type = e.target.getAttribute('data-type');
            const word = e.target.getAttribute('data-word');
            if(type === 'filler') {
              const info = report.fillerWords.find(f => f.word.toLowerCase() === word?.toLowerCase());
              if(info) setActiveMistake({ type: 'Filler Word', original: word, suggestion: info.suggestion, explanation: 'Try pausing instead of using filler words.' });
            }
            if(type === 'vocab') {
              const info = report.vocabularyGaps.find(v => v.weakWord.toLowerCase() === word?.toLowerCase());
              if(info) setActiveMistake({ type: 'Vocabulary Gap', original: word, suggestion: info.strongAlternatives.join(', '), explanation: info.context });
            }
          }
        }}
      />
    );
  };

  const totalFillers = report.fillerWords.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="flex flex-col gap-lg pb-24 relative">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-lg text-headline-lg font-bold">Analysis Report</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-primary-container text-on-primary-container rounded-xl p-4 flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="font-display text-4xl font-bold">{report.clarityScore}</span>
          <span className="font-label-md text-[12px] opacity-80 uppercase tracking-wider">Clarity</span>
        </div>
        <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-1">
          <span className="font-display text-4xl font-bold text-warning">{totalFillers}</span>
          <span className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider">Fillers</span>
        </div>
        <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-1">
          <span className="font-display text-4xl font-bold text-error">{report.grammarErrors.length}</span>
          <span className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider">Grammar</span>
        </div>
      </div>

      {/* Transcript with Highlights */}
      <section className="flex flex-col gap-2">
        <h3 className="font-headline-md font-semibold">Transcript</h3>
        <p className="font-label-md text-on-surface-variant mb-2">Tap highlighted words for AI suggestions.</p>
        {renderHighlightedTranscript()}
      </section>

      {/* Active Mistake Drawer / Card */}
      {activeMistake && (
        <div className="bg-surface-container-high border-[0.5px] border-outline-variant rounded-xl p-4 flex flex-col gap-2 shadow-md animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start">
            <span className="font-label-md bg-primary-container/20 text-primary px-2 py-1 rounded text-[12px] font-bold uppercase tracking-wider">
              {activeMistake.type}
            </span>
            <button onClick={() => setActiveMistake(null)}><span className="material-symbols-outlined text-[18px]">close</span></button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-body-lg text-error line-through">{activeMistake.original}</span>
            <span className="material-symbols-outlined text-outline">arrow_forward</span>
            <span className="font-body-lg font-bold text-success">{activeMistake.suggestion}</span>
          </div>
          <p className="font-body-md text-on-surface-variant mt-2">{activeMistake.explanation}</p>
        </div>
      )}

      {/* Expandable Sections (Simplified for MVP) */}
      <section className="flex flex-col gap-4">
        {report.grammarErrors.length > 0 && (
          <div className="bg-error-container/20 border-[0.5px] border-error-container rounded-xl p-4 flex flex-col gap-3">
            <h3 className="font-headline-md text-on-error-container font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined">spellcheck</span> Grammar Errors
            </h3>
            {report.grammarErrors.map((err, i) => (
              <div key={i} className="flex flex-col gap-1 bg-surface-container-lowest p-3 rounded-lg border-[0.5px] border-outline-variant">
                <p className="text-error line-through">{err.original}</p>
                <p className="text-success font-bold">{err.correction}</p>
                <p className="text-[14px] text-on-surface-variant mt-1">{err.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-headline-md text-primary font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined">lightbulb</span> AI Action Plan
          </h3>
          <ul className="flex flex-col gap-3">
            {report.aiSuggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-1 text-[20px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-bold">{sug.title}</span>
                  <span className="text-on-surface-variant text-[14px]">{sug.exercise}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
