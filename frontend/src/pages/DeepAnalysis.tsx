import { apiFetch } from "../lib/api";

import { useState } from 'react';
import { RecordingStudio } from '../components/RecordingStudio';
import { ReportUI } from '../components/ReportUI';
import { useAuth } from '../context/AuthContext';

export const DeepAnalysis = () => {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAnalysis = async (input: { transcript?: string, file?: File }) => {
    try {
      setError(null);
      
      const formData = new FormData();
      formData.append('context', 'General Speech Practice');
      formData.append('userId', user?.id || 'anonymous');
      
      if (input.file) {
        formData.append('audio', input.file);
      } else if (input.transcript) {
        formData.append('transcript', input.transcript);
      } else {
        throw new Error("No input provided.");
      }

      // For local development, assume backend runs on 5001.
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

  return (
    <div className="px-margin-mobile pt-lg flex flex-col gap-6 md:px-margin-desktop min-h-screen">
      {!report ? (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Deep Analysis</h1>
            <p className="font-body-md text-body-md text-on-surface-variant font-bold">Freestyle speaking or upload an audio file for a complete grammatical and vocabulary breakdown.</p>
          </div>
          
          {error && (
             <div className="bg-error-container text-on-error-container p-3 rounded-lg font-label-md flex items-start gap-2 border-[0.5px] border-error-container">
               <span className="material-symbols-outlined text-[18px]">error</span>
               <span>{error}</span>
             </div>
          )}

          <RecordingStudio onAnalyzeRequested={async (t) => handleAnalysis({ transcript: t })} context="Freestyle Practice" />
        </>
      ) : (
        <ReportUI report={report} onClose={() => setReport(null)} />
      )}
    </div>
  );
};
