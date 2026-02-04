
import React, { useState } from 'react';
import { Review } from '../types/types';
import { supabase } from '../lib/supabase';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likesCount, setLikesCount] = useState(review.likesCount);
  const [isSaved, setIsSaved] = useState(review.isSaved || false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

    try {
      if (newLikedState) {
        const { error } = await supabase.from('likes').insert({ user_id: session.user.id, review_id: review.id });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('likes').delete().match({ user_id: session.user.id, review_id: review.id });
        if (error) throw error;
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setIsLiked(!newLikedState);
      setLikesCount(prev => !newLikedState ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      if (newSavedState) {
        const { error } = await supabase.from('saves').insert({ user_id: session.user.id, review_id: review.id });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('saves').delete().match({ user_id: session.user.id, review_id: review.id });
        if (error) throw error;
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      setIsSaved(!newSavedState);
    }
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer">
            <img 
              src={review.userAvatar} 
              alt={review.userName} 
              className="w-12 h-12 rounded-full object-cover ring-4 ring-orange-50 transition-transform group-hover:scale-105" 
            />
            <div className="absolute -bottom-1 -right-1 bg-orange-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <i className="fas fa-bolt text-[8px] text-white"></i>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-1.5 leading-tight">
              {review.userName}
              <i className="fas fa-check-circle text-[10px] text-blue-500"></i>
            </h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{review.location || 'DishDrop Elite'}</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
          <i className="fas fa-ellipsis-v text-sm"></i>
        </button>
      </div>

      {/* Main Content (Image) */}
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden cursor-pointer">
        <img 
          src={review.imageUrl} 
          alt={review.restaurantName} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        <div className="absolute top-6 right-6 glass px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
          <i className="fas fa-star text-orange-500 text-sm"></i>
          <span className="text-gray-900 font-extrabold text-sm">{review.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Footer / Social */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight leading-none mb-1">{review.restaurantName}</h2>
            <span className="text-xs font-semibold text-orange-500">{review.timestamp} • {review.location || 'NYC'}</span>
          </div>
          <button 
            onClick={handleSave}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
              isSaved ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-50 text-gray-300 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark text-lg`}></i>
          </button>
        </div>
        
        <p className="text-gray-600 text-[16px] leading-relaxed mb-8">
          {review.content}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all group/btn ${isLiked ? 'text-rose-500 scale-105' : 'text-gray-400 hover:text-rose-500'}`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isLiked ? 'bg-rose-50' : 'bg-transparent group-hover/btn:bg-rose-50'}`}>
                <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-xl`}></i>
              </div>
              <span className="text-sm font-extrabold">{likesCount}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-all group/btn"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover/btn:bg-orange-50">
                <i className="far fa-comment-dots text-xl"></i>
              </div>
              <span className="text-sm font-extrabold">{review.commentsCount}</span>
            </button>
          </div>
          
          <div className="flex -space-x-3">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                 <img src={`https://picsum.photos/seed/face-${i+10}/50/50`} alt="Friend" />
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
