'use client';

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { AppTab, User } from "./types/types";
import Feed from "./components/Feed";
import Discovery from "./components/Discovery";
import ProfileView from "./components/ProfileView";
import PostReview from "./components/PostReview";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabase";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('feed');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
   
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setIsAuthLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setCurrentUser(null);
        setIsAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser: any) => {
    if (!authUser?.id) {
      console.error("fetchProfile called without a valid user ID");
      setIsAuthLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (data) {
      setCurrentUser({
        id: data.id,
        name: data.full_name,
        username: data.username,
        avatar: data.avatar_url || `https://picsum.photos/seed/${data.id}/200/200`,
        bio: data.bio || '',
        followers: 0,
        following: 0,
        email: authUser.email
      });
    } else {
      // If profile is missing (e.g., trigger lag or RLS issue), use metadata as fallback
      console.warn("Profile not found in database, using auth metadata fallback", error);
      
      const fallbackId = authUser.id || 'unknown';
      setCurrentUser({
        id: fallbackId,
        name: authUser.user_metadata?.full_name || 'New Member',
        username: authUser.user_metadata?.username || `user_${fallbackId.slice(0, 5)}`,
        avatar: `https://picsum.photos/seed/${fallbackId}/200/200`,
        bio: '',
        followers: 0,
        following: 0,
        email: authUser.email
      });
    }
    setIsAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('feed');
  };

  // Smooth scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-[6px] border-orange-50 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Preparing the Table...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth />;
  }
    
  return (
    <div className="min-h-screen pb-32 md:pb-10 selection:bg-orange-100 selection:text-orange-600">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        user={currentUser}
      />
      
      <main className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-5">
        <div className="container mx-auto">
          {activeTab === 'feed' && <Feed />}
          {activeTab === 'discover' && <Discovery />}
          {activeTab === 'profile' && <ProfileView user={currentUser} />} 
        </div>
      </main>

      <PostReview user={currentUser} onPostSuccess={() => setActiveTab('feed')} />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-gray-100/50 flex items-center justify-around py-5 px-10 z-40 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'feed' ? 'text-gray-900 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'feed' ? 'bg-orange-50 text-orange-600' : ''}`}>
            <i className="fas fa-layer-group text-xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Feed</span>
        </button>
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'discover' ? 'text-gray-900 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'discover' ? 'bg-orange-50 text-orange-600' : ''}`}>
            <i className="fas fa-wand-magic-sparkles text-xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Craving</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-gray-900 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : ''}`}>
            <i className="fas fa-user-astronaut text-xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Me</span>
        </button>
      </nav>
    </div>
  )
};

export default App;
