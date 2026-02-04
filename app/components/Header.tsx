
import React, { useState, useEffect } from 'react';
import { AppTab, User } from '../types/types';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
  user: User;
}

interface Notification {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user.id) return;

    fetchNotifications();

    // Subscribe to real-time notification updates
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setHasUnread(true);
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) {
        setNotifications(data);
        setHasUnread(data.some(n => !n.read));
      }
    } catch (err) {
      console.warn("Notifications fetch error (Table might not exist yet):", err);
    }
  };

  const markAsRead = async () => {
    if (!hasUnread) return;
    
    setHasUnread(false);
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setShowMenu(false);
    if (!showNotifications) {
      markAsRead();
    }
  };

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
          <div className="relative">
            <button 
              onClick={handleBellClick}
              className={`relative w-11 h-11 bg-white rounded-2xl border border-gray-100 transition-all shadow-sm flex items-center justify-center ${showNotifications ? 'text-orange-500 ring-4 ring-orange-50' : 'text-gray-400 hover:text-orange-500'}`}
            >
              <i className="fas fa-bell"></i>
              {hasUnread && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-4 py-3 border-b border-gray-50 mb-3 flex items-center justify-between">
                    <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest">Activity</h4>
                    {notifications.length > 0 && <span className="text-[10px] text-orange-500 font-bold">Recent</span>}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto no-scrollbar space-y-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-wind text-gray-200 text-xs"></i>
                        </div>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No new updates</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-default group">
                          <p className="text-[11px] font-bold text-gray-600 leading-tight group-hover:text-gray-900">
                            {n.content}
                          </p>
                          <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter mt-1 block">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <button className="w-full mt-4 py-3 bg-gray-50 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all">
                      View All Activity
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="relative">
            <div 
              onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }}
              className={`w-11 h-11 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 shadow-xl ${showMenu ? 'border-orange-500 ring-4 ring-orange-50' : 'border-white'}`}
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