import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <div className="px-margin-mobile pt-lg flex flex-col gap-6 md:px-margin-desktop">
      {/* Welcome & Context */}
      <div className="flex flex-col gap-1">
        <h1 className="font-headline-md text-headline-md text-on-surface">Welcome back, Developer</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Ready to refine your technical communication today?</p>
      </div>

      {/* Progress Summary Bar */}
      <section className="bg-surface-container-lowest dark:bg-surface-container border-[0.5px] border-outline-variant dark:border-outline rounded-xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant">Weekly Sessions</span>
            <span className="font-headline-lg text-headline-lg-mobile text-on-surface font-code-inline">12</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-2 py-1">
            <span className="material-symbols-fill text-primary text-[16px]">bolt</span>
            <span className="font-label-md text-label-md text-primary">3 Day Streak</span>
          </div>
        </div>
        <div className="h-[0.5px] w-full bg-outline-variant dark:bg-outline opacity-50"></div>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-body-md text-on-surface-variant">Avg Clarity Score</span>
          <div className="flex items-center gap-2">
            <span className="font-code-inline text-code-inline text-on-surface">88%</span>
            <span className="font-label-md text-label-md text-secondary-container dark:text-secondary bg-secondary-fixed/20 px-2 py-0.5 rounded-lg border-[0.5px] border-secondary-fixed/50 flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +5%
            </span>
          </div>
        </div>
      </section>

      {/* Module Grid */}
      <section className="grid grid-cols-2 gap-4">
        <button className="bg-surface-container-lowest dark:bg-surface border-[0.5px] border-outline-variant dark:border-outline rounded-xl p-4 flex flex-col gap-3 items-start text-left hover:bg-surface-container-low transition-colors active:opacity-80">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 border-[0.5px] border-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">code</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-label-md text-label-md text-on-surface font-bold">DSA Simulator</h3>
            <p className="font-body-md text-[12px] leading-tight text-on-surface-variant">Last active: 2h ago</p>
          </div>
        </button>

        <button className="bg-surface-container-lowest dark:bg-surface border-[0.5px] border-outline-variant dark:border-outline rounded-xl p-4 flex flex-col gap-3 items-start text-left hover:bg-surface-container-low transition-colors active:opacity-80">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 border-[0.5px] border-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">record_voice_over</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-label-md text-label-md text-on-surface font-bold">Custom Interview</h3>
            <p className="font-body-md text-[12px] leading-tight text-on-surface-variant">Last active: yesterday</p>
          </div>
        </button>

        <Link to="/analysis" className="bg-surface-container-lowest dark:bg-surface border-[0.5px] border-outline-variant dark:border-outline rounded-xl p-4 flex flex-col gap-3 items-start text-left hover:bg-surface-container-low transition-colors active:opacity-80">
          <div className="w-10 h-10 rounded-lg bg-surface-container border-[0.5px] border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">analytics</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-label-md text-label-md text-on-surface font-bold">Deep Analysis</h3>
            <p className="font-body-md text-[12px] leading-tight text-on-surface-variant">Last active: 3 days ago</p>
          </div>
        </Link>

        <button className="bg-surface-container-lowest dark:bg-surface border-[0.5px] border-outline-variant dark:border-outline rounded-xl p-4 flex flex-col gap-3 items-start text-left hover:bg-surface-container-low transition-colors active:opacity-80">
          <div className="w-10 h-10 rounded-lg bg-surface-container border-[0.5px] border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">book_2</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-label-md text-label-md text-on-surface font-bold">Vocab Builder</h3>
            <p className="font-body-md text-[12px] leading-tight text-on-surface-variant">Last active: 5h ago</p>
          </div>
        </button>
      </section>

      {/* Quick Action Banner */}
      <div className="fixed bottom-[96px] left-margin-mobile right-margin-mobile z-40 max-w-[1200px] mx-auto md:w-[calc(100%-64px)] w-[calc(100%-32px)]">
        <button className="w-full bg-primary-container text-on-primary-container rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform shadow-none border-[0.5px] border-primary-container">
          <div className="flex flex-col items-start">
            <span className="font-label-md text-[12px] opacity-80 uppercase tracking-widest">Continue</span>
            <span className="font-label-md text-label-md font-bold mt-0.5">Resume OOPS Interview</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-on-primary-container/20 flex items-center justify-center border-[0.5px] border-on-primary-container/30">
            <span className="material-symbols-fill">play_arrow</span>
          </div>
        </button>
      </div>
    </div>
  );
};
