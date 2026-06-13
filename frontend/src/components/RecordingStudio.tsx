import { apiFetch } from "../lib/api";

import { useState, useRef, useEffect } from 'react';

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface RecordingStudioProps {
  onAnalyzeRequested: (transcript: string) => Promise<void>;
  context?: string;
}

export const RecordingStudio = ({ onAnalyzeRequested, context = "Deep Analysis" }: RecordingStudioProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript((finalTranscriptRef.current + interimTranscript).trim());
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      finalTranscriptRef.current = '';
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleAudioUpload = async (file: File) => {
    try {
      setIsTranscribing(true);
      finalTranscriptRef.current = '';
      setTranscript(''); // Clear previous
      
      const formData = new FormData();
      formData.append('audio', file);
      
      const res = await apiFetch('http://localhost:5001/api/analysis/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Failed to transcribe');
      
      const data = await res.json();
      setTranscript(data.transcript);
    } catch (err) {
      console.error(err);
      alert('Error transcribing audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!transcript.trim()) return;
    try {
      setIsAnalyzing(true);
      await onAnalyzeRequested(transcript);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-md bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl gap-lg w-full">
      <div className="flex flex-col items-center gap-2 w-full px-4">
        <h3 className="font-headline-md text-headline-md font-bold text-center w-full">{context}</h3>
        <p className="font-body-md text-on-surface-variant text-center max-w-md w-full">
          Tap the microphone or upload an audio file. Review your transcript, then click Analyze.
        </p>
      </div>

      {/* Transcript Preview Area */}
      <div className="w-full min-h-[120px] bg-surface-container p-md rounded-lg border-[0.5px] border-outline-variant max-h-[200px] overflow-y-auto relative">
        {isTranscribing ? (
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
           </div>
        ) : transcript ? (
          <p className="font-body-lg text-body-lg text-on-surface">{transcript}</p>
        ) : (
          <p className="font-body-md text-outline-variant italic text-center mt-6">Your transcript will appear here...</p>
        )}
      </div>

      {/* Controls Area */}
      <div className="flex flex-col items-center gap-4 mt-sm w-full">
        
        {transcript && !isRecording && !isTranscribing ? (
          // Analyze Button View
          <div className="flex gap-4">
            <button 
              onClick={() => {
                finalTranscriptRef.current = '';
                setTranscript('');
              }}
              disabled={isAnalyzing}
              className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-label-lg border-[0.5px] border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Clear
            </button>
            <button 
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                 <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                 <span className="material-symbols-outlined">analytics</span>
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Speech'}
            </button>
          </div>
        ) : (
          // Recording / Upload View
          <>
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <div className="absolute w-24 h-24 bg-error/20 rounded-full animate-ping"></div>
              )}
              <button 
                onClick={toggleRecording}
                disabled={isTranscribing}
                className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-colors
                  ${isRecording 
                    ? 'bg-error text-on-error hover:bg-error/90' 
                    : 'bg-primary-container text-on-primary-container hover:bg-primary-container/90'
                  }
                  ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                 <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                   {isRecording ? 'stop' : 'mic'}
                 </span>
              </button>
            </div>
            
            {!isRecording && (
              <div className="flex items-center gap-2 text-on-surface-variant font-label-md mt-2">
                <span>or</span>
                <label className="cursor-pointer text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  Upload Audio File
                  <input 
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAudioUpload(file);
                    }} 
                  />
                </label>
              </div>
            )}
          </>
        )}
      </div>
      
      {isRecording && (
        <p className="font-label-md text-error animate-pulse mt-2">Recording...</p>
      )}
    </div>
  );
};
