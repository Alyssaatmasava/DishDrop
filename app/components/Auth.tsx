'use client';

import React, { useState } from "react";
import { User } from "../types/types";

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 'me',
        name: isLogin ? 'Jordan Foodie' : name,
        username: isLogin ? 'jordan_eats' : name.toLowerCase().replace(/\s+/g, '_'),
        avatar: 'https://picsum.photos/seed/dishdrop-me/200/200',
        bio: 'Searching for the world\'s best bao bun. Part-time chef, full-time critic.',
        following: 0,
        followers: 0,
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side: Branding/Visuals */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow" 
            alt="Hero Background"
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
          <p className="text-gray-300 text-xl font-medium max-w-md">
            Document your culinary journey and find your next obsession with AI-powered discovery.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-12">
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Table'}
            </h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">
              {isLogin ? 'Enter your details to continue' : 'Start your culinary documentation'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-orange-500 transition-colors">
                    <i className="fas fa-user"></i>
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Foodie"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 pl-14 pr-6 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-orange-500 transition-colors">
                  <i className="fas fa-envelope"></i>
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@dishdrop.com"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 pl-14 pr-6 outline-none transition-all font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-orange-500 transition-colors">
                  <i className="fas fa-lock"></i>
                </div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/10 focus:ring-4 focus:ring-orange-500/5 rounded-2xl py-5 pl-14 pr-6 outline-none transition-all font-bold text-gray-900"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gray-900 text-white font-black py-6 rounded-2xl shadow-2xl hover:bg-orange-500 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 disabled:bg-gray-100 disabled:text-gray-300 disabled:transform-none"
            >
              {isLoading ? (
                <i className="fas fa-spinner animate-spin"></i>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 font-bold text-sm">
              {isLogin ? "Don't have an account?" : "Already part of the crew?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;