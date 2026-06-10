import { apiFetch } from "../lib/api";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Insights = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.id) return;
      try {
        const res = await apiFetch(`http://localhost:5001/api/insights?userId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch insights');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col pt-md pb-[80px]">
      <section className="px-margin-mobile mb-lg md:px-margin-desktop">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-md font-bold">Performance Insights</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
             <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
          </div>
        ) : !stats || stats.totalSessions === 0 ? (
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant rounded-xl p-6 flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
            <h3 className="font-title-md text-on-surface font-bold">No Data Yet</h3>
            <p className="font-body-md text-on-surface-variant max-w-md">Complete your first interview session to see your performance insights!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md mb-lg">
            <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-sm md:p-md flex flex-col justify-between items-center text-center aspect-square md:aspect-auto md:h-32">
              <span className="material-symbols-outlined text-primary mb-1 text-[20px]">model_training</span>
              <span className="font-display text-[32px] md:text-[40px] leading-none font-bold text-on-surface">{stats.totalSessions}</span>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Total Sessions</span>
            </div>
            <div className="bg-primary border-[0.5px] border-primary rounded-xl p-sm md:p-md flex flex-col justify-between items-center text-center aspect-square md:aspect-auto md:h-32">
              <span className="material-symbols-outlined text-on-primary-fixed-variant mb-1 text-[20px]">psychiatry</span>
              <span className="font-display text-[32px] md:text-[40px] leading-none font-bold text-on-primary">{stats.averageClarity}</span>
              <span className="font-label-sm text-on-primary-fixed-variant uppercase tracking-wider">Avg Clarity</span>
            </div>
            <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-sm md:p-md flex flex-col justify-between items-center text-center col-span-2 md:col-span-2 md:h-32">
              <span className="material-symbols-outlined text-error mb-1 text-[20px]">record_voice_over</span>
              <span className="font-display text-[32px] md:text-[40px] leading-none font-bold text-on-surface">{stats.topMistakes.length > 0 ? stats.topMistakes[0].word : 'None'}</span>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Top Filler Word</span>
            </div>
          </div>
        )}
      </section>

      {stats && stats.topMistakes.length > 0 && (
        <section className="px-margin-mobile mb-lg md:px-margin-desktop">
          <h3 className="font-title-lg text-title-lg text-on-background mb-sm">Top Mistakes</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-sm">
            {stats.topMistakes.map((mistake: any, idx: number) => (
              <div key={idx} className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-sm flex flex-col justify-between">
                <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                </div>
                <h4 className="font-label-md text-label-md font-semibold line-clamp-2">{mistake.word}</h4>
                <div className="mt-xs flex items-baseline gap-xs">
                  <span className="font-code-inline text-[18px] font-bold text-error">{mistake.count}</span>
                  <span className="font-code-inline text-[10px] text-outline-variant">times</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
