import { useState } from 'react';
import { RecordingStudio } from '../components/RecordingStudio';
import { ReportUI } from '../components/ReportUI';
import { useAuth } from '../context/AuthContext';

export const DeepAnalysis = () => {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleTranscriptionComplete = async (transcript: string) => {
    try {
      setError(null);
      // In a real app, you would point this to your backend URL.
      // For local development, assume backend runs on 5000.
      const response = await fetch('http://localhost:5000/api/analysis/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          context: 'General Speech Practice',
          userId: user?.id || 'anonymous'
        }),
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
            <h1 className="font-headline-md text-headline-md text-on-surface">Deep Analysis</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Record your speech and get instant, AI-driven feedback on clarity, grammar, and vocabulary.</p>
          </div>
          
          {error && (
             <div className="bg-error-container text-on-error-container p-3 rounded-lg font-label-md flex items-start gap-2 border-[0.5px] border-error-container">
               <span className="material-symbols-outlined text-[18px]">error</span>
               <span>{error}</span>
             </div>
          )}

          <RecordingStudio onTranscriptionComplete={handleTranscriptionComplete} context="Freestyle Practice" />
        </>
      ) : (
        <ReportUI report={report} onClose={() => setReport(null)} />
      )}
    </div>
  );
};
