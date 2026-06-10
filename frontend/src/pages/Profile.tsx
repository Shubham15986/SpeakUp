import { apiFetch } from "../lib/api";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', goals: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await apiFetch(`http://localhost:5001/api/profile?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || '',
            email: data.email || `${user.id}@placeholder.com`,
            goals: data.goals || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiFetch('http://localhost:5001/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, name: profile.name, goals: profile.goals })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-md pb-[80px]">
      <section className="px-margin-mobile mb-lg md:px-margin-desktop">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-md font-bold">Profile Settings</h2>
        
        {isLoading ? (
           <div className="flex justify-center items-center h-32">
             <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-[0.5px] border-outline-variant bg-surface-container-high mb-4">
                <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClAQ7tzzeSur25DHLJTdn2S_UYq-8nuNWfclsEA0rkd0Y5VwCYLv6wIUaUR_83pBCmo3CpBRbC3QkLv-aF5ssixwc-bItECZejXkbOTYnVvd9dR8ohbChum29tX3NQ13LZthcYF-cazDNrD690h20PktrmCno3nmrsunfOWR-IMJig6XIPvQWHEJshEvZ2WbNii-ybeKHkKVadXUK5DTkQpYVduJLP7x4I66LYYLs63Yl2pxFqYWfXQw3mQ2PVrEoUZDwetOR6LJz1"/>
              </div>
              <p className="font-label-md text-on-surface-variant text-center">{profile.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface font-semibold">Display Name</label>
              <input 
                type="text"
                placeholder="Enter your name"
                className="w-full bg-surface border-[0.5px] border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-body-md"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface font-semibold">Interview Goals</label>
              <p className="font-body-sm text-on-surface-variant mb-1">What specific communication areas do you want the AI to focus on?</p>
              <textarea 
                placeholder="e.g. Speak slower, eliminate 'like' and 'um', improve STAR method formatting..."
                className="w-full bg-surface border-[0.5px] border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-body-md resize-none h-32"
                value={profile.goals}
                onChange={e => setProfile({...profile, goals: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-primary text-on-primary py-3 rounded-lg font-label-lg mt-4 active:scale-[0.98] transition-transform flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? (
                 <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">save</span>
              )}
              Save Profile
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
