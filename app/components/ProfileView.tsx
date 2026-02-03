
'use client';

import React from "react";
import { User } from "../types";

const MOCK_USER: User = {
  id: 'me',
  name: 'Jordan Foodie',
  username: 'jordan_eats',
  avatar: 'https://picsum.photos/seed/dishdrop-me/200/200',
  bio: 'Searching for the world\'s best bao bun. Part-time chef, full-time critic. I believe dessert is a human right.',
  following: 428,
  followers: 1205
};

const ProfileView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="bg-white rounded-[4rem] p-12 sm:p-20 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] border border-gray-50 mb-16 relative overflow-hidden">
        {/* Profile Design Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src={MOCK_USER.avatar} 
              alt={MOCK_USER.name} 
              className="w-56 h-56 rounded-full border-[10px] border-white shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105" 
            />
            <button className="absolute bottom-4 right-4 bg-gray-900 text-white w-14 h-14 rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center hover:bg-orange-500 transition-all hover:rotate-12 z-20">
              <i className="fas fa-camera-retro"></i>
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
              <div>
                <h2 className="text-5xl font-[900] text-gray-900 tracking-tight leading-none mb-3">{MOCK_USER.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <span className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">@{MOCK_USER.username}</span>
                   <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Critic</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl shadow-gray-200 active:scale-95">
                  Edit Profile
                </button>
                <button className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-[1.5rem] text-gray-400 hover:text-gray-900 transition-all">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-16 py-10 border-y border-gray-100 mb-8">
              <div className="text-center md:text-left">
                <span className="block font-black text-4xl text-gray-900 leading-none mb-2">42</span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">Experiences</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-black text-4xl text-gray-900 leading-none mb-2">1.2k</span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">Followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-black text-4xl text-gray-900 leading-none mb-2">428</span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">Following</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-xl leading-relaxed max-w-xl italic font-medium mx-auto md:mx-0">
              "{MOCK_USER.bio}"
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 px-10">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Taste History</h3>
          <div className="bg-gray-100 p-2 rounded-[1.5rem] flex gap-2">
            <button className="bg-white text-gray-900 px-8 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest shadow-sm">Grid</button>
            <button className="text-gray-400 hover:text-gray-600 px-8 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-colors">Saved</button>
            <button className="text-gray-400 hover:text-gray-600 px-8 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-colors">Map</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-700">
              <img 
                src={`https://picsum.photos/seed/dish-hq-${i+60}/600/800`} 
                alt="Post" 
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <h4 className="text-white font-bold text-lg leading-tight mb-4">Midnight Sushi Platter</h4>
                   <div className="flex items-center gap-6 text-white/80">
                    <span className="flex items-center gap-2 font-black text-xs">
                      <i className="fas fa-heart text-rose-500"></i> 14
                    </span>
                    <span className="flex items-center gap-2 font-black text-xs">
                      <i className="fas fa-comment text-orange-500"></i> 2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;