

export const Insights = () => {
  return (
    <div className="pb-[80px] pt-sm px-margin-mobile flex flex-col gap-md">
      {/* Page Title */}
      <section className="py-sm">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Insights</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Tracking your communication progress.</p>
      </section>

      {/* Clarity Score Trend Chart Card */}
      <section className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-md flex flex-col gap-md">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="font-body-lg text-body-lg font-medium">Clarity Score</h3>
            <p className="font-label-md text-label-md text-on-surface-variant">Last 10 sessions</p>
          </div>
          <div className="flex items-center gap-xs text-secondary">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-label-md text-label-md">+12%</span>
          </div>
        </header>

        {/* Faux Line Chart Area */}
        <div className="h-32 w-full relative border-l-[0.5px] border-b-[0.5px] border-outline-variant flex items-end ml-4">
          <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between font-code-inline text-[10px] text-outline py-1">
            <span>100</span>
            <span>80</span>
            <span>60</span>
          </div>
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,80 L10,75 L20,60 L30,65 L40,50 L50,45 L60,30 L70,35 L80,20 L90,25 L100,10" fill="none" stroke="var(--color-primary-container)" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
            <path d="M0,100 L0,80 L10,75 L20,60 L30,65 L40,50 L50,45 L60,30 L70,35 L80,20 L90,25 L100,10 L100,100 Z" fill="url(#chartGradient)" opacity="0.2"></path>
            <defs>
              <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary-container)" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="var(--color-primary-container)" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <circle cx="100" cy="10" fill="var(--color-primary-container)" r="3" stroke="#ffffff" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></circle>
          </svg>
          <div className="absolute -bottom-4 w-full flex justify-between px-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-outline-variant"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Filler Word Count Chart Card */}
      <section className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-md flex flex-col gap-md">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="font-body-lg text-body-lg font-medium">Filler Words</h3>
            <p className="font-label-md text-label-md text-on-surface-variant">Count per minute</p>
          </div>
          <div className="flex items-center gap-xs text-secondary">
            <span className="material-symbols-outlined text-[16px]">trending_down</span>
            <span className="font-label-md text-label-md">-3.5</span>
          </div>
        </header>

        <div className="h-32 w-full relative flex items-end justify-between gap-1 mt-sm">
          {[90, 85, 95, 70, 60, 65, 50, 40, 45].map((h, i) => (
            <div key={i} className={`w-full bg-surface-container border-[0.5px] border-outline-variant rounded-t-sm relative group`} style={{ height: `${h}%` }}>
              {i === 0 && <div className="absolute -top-5 w-full text-center font-code-inline text-[10px] text-outline opacity-0 group-hover:opacity-100 transition-opacity">12</div>}
            </div>
          ))}
          <div className="w-full bg-primary-container rounded-t-sm relative group shadow-sm" style={{ height: '30%' }}>
            <div className="absolute -top-5 w-full text-center font-code-inline text-[10px] text-primary-container">4</div>
          </div>
        </div>
        <div className="flex justify-between w-full font-code-inline text-[10px] text-outline-variant mt-xs">
          <span>Older</span>
          <span>Recent</span>
        </div>
      </section>

      {/* Activity Heatmap */}
      <section className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-md flex flex-col gap-sm overflow-hidden">
        <header>
          <h3 className="font-body-lg text-body-lg font-medium">Activity Log</h3>
          <p className="font-label-md text-label-md text-on-surface-variant">Speaking practice over 12 weeks</p>
        </header>
        <div className="w-full overflow-x-auto hide-scrollbar pb-xs">
          <div className="flex gap-xs min-w-max items-end">
            <div className="flex flex-col gap-[3px] font-code-inline text-[10px] text-outline-variant mr-1 justify-around h-[84px] py-1">
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>
            <div className="flex gap-[3px]">
              {Array.from({ length: 12 }).map((_, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, d) => {
                    const intensity = Math.floor(Math.random() * 5);
                    const colorClass = intensity === 0 ? "bg-surface-container border-[0.5px] border-outline-variant" : 
                                       intensity === 1 ? "bg-primary-container/20" : 
                                       intensity === 2 ? "bg-primary-container/40" : 
                                       intensity === 3 ? "bg-primary-container/70" : "bg-primary-container";
                    return <div key={`${w}-${d}`} className={`w-[10px] h-[10px] rounded-[2px] ${colorClass}`}></div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-xs mt-xs font-code-inline text-[10px] text-outline-variant">
          <span>Less</span>
          <div className="flex gap-[2px]">
            <div className="w-[8px] h-[8px] rounded-[1px] bg-surface-container border-[0.5px] border-outline-variant"></div>
            <div className="w-[8px] h-[8px] rounded-[1px] bg-primary-container/20"></div>
            <div className="w-[8px] h-[8px] rounded-[1px] bg-primary-container/40"></div>
            <div className="w-[8px] h-[8px] rounded-[1px] bg-primary-container/70"></div>
            <div className="w-[8px] h-[8px] rounded-[1px] bg-primary-container"></div>
          </div>
          <span>More</span>
        </div>
      </section>

      {/* Priority Issues Bento Grid */}
      <section className="flex flex-col gap-sm">
        <h3 className="font-body-md text-body-md font-semibold text-on-surface ml-xs">Priority Focus Areas</h3>
        <div className="grid grid-cols-2 gap-sm">
          <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-sm">
              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            </div>
            <h4 className="font-label-md text-label-md font-semibold line-clamp-2">Overuse of "basically"</h4>
            <div className="mt-xs flex items-baseline gap-xs">
              <span className="font-code-inline text-[18px] font-bold text-error">42</span>
              <span className="font-code-inline text-[10px] text-outline-variant">times</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-sm">
              <span className="material-symbols-outlined text-[16px]">broken_image</span>
            </div>
            <h4 className="font-label-md text-label-md font-semibold line-clamp-2">Fragmented sentences</h4>
            <div className="mt-xs flex items-baseline gap-xs">
              <span className="font-code-inline text-[18px] font-bold text-tertiary">14</span>
              <span className="font-code-inline text-[10px] text-outline-variant">impact score</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
