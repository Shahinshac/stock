import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Activity, KeyRound, Mail, ArrowRight, Loader2 } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { login, register, loginWithGoogle } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
              OmniFi
            </h1>
          </div>
          <p className="text-slate-400">Global Markets Command Center</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isLogin ? 'Access Terminal' : 'Initialize Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="agent@omnifi.network"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Passcode</label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Authenticate' : 'Create Credentials'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setIsGoogleLoading(true);
              await loginWithGoogle();
              setIsGoogleLoading(false);
            }}
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-3 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-8 text-center text-sm text-slate-400">
            {isLogin ? "Don't have clearance? " : "Already initialized? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? 'Request Access' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
