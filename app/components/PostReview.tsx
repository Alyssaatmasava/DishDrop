
'use client';

import React, { useState, useRef } from "react";
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
  const [location, setLocation] = useState('');
  const [review, setReview] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setRating(0);
    setRestaurant('');
    setLocation('');
    setReview('');
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    if (!restaurant || !rating || !location) return;
    setIsPublishing(true);

    try {
        // In a production app, you would upload the file to Supabase Storage.
        // For this prototype, we'll use the base64 string or a fallback if no image is provided.
      const finalImageUrl = imagePreview || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80`;

      const { error } = await supabase.from('reviews').insert([
        {
          user_id: user.id,
          restaurant_name: restaurant,
          rating: rating,
          content: review,
          image_url: finalImageUrl,
          location: location
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
        className="fixed bottom-10 right-10 bg-gray-900 text-white w-20 h-20 rounded-[2.5rem] shadow-2xl hover:bg-orange-500 transition-all flex items-center justify-center z-40 transform hover:scale-110 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <i className="fas fa-plus text-3xl relative z-10 transition-transform group-hover:rotate-180"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl" onClick={() => setIsOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-8 sm:p-10 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic leading-none">Drop a Review</h3>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl text-gray-300 hover:text-gray-900 transition-all">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-8 sm:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Restaurant *</label>
                  <input 
                    type="text" 
                    value={restaurant} 
                    onChange={(e) => setRestaurant(e.target.value)} 
                    placeholder="Where did you eat?" 
                    className="w-full bg-gray-50 border-0 rounded-2xl py-5 px-6 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Location *</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="City or Neighborhood" 
                    className="w-full bg-gray-50 border-0 rounded-2xl py-5 px-6 focus:ring-4 focus:ring-orange-500/5 outline-none font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Rating</label>
                <div className="flex items-center gap-4 bg-gray-50 w-fit p-4 rounded-3xl">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onMouseEnter={() => setHoverRating(star)} 
                      onMouseLeave={() => setHoverRating(0)} 
                      onClick={() => setRating(star)} 
                      className={`text-3xl transition-all ${star <= (hoverRating || rating) ? 'text-orange-500 scale-110' : 'text-gray-200'}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                  <span className="ml-2 font-black text-gray-900 text-lg">{rating > 0 ? rating.toFixed(1) : ''}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">The Vibes</label>
                <textarea 
                  value={review} 
                  onChange={(e) => setReview(e.target.value)} 
                  placeholder="Tell us about the atmosphere, service, and of course, the food..." 
                  rows={4} 
                  className="w-full bg-gray-50 border-0 rounded-[2rem] py-6 px-8 outline-none resize-none font-bold placeholder:text-gray-300" 
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Media (Optional)</label>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <i className="fas fa-image text-xl"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                {imagePreview ? (
                  <div className="relative group w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-lg">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={removeImage}
                      className="absolute top-4 right-4 w-10 h-10 bg-gray-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-orange-500 shadow-sm transition-colors">
                      <i className="fas fa-camera text-xl"></i>
                    </div>
                    <p className="text-gray-300 font-bold text-xs uppercase tracking-widest">Tap to add a delicious photo</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handlePublish} 
                disabled={isPublishing || !restaurant || !rating || !location} 
                className="w-full bg-gray-900 text-white font-black py-7 rounded-[2rem] shadow-2xl hover:bg-orange-500 transition-all uppercase tracking-[0.3em] text-xs disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none"
              >
                {isPublishing ? (
                  <span className="flex items-center justify-center gap-3">
                    <i className="fas fa-spinner animate-spin"></i> Dropping...
                  </span>
                ) : 'Publish Drop'}
              </button>
              
              <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                * Required Fields
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostReview;