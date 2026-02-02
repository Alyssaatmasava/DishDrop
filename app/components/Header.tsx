import React from "react";
import { AppTab } from "../types/types";

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-100/50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('feed')}>
          <div className="bg-gray-900 p-2.5 rounded-[1rem] text-white shadow-xl group-hover:bg-orange-500 transition-all transform group-hover:-rotate-12">
            <i className="fas fa-utensils text-lg"></i>
          </div>
          <div>
            <h1 className="text-2xl font-[900] tracking-tighter text-gray-900 leading-none">DishDrop</h1>
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] ml-1">Social Dining</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center bg-gray-50/50 p-1.5 rounded-[1.5rem] border border-gray-100">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`px-8 py-2.5 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Feed
          </button>
          <button 
            onClick={() => setActiveTab('discover')}
            className={`px-8 py-2.5 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'discover' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-8 py-2.5 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Profile
          </button>
        </nav>

        <div className="flex items-center gap-5">
          <button className="relative w-11 h-11 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-orange-500 transition-all shadow-sm">
            <i className="fas fa-bell"></i>
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-xl cursor-pointer hover:scale-105 transition-transform">
            <img src="https://picsum.photos/seed/dishdrop-me/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;