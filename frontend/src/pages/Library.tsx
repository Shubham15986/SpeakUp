import { apiFetch } from "../lib/api";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Library = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', category: 'Power Words', definition: '', example: '' });

  const fetchLibrary = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const res = await apiFetch(`http://localhost:5001/api/library?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user]);

  const toggleMark = async (id: string, currentMarked: boolean) => {
    try {
      setItems(items.map(item => item.id === id ? { ...item, isMarked: !currentMarked } : item));
      await apiFetch(`http://localhost:5001/api/library/${id}/mark`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isMarked: !currentMarked })
      });
    } catch (err) {
      console.error(err);
      fetchLibrary(); // Revert on failure
    }
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newWord.word) return;
    try {
      const res = await apiFetch('http://localhost:5001/api/library/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...newWord })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewWord({ word: '', category: 'Power Words', definition: '', example: '' });
        fetchLibrary();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter || (filter === 'Marked' && item.isMarked);
    const matchesSearch = item.word.toLowerCase().includes(search.toLowerCase()) || item.definition.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col pt-md pb-[80px]">
      <section className="px-margin-mobile mb-lg md:px-margin-desktop">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-md">Vocab Library</h2>
        
        {/* Search Bar */}
        <div className="w-full h-12 bg-surface rounded-lg border-[0.5px] border-outline-variant flex items-center px-md focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all duration-200 mb-md">
          <span className="material-symbols-outlined text-outline mr-sm">search</span>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-body-md text-on-background placeholder-outline outline-none" 
            placeholder="Search vocabulary..." 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-sm pb-sm -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          {['All', 'Marked', 'Power Words', 'Idioms', 'Connectors', 'Transition Phrases'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap px-md py-sm rounded-lg font-label-md text-label-md border-[0.5px] flex-shrink-0 transition-colors ${
                filter === cat 
                  ? 'bg-primary-container text-on-primary-container border-primary-container' 
                  : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              {cat === 'Marked' && <span className="material-symbols-outlined text-[14px] align-middle mr-1" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>}
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Vocab Grid */}
      <section className="px-margin-mobile md:px-margin-desktop flex flex-col gap-md">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
             <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10 text-on-surface-variant font-body-md">
            No vocabulary found. Try adjusting your filters or search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {filteredItems.map(item => (
              <article key={item.id} className="bg-surface rounded-xl border-[0.5px] border-outline-variant p-md flex flex-col gap-sm relative">
                <button 
                  onClick={() => toggleMark(item.id, item.isMarked)}
                  className="absolute top-4 right-4 text-primary transition-transform active:scale-90"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: item.isMarked ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
                <div className="flex flex-col items-start mb-xs pr-8">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">{item.word}</h3>
                  <span className="px-2 py-1 mt-2 bg-surface-variant text-on-surface-variant rounded border-[0.5px] border-outline-variant font-code-inline text-code-inline text-[10px] uppercase">
                    {item.category} {item.isCustom && '• Custom'}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.definition}</p>
                <div className="bg-surface-container-low rounded-lg border-[0.5px] border-outline-variant p-sm mt-auto">
                  <p className="font-body-sm text-body-sm text-on-background italic">"{item.example}"</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Contextual FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center z-40 active:scale-95 duration-100 transition-transform md:right-margin-desktop md:bottom-12"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 400, 'FILL' 0" }}>add</span>
      </button>

      {/* Add Custom Word Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" style={{ width: '100vw', height: '100vh', top: 0, left: 0 }}>
          <div 
            className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-2xl p-6 flex flex-col gap-4 relative flex-none"
            style={{ width: '400px', maxWidth: '90vw', minWidth: '320px' }}
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-sm text-on-surface font-bold">Add Custom Vocabulary</h3>
            <form onSubmit={handleAddCustom} className="flex flex-col gap-4">
              <input 
                required placeholder="Word or Phrase" className="w-full bg-surface border-[0.5px] border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-body-md"
                value={newWord.word} onChange={e => setNewWord({...newWord, word: e.target.value})}
              />
              <select 
                className="w-full bg-surface border-[0.5px] border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-body-md"
                value={newWord.category} onChange={e => setNewWord({...newWord, category: e.target.value})}
              >
                <option>Power Words</option>
                <option>Idioms</option>
                <option>Connectors</option>
                <option>Transition Phrases</option>
                <option>Custom</option>
              </select>
              <textarea 
                required placeholder="Definition" className="w-full bg-surface border-[0.5px] border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-body-md resize-none h-24"
                value={newWord.definition} onChange={e => setNewWord({...newWord, definition: e.target.value})}
              />
              <textarea 
                required placeholder="Example sentence" className="w-full bg-surface border-[0.5px] border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-body-md resize-none h-24"
                value={newWord.example} onChange={e => setNewWord({...newWord, example: e.target.value})}
              />
              <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg mt-2 active:scale-[0.98] transition-transform">
                Save Word
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
