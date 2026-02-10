import React from 'react';
import { signIn, useSession } from '../services/authService';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 bg-slate-800/50 p-10 rounded-[40px] border border-slate-700/50 backdrop-blur-xl">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter">STATKICK <span className="text-emerald-500">PRO</span></h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Next-Gen Football Intelligence</p>
          </div>

          <div className="space-y-4 pt-6">
            <button
              onClick={() => signIn.social({ provider: "github" })}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 border border-slate-600"
            >
              Continue with GitHub
            </button>
            <button
              onClick={() => signIn.social({ provider: "google" })}
              className="w-full py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3"
            >
              Continue with Google
            </button>
          </div>

          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            By continuing, you agree to our analytical methodology and data terms.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
