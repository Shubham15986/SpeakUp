import { apiFetch } from "../lib/api";

import { useState } from 'react';
import { RecordingStudio } from '../components/RecordingStudio';
import { ReportUI } from '../components/ReportUI';
import { Timer } from '../components/Timer';
import { useAuth } from '../context/AuthContext';

export const DSASimulator = () => {
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const { user } = useAuth();

  const extractQuestion = async () => {
    if (!url) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiFetch('http://localhost:5001/api/scraper/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract question');
      setQuestion(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysis = async (input: { transcript?: string, file?: File }) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('context', `DSA Interview: ${question.title}. Description: ${question.description.substring(0, 500)}...`);
      formData.append('userId', user?.id || 'anonymous');
      
      if (input.file) {
        formData.append('audio', input.file);
      } else if (input.transcript) {
        formData.append('transcript', input.transcript);
      } else {
        throw new Error("No input provided.");
      }

      const response = await apiFetch('http://localhost:5001/api/analysis/report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze transcript');
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
      console.error(err);
    }
  };

  if (report) {
    return <div className="px-margin-mobile pt-lg md:px-margin-desktop"><ReportUI report={report} onClose={() => setReport(null)} /></div>;
  }

  return (
    <div className="px-margin-mobile pt-lg flex flex-col gap-6 md:px-margin-desktop min-h-screen max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">DSA Simulator</h1>
        <p className="font-body-md text-body-md text-on-surface-variant font-bold">Practice answering technical algorithms questions aloud.</p>
      </div>

      {!question ? (
        <div className="bg-surface-container rounded-xl p-6 border-[0.5px] border-outline-variant flex flex-col gap-4 max-w-2xl w-full">
          <label className="font-label-lg text-on-surface">LeetCode URL or Problem Number</label>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input 
              type="text" 
              className="flex-1 bg-surface border-[0.5px] border-outline-variant rounded-lg px-4 py-2 text-on-surface font-body-md focus:outline-none focus:border-primary w-full"
              placeholder="e.g. 1 or https://leetcode.com/problems/two-sum/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={extractQuestion}
              disabled={isLoading || !url}
              className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Extracting...' : 'Start Interview'}
            </button>
          </div>
          {error && <p className="text-error font-body-sm mt-1">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Question Panel */}
          <div className="flex-1 bg-surface-container rounded-xl p-6 border-[0.5px] border-outline-variant max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-title-lg text-title-lg text-on-surface">{question.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty}
              </span>
            </div>
            
            <div className="flex gap-2 flex-wrap mb-6">
              {question.topics.map((t: string) => (
                <span key={t} className="bg-surface border-[0.5px] border-outline-variant px-3 py-1 rounded-full text-sm text-on-surface-variant">
                  {t}
                </span>
              ))}
            </div>

            <div className="prose prose-sm max-w-none text-on-surface whitespace-pre-wrap">
              {question.description}
            </div>
            
            <button 
              onClick={() => setQuestion(null)}
              className="mt-8 text-primary font-label-md hover:underline"
            >
              Choose different question
            </button>
          </div>

          {/* Recording Panel */}
          <div className="flex-1 w-full flex flex-col gap-6 sticky top-6">
            <div className="flex justify-between items-center bg-surface-container p-4 rounded-xl border-[0.5px] border-outline-variant">
              <span className="font-title-md text-on-surface">Interview Timer</span>
              <Timer initialMinutes={20} />
            </div>
            
            {error && (
               <div className="bg-error-container text-on-error-container p-3 rounded-lg font-label-md flex items-start gap-2 border-[0.5px] border-error-container">
                 <span className="material-symbols-outlined text-[18px]">error</span>
                 <span>{error}</span>
               </div>
            )}
            <RecordingStudio 
              onAnalyzeRequested={async (t) => handleAnalysis({ transcript: t })} 
              context={`Explaining ${question.title}`} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
