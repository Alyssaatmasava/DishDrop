import React, { useState } from "react";
import { AppTab, User } from "../types/types";

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogout, user }) => {

    const [showMenu, setShowMenu] = useState(false);
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
            
            <div className="relative">
                <div 
                onClick={() => setShowMenu(!showMenu)}
                className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-xl cursor-pointer hover:scale-105 transition-transform"
                >
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>

                {showMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-[2rem] border border-gray-100 shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 border-b border-gray-50 mb-2">
                        <p className="font-black text-gray-900 text-sm leading-none mb-1 truncate">{user.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">@{user.username}</p>
                    </div>
                    <button 
                        onClick={() => { setActiveTab('profile'); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
                    >
                        <i className="fas fa-user text-orange-500"></i>
                        Profile
                    </button>
                    <button 
                        onClick={() => { onLogout(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        Sign Out
                    </button>
                    </div>
                </>
                )}
            </div>
            </div>
        </div>
        </header>
    );
};

export default Header;