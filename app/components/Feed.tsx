
'use client';

import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { Review } from '../types/types';
import { supabase } from '../lib/supabase';

const Feed: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setFetchError(null);
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;

        // Now joining with likes and comments tables
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles!inner (
                    full_name,
                    username,
                    avatar_url
                ),
                likes (
                    user_id
                ),
                comments (
                    id
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Feed Error:", error);
            setFetchError(error.message);
            return;
        }

        if (data) {
            const formattedReviews: Review[] = (data as any[]).map(item => ({
            id: item.id,
            userId: item.user_id,
            userName: item.profiles?.full_name || 'Anonymous',
            userAvatar: item.profiles?.avatar_url || `https://picsum.photos/seed/${item.user_id}/100/100`,
            restaurantName: item.restaurant_name,
            rating: Number(item.rating),
            content: item.content || '',
            imageUrl: item.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
            timestamp: new Date(item.created_at).toLocaleDateString(),
            location: item.location || 'NYC',
            likesCount: Array.isArray(item.likes) ? item.likes.length : 0,
            commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
            isLiked: currentUserId && Array.isArray(item.likes) 
                ? item.likes.some((l: any) => l.user_id === currentUserId) 
                : false
        }));
        setReviews(formattedReviews);
      }
    } catch (err: any) {
      console.error("Unexpected feed fetch error:", err);
      setFetchError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
    return (
      <div className="flex flex-col gap-8 max-w-xl mx-auto py-8 px-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] shadow-sm">
          <i className="fas fa-exclamation-triangle text-rose-500 text-3xl mb-4"></i>
          <h3 className="text-gray-900 font-black uppercase tracking-tight mb-2">Feed Connection Error</h3>
          <p className="text-rose-600 text-sm font-bold mb-6">{fetchError}</p>
          <button 
            onClick={() => fetchReviews()}
            className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
            <i className="fas fa-utensils text-3xl"></i>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">The feed is empty. Start the trend!</p>
        </div>
      ) : (
        reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
};

export default Feed;
