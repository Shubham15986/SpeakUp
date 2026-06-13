import { apiFetch } from "../lib/api";

import { useState } from 'react';
import { RecordingStudio } from '../components/RecordingStudio';
import { ReportUI } from '../components/ReportUI';
import { Timer } from '../components/Timer';
import { useAuth } from '../context/AuthContext';

export const CustomSimulator = () => {
  const [topic, setTopic] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const { user } = useAuth();

  const startInterview = () => {
    if (!topic.trim()) return;
    setActiveTopic(topic.trim());
  };

  const handleAnalysis = async (input: { transcript?: string, file?: File }) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('context', `Custom Interview Topic: ${activeTopic}`);
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
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Custom Topic Simulator</h1>
        <p className="font-body-md text-body-md text-on-surface-variant font-bold">Practice speaking about any technical topic or system design.</p>
      </div>

      {!activeTopic ? (
        <div className="bg-surface-container rounded-xl p-6 border-[0.5px] border-outline-variant flex flex-col gap-4 max-w-4xl w-full min-w-[300px]">
          <label className="font-label-lg text-on-surface block">Interview Topic</label>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input 
              type="text" 
              className="flex-1 bg-surface border-[0.5px] border-outline-variant rounded-lg px-4 py-2 text-on-surface font-body-md focus:outline-none focus:border-primary w-full"
              placeholder="e.g., React Hooks, System Design for Twitter, OOPS concepts..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startInterview()}
            />
            <button 
              onClick={startInterview}
              disabled={!topic.trim()}
              className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Start Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Topic Panel */}
          <div className="flex-1 bg-surface-container rounded-xl p-6 border-[0.5px] border-outline-variant max-h-[70vh] overflow-y-auto w-full">
            <div className="flex flex-col gap-2 mb-4">
              <span className="font-label-md text-primary tracking-widest uppercase">Current Topic</span>
              <h2 className="font-title-lg text-title-lg text-on-surface">{activeTopic}</h2>
            </div>
            
            <p className="font-body-md text-on-surface-variant mb-6">
              You will be evaluated on your understanding and communication of this topic. Speak clearly and explain your thoughts as if you were talking to an interviewer.
            </p>
            
            <button 
              onClick={() => setActiveTopic(null)}
              className="text-primary font-label-md hover:underline"
            >
              Change Topic
            </button>
          </div>

          {/* Recording Panel */}
          <div className="flex-1 w-full flex flex-col gap-6 sticky top-6">
            <div className="flex justify-between items-center bg-surface-container p-4 rounded-xl border-[0.5px] border-outline-variant">
              <span className="font-title-md text-on-surface">Interview Timer</span>
              <Timer initialMinutes={10} />
            </div>
            
            {error && (
               <div className="bg-error-container text-on-error-container p-3 rounded-lg font-label-md flex items-start gap-2 border-[0.5px] border-error-container">
                 <span className="material-symbols-outlined text-[18px]">error</span>
                 <span>{error}</span>
               </div>
            )}
            <RecordingStudio 
              onAnalyzeRequested={async (t) => handleAnalysis({ transcript: t })} 
              context={`Explaining ${activeTopic}`} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
