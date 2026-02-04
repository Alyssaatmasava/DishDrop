
'use client';

import React, { useEffect, useState } from "react";
import { User, Review } from "../types/types";
import { supabase } from "../lib/supabase";

interface ProfileViewProps {
  user: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [experienceCount, setExperienceCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Review | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');

  // Fetch the actual experience count independently of the active tab
  useEffect(() => {
    const fetchExperienceCount = async () => {
      const { count, error: countError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (!countError && count !== null) {
        setExperienceCount(count);
      }
    };

    fetchExperienceCount();
  }, [user.id]);

  useEffect(() => {
    fetchReviews();
  }, [user.id, activeTab]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query;
      
      if (activeTab === 'history') {
        query = supabase
          .from('reviews')
          .select(`
            *,
            likes (user_id),
            comments (id),
            saves (user_id)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
      } else {
        query = supabase
          .from('saves')
          .select(`
            review:reviews (
              *,
              profiles (full_name, avatar_url, username),
              likes (user_id),
              comments (id),
              saves (user_id)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      if (data) {
        let formatted: Review[] = [];
        
        if (activeTab === 'history') {
          formatted = (data as any[]).map(item => ({
            id: item.id,
            userId: item.user_id,
            userName: user.name,
            userAvatar: user.avatar,
            restaurantName: item.restaurant_name,
            rating: Number(item.rating),
            content: item.content || '',
            imageUrl: item.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
            timestamp: new Date(item.created_at).toLocaleDateString(),
            location: item.location || 'NYC',
            likesCount: Array.isArray(item.likes) ? item.likes.length : 0,
            commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
            isLiked: Array.isArray(item.likes) ? item.likes.some((l: any) => l.user_id === user.id) : false,
            isSaved: Array.isArray(item.saves) ? item.saves.some((s: any) => s.user_id === user.id) : false
          }));
          // Also sync the experience count if we just fetched all history
          setExperienceCount(formatted.length);
        } else {
          formatted = (data as any[])
            .filter(item => item.review) // Filter out any orphaned saves
            .map(item => {
              const r = item.review;
              return {
                id: r.id,
                userId: r.user_id,
                userName: r.profiles?.full_name || 'Anonymous',
                userAvatar: r.profiles?.avatar_url || `https://picsum.photos/seed/${r.user_id}/100/100`,
                restaurantName: r.restaurant_name,
                rating: Number(r.rating),
                content: r.content || '',
                imageUrl: r.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
                timestamp: new Date(r.created_at).toLocaleDateString(),
                location: r.location || 'NYC',
                likesCount: Array.isArray(r.likes) ? r.likes.length : 0,
                commentsCount: Array.isArray(r.comments) ? r.comments.length : 0,
                isLiked: Array.isArray(r.likes) ? r.likes.some((l: any) => l.user_id === user.id) : false,
                isSaved: true
              };
            });
        }
        setReviews(formatted);
      }
    } catch (err: any) {
      console.error("Profile view error:", err);
      setError("Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  const updateReviewInList = (reviewId: string, updates: Partial<Review>) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...updates } : r));
    if (selectedPost?.id === reviewId) {
      setSelectedPost(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleModalLike = async () => {
    if (!selectedPost) return;
    const newLikedState = !selectedPost.isLiked;
    const newCount = newLikedState ? selectedPost.likesCount + 1 : Math.max(0, selectedPost.likesCount - 1);
    
    updateReviewInList(selectedPost.id, { isLiked: newLikedState, likesCount: newCount });

    try {
      if (newLikedState) {
        await supabase.from('likes').insert({ user_id: user.id, review_id: selectedPost.id });
      } else {
        await supabase.from('likes').delete().match({ user_id: user.id, review_id: selectedPost.id });
      }
    } catch (err) {
      console.error("Modal like error:", err);
      updateReviewInList(selectedPost.id, { isLiked: !newLikedState, likesCount: selectedPost.likesCount });
    }
  };

  const handleModalSave = async () => {
    if (!selectedPost) return;
    const newSavedState = !selectedPost.isSaved;
    
    updateReviewInList(selectedPost.id, { isSaved: newSavedState });

    try {
      if (newSavedState) {
        await supabase.from('saves').insert({ user_id: user.id, review_id: selectedPost.id });
      } else {
        await supabase.from('saves').delete().match({ user_id: user.id, review_id: selectedPost.id });
        if (activeTab === 'saved') {
          setReviews(prev => prev.filter(r => r.id !== selectedPost.id));
          setSelectedPost(null);
        }
      }
    } catch (err) {
      console.error("Modal save error:", err);
      updateReviewInList(selectedPost.id, { isSaved: !newSavedState });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      {/* Profile Header */}
      <div className="bg-white rounded-[4rem] p-12 sm:p-20 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] border border-gray-50 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-56 h-56 rounded-full border-[10px] border-white shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105" 
            />
            <button className="absolute bottom-4 right-4 bg-gray-900 text-white w-14 h-14 rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center hover:bg-orange-500 transition-all hover:rotate-12 z-20">
              <i className="fas fa-camera-retro"></i>
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
              <div>
                <h2 className="text-5xl font-[900] text-gray-900 tracking-tight leading-none mb-3">{user.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <span className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">@{user.username}</span>
                   <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Critic</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl shadow-gray-200 active:scale-95">
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-16 py-10 border-y border-gray-100 mb-8">
              <div className="text-center md:text-left">
                <span className="block font-black text-4xl text-gray-900 leading-none mb-2">{experienceCount}</span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">Experiences</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-black text-4xl text-gray-900 leading-none mb-2">{user.followers}</span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">Followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-black text-4xl text-gray-900 leading-none mb-2">{user.following}</span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">Following</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-xl leading-relaxed max-w-xl italic font-medium mx-auto md:mx-0">
              "{user.bio || 'Sharing my culinary journey one dish at a time.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 px-10">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
            {activeTab === 'history' ? 'Taste History' : 'Saved Gems'}
          </h3>
          <div className="bg-gray-100 p-2 rounded-[1.5rem] flex gap-2">
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-8 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`px-8 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'saved' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Saved
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
           <div className="text-center py-20 bg-rose-50 rounded-[3rem] border-2 border-dashed border-rose-100 p-10">
            <p className="text-rose-500 font-bold mb-4">{error}</p>
            <button onClick={() => fetchReviews()} className="text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Try reloading</button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4 shadow-sm">
              <i className={`fas ${activeTab === 'history' ? 'fa-camera' : 'fa-bookmark'} text-2xl`}></i>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              {activeTab === 'history' ? 'No culinary drops yet.' : 'No saved gems found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                onClick={() => setSelectedPost(review)}
                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-700"
              >
                <img 
                  src={review.imageUrl} 
                  alt={review.restaurantName} 
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <h4 className="text-white font-bold text-lg leading-tight mb-2 truncate">{review.restaurantName}</h4>
                     <div className="flex items-center gap-6 text-white/80">
                      <span className="flex items-center gap-2 font-black text-xs">
                        <i className="fas fa-star text-orange-500"></i> {review.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-2 font-black text-xs">
                        <i className="fas fa-comment text-orange-500"></i> {review.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
          <div 
            className="absolute inset-0 bg-gray-900/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
            onClick={() => setSelectedPost(null)}
          ></div>
          
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in fade-in duration-300 max-h-[90vh]">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full md:hidden flex items-center justify-center"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            <div className="w-full md:w-[60%] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.restaurantName} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="w-full md:w-[40%] flex flex-col bg-white">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedPost.userAvatar} className="w-12 h-12 rounded-full ring-4 ring-orange-50" alt="" />
                  <div>
                    <h4 className="font-black text-gray-900 text-sm leading-none mb-1">{selectedPost.userName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedPost.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="hidden md:flex w-10 h-10 bg-gray-50 items-center justify-center rounded-2xl text-gray-300 hover:text-gray-900 transition-all"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight uppercase italic">{selectedPost.restaurantName}</h3>
                    <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl">
                      <i className="fas fa-star text-orange-500 text-sm"></i>
                      <span className="font-black text-orange-600 text-sm">{selectedPost.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-10">
                   <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">Dinner</span>
                   <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">Vibey</span>
                   <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">$$$</span>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] border-b border-gray-50 pb-4">Social Stats</h5>
                  <div className="flex gap-10">
                    <div>
                      <span className="block font-black text-2xl text-gray-900 leading-none mb-1">{selectedPost.likesCount}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Appreciations</span>
                    </div>
                    <div>
                      <span className="block font-black text-2xl text-gray-900 leading-none mb-1">{selectedPost.commentsCount}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Discussions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={handleModalLike}
                      className={`text-2xl transition-all ${selectedPost.isLiked ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}
                    >
                      <i className={`${selectedPost.isLiked ? 'fas' : 'far'} fa-heart`}></i>
                    </button>
                    <button className="text-2xl text-gray-300 hover:text-orange-500 transition-all">
                      <i className="far fa-comment"></i>
                    </button>
                  </div>
                  <button 
                    onClick={handleModalSave}
                    className={`text-2xl transition-all ${selectedPost.isSaved ? 'text-orange-500' : 'text-gray-300 hover:text-gray-900'}`}
                  >
                    <i className={`${selectedPost.isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
                  </button>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Dropped on {selectedPost.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;