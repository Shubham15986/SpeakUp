import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Optional: automatically navigate to login or home if auto-confirm is enabled in Supabase
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-margin-mobile">
      <div className="max-w-[400px] w-full mx-auto flex flex-col gap-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/10 border-[0.5px] border-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">person_add</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold text-center">Create Account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">Start tracking your communication progress.</p>
        </div>

        {success ? (
          <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-6 flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed/20 text-secondary mx-auto flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <h2 className="font-headline-md text-on-surface font-bold">Check your email</h2>
            <p className="font-body-md text-on-surface-variant mb-4">We've sent a confirmation link to {email}. Please verify your account to continue.</p>
            <Link to="/login" className="h-12 bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md font-bold flex items-center justify-center hover:opacity-90 transition-opacity">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-6 flex flex-col gap-4">
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
                minLength={6}
              />
            </div>

            <button 
            type="submit" 
            disabled={loading}
            className="h-12 mt-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : 'Create Account'}
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
            Sign up with Google
          </button>
            
            <p className="font-body-md text-[14px] text-center text-on-surface-variant mt-2">
              Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
