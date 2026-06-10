import { useState, useRef, useEffect } from 'react';

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface RecordingStudioProps {
  onTranscriptionComplete: (transcript: string) => void;
  context?: string;
}

export const RecordingStudio = ({ onTranscriptionComplete, context = "Deep Analysis" }: RecordingStudioProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
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
      setIsAnalyzing(true);
      // Simulate a small delay before sending to parent
      setTimeout(() => {
        onTranscriptionComplete(transcript);
        setIsAnalyzing(false);
      }, 1000);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-md bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl gap-lg">
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-headline-md text-headline-md font-bold">{context}</h3>
        <p className="font-body-md text-on-surface-variant text-center max-w-sm">
          Tap the microphone and start speaking. We'll transcribe and analyze your communication patterns.
        </p>
      </div>

      {/* Transcript Preview Area */}
      <div className="w-full min-h-[120px] bg-surface-container p-md rounded-lg border-[0.5px] border-outline-variant max-h-[200px] overflow-y-auto">
        {transcript ? (
          <p className="font-body-lg text-body-lg text-on-surface">{transcript}</p>
        ) : (
          <p className="font-body-md text-outline-variant italic text-center mt-6">Your live transcript will appear here...</p>
        )}
      </div>

      {/* Microphone Button */}
      <div className="relative flex items-center justify-center mt-sm">
        {isRecording && (
          <div className="absolute w-24 h-24 bg-error/20 rounded-full animate-ping"></div>
        )}
        <button 
          onClick={toggleRecording}
          disabled={isAnalyzing}
          className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-colors shadow-lg
            ${isRecording 
              ? 'bg-error text-on-error hover:bg-error/90' 
              : 'bg-primary-container text-on-primary-container hover:bg-primary-container/90'
            }
            ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isAnalyzing ? (
             <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
          ) : (
             <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
               {isRecording ? 'stop' : 'mic'}
             </span>
          )}
        </button>
      </div>
      
      {isAnalyzing && (
        <p className="font-label-md text-primary animate-pulse mt-2">Analyzing your speech...</p>
      )}
      {isRecording && (
        <p className="font-label-md text-error animate-pulse mt-2">Recording...</p>
      )}
    </div>
  );
};
