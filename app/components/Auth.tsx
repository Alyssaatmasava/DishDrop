'use client';

import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'info' | 'warning' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        // Sign up with metadata. The DB Trigger we set up in SQL handles the 'profiles' table insertion.
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { 
              full_name: name, 
              username: username || email.split('@')[0] 
            }
          }
        });

        if (signUpError) {
          // Specifically handle rate limit error
          if (signUpError.message.includes("Email rate limit exceeded")) {
            setError({ 
              message: "Supabase email limit reached. Tip: Disable 'Confirm Email' in your Supabase Auth settings to skip this during development.", 
              type: 'warning' 
            });
            setIsLoading(false);
            return;
          }
          throw signUpError;
        }

        // If email confirmation is enabled, the user might need to check their inbox
        if (signUpData.session === null && signUpData.user) {
          setError({ 
            message: "Check your email for a confirmation link to complete your registration!", 
            type: 'info' 
          });
          setIsLoading(false);
          return;
        }
    }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError({ message: err.message || "An unexpected error occurred.", type: 'error' });
    } finally {
      if (!error || error.type === 'error') {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60 scale-105" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        <div className="relative h-full flex flex-col justify-end p-12 md:p-20 z-10">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-2xl rotate-3">
              <i className="fas fa-utensils text-2xl"></i>
            </div>
            <h1 className="text-4xl font-[900] text-white tracking-tighter">DishDrop</h1>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            The social network for <span className="text-orange-500 italic">every craving.</span>
          </h2>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 bg-white overflow-y-auto">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-12">
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Table'}
            </h3>
            {error && (
              <div className={`p-5 rounded-2xl text-sm font-bold mb-4 border ${
                error.type === 'error' ? 'bg-rose-50 text-rose-500 border-rose-100 italic' : 
                error.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
                <div className="flex gap-3">
                  <i className={`fas ${
                    error.type === 'error' ? 'fa-circle-exclamation' : 
                    error.type === 'warning' ? 'fa-triangle-exclamation' : 
                    'fa-circle-info'
                  } mt-0.5`}></i>
                  <p>{error.message}</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Foodie"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 px-6 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="jordan_eats"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 px-6 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@dishdrop.com"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 px-6 outline-none transition-all font-bold text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 px-6 outline-none transition-all font-bold text-gray-900"
              />
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-gray-900 text-white font-black py-6 rounded-2xl shadow-2xl hover:bg-orange-500 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 disabled:bg-gray-100 disabled:text-gray-300"
            >
              {isLoading ? <i className="fas fa-spinner animate-spin"></i> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center text-sm font-bold text-gray-400">
            {isLogin ? "Don't have an account?" : "Already part of the crew?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="ml-2 text-orange-500 hover:text-orange-600 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;