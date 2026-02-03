
'use client';

import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types/types";

interface PostReviewProps {
  user: User;
  onPostSuccess: () => void;
}

const PostReview: React.FC<PostReviewProps> = ({ user, onPostSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [restaurant, setRestaurant] = useState('');
  const [review, setReview] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const resetForm = () => {
    setRating(0);
    setRestaurant('');
    setReview('');
  };

  const handlePublish = async () => {
    if (!restaurant || !rating) return;
    setIsPublishing(true);

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          user_id: user.id,
          restaurant_name: restaurant,
          rating: rating,
          content: review,
          image_url: `https://picsum.photos/seed/${Math.random()}/800/800`, // In real app, upload to storage
          location: 'Current Location'
        }
      ]);

      if (error) throw error;
      
      resetForm();
      setIsOpen(false);
      onPostSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to publish review.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 bg-gray-900 text-white w-20 h-20 rounded-[2rem] shadow-2xl hover:bg-orange-500 transition-all flex items-center justify-center z-40 transform hover:scale-110 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <i className="fas fa-plus text-3xl relative z-10 transition-transform group-hover:rotate-180"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl" onClick={() => setIsOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic leading-none">Drop a Review</h3>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl text-gray-300 hover:text-gray-900 transition-all">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Restaurant</label>
                  <input type="text" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} placeholder="Where?" className="w-full bg-gray-50 border-0 rounded-2xl py-6 px-8 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Rating</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)} className={`text-3xl transition-all ${star <= (hoverRating || rating) ? 'text-orange-500 scale-110' : 'text-gray-100'}`}>
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">The Vibes</label>
                <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Tell the truth..." rows={4} className="w-full bg-gray-50 border-0 rounded-3xl py-8 px-8 outline-none resize-none font-bold" />
              </div>

              <button onClick={handlePublish} disabled={isPublishing || !restaurant || !rating} className="w-full bg-gray-900 text-white font-black py-8 rounded-[2rem] shadow-xl hover:bg-orange-500 transition-all uppercase tracking-[0.3em] disabled:bg-gray-100 disabled:text-gray-300">
                {isPublishing ? <i className="fas fa-spinner animate-spin"></i> : 'Publish Drop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostReview;