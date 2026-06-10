

export const Library = () => {
  return (
    <div className="flex-1 flex flex-col pt-md pb-[80px]">
      {/* Header Section */}
      <section className="px-margin-mobile mb-lg md:px-margin-desktop">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-md">Vocab Library</h2>
        
        {/* Search Bar */}
        <div className="w-full h-12 bg-surface rounded-lg border-[0.5px] border-outline-variant flex items-center px-md focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all duration-200 mb-md">
          <span className="material-symbols-outlined text-outline mr-sm">search</span>
          <input className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-body-md text-on-background placeholder-outline outline-none" placeholder="Search vocabulary..." type="text" />
        </div>

        {/* Filter Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-sm pb-sm -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          <button className="whitespace-nowrap px-md py-sm bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md border-[0.5px] border-primary-container flex-shrink-0 transition-colors">All</button>
          <button className="whitespace-nowrap px-md py-sm bg-surface-container text-on-surface-variant rounded-lg font-label-md text-label-md border-[0.5px] border-outline-variant flex-shrink-0 hover:bg-surface-container-high transition-colors">Connectors</button>
          <button className="whitespace-nowrap px-md py-sm bg-surface-container text-on-surface-variant rounded-lg font-label-md text-label-md border-[0.5px] border-outline-variant flex-shrink-0 hover:bg-surface-container-high transition-colors">Idioms</button>
          <button className="whitespace-nowrap px-md py-sm bg-surface-container text-on-surface-variant rounded-lg font-label-md text-label-md border-[0.5px] border-outline-variant flex-shrink-0 hover:bg-surface-container-high transition-colors">Transition Phrases</button>
          <button className="whitespace-nowrap px-md py-sm bg-surface-container text-on-surface-variant rounded-lg font-label-md text-label-md border-[0.5px] border-outline-variant flex-shrink-0 hover:bg-surface-container-high transition-colors">Power Words</button>
        </div>
      </section>

      {/* Vocab Grid/List */}
      <section className="px-margin-mobile md:px-margin-desktop flex flex-col gap-md">
        <article className="bg-surface rounded-xl border-[0.5px] border-outline-variant p-md flex flex-col gap-sm">
          <div className="flex justify-between items-start mb-xs">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">Synthesize</h3>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded border-[0.5px] border-outline-variant font-code-inline text-code-inline text-xs">Power Word</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">To combine multiple elements or ideas into a coherent whole.</p>
          <div className="bg-surface-container-low rounded-lg border-[0.5px] border-outline-variant p-sm mt-xs">
            <p className="font-body-md text-body-md text-on-background italic">"We need to synthesize the data from both APIs to build the reporting dashboard."</p>
          </div>
        </article>

        <article className="bg-surface rounded-xl border-[0.5px] border-outline-variant p-md flex flex-col gap-sm">
          <div className="flex justify-between items-start mb-xs">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">Leverage</h3>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded border-[0.5px] border-outline-variant font-code-inline text-code-inline text-xs">Power Word</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">To use something to maximum advantage.</p>
          <div className="bg-surface-container-low rounded-lg border-[0.5px] border-outline-variant p-sm mt-xs">
            <p className="font-body-md text-body-md text-on-background italic">"We can leverage the existing caching layer to improve response times."</p>
          </div>
        </article>

        <article className="bg-surface rounded-xl border-[0.5px] border-outline-variant p-md flex flex-col gap-sm">
          <div className="flex justify-between items-start mb-xs">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">Orchestrate</h3>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded border-[0.5px] border-outline-variant font-code-inline text-code-inline text-xs">Power Word</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">To arrange or direct the elements of a situation to produce a desired effect, often involving complex systems.</p>
          <div className="bg-surface-container-low rounded-lg border-[0.5px] border-outline-variant p-sm mt-xs">
            <p className="font-body-md text-body-md text-on-background italic">"Kubernetes will orchestrate the deployment of our microservices."</p>
          </div>
        </article>

        <article className="bg-surface rounded-xl border-[0.5px] border-outline-variant p-md flex flex-col gap-sm">
          <div className="flex justify-between items-start mb-xs">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">On the same page</h3>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded border-[0.5px] border-outline-variant font-code-inline text-code-inline text-xs">Idiom</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Having a shared understanding or agreement about a situation.</p>
          <div className="bg-surface-container-low rounded-lg border-[0.5px] border-outline-variant p-sm mt-xs">
            <p className="font-body-md text-body-md text-on-background italic">"Before we start sprinting, let's make sure we're on the same page regarding the architecture."</p>
          </div>
        </article>
      </section>

      {/* Contextual FAB */}
      <button className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center z-40 active:scale-95 duration-100 transition-transform md:right-margin-desktop md:bottom-12 shadow-lg">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 400, 'FILL' 0" }}>add</span>
      </button>
    </div>
  );
};
