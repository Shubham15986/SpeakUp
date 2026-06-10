import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-margin-mobile">
      <div className="max-w-[400px] w-full mx-auto flex flex-col gap-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/10 border-[0.5px] border-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">forum</span>
          </div>
          <h1 className="font-display text-display text-primary font-bold tracking-tight text-center">SpeakUp</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-center">Your AI Communication Coach</p>
        </div>

        <form onSubmit={handleLogin} className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg font-label-md text-label-md flex items-start gap-2 border-[0.5px] border-error-container">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-surface rounded-lg border-[0.5px] border-outline-variant px-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
              placeholder="developer@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-surface rounded-lg border-[0.5px] border-outline-variant px-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="h-12 mt-2 bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : 'Sign In'}
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="h-[0.5px] flex-1 bg-outline-variant"></div>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">or</span>
            <div className="h-[0.5px] flex-1 bg-outline-variant"></div>
          </div>

          <button 
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="h-12 bg-surface text-on-surface border-[0.5px] border-outline-variant rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </button>
          
          <p className="font-body-md text-[14px] text-center text-on-surface-variant mt-2">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
