
'use client';

import React, { useState } from "react";

const PostReview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [restaurant, setRestaurant] = useState('');
  const [review, setReview] = useState('');

  const resetForm = () => {
    setRating(0);
    setRestaurant('');
    setReview('');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 bg-gray-900 text-white w-20 h-20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-orange-500 transition-all flex items-center justify-center z-40 transform hover:scale-110 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <i className="fas fa-plus text-3xl relative z-10 transition-transform group-hover:rotate-180"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl" onClick={() => setIsOpen(false)}></div>
          
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-feather-pointed text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-[900] text-gray-900 tracking-tight uppercase leading-none mb-1">Drop a Review</h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Share your culinary truth</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl text-gray-300 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-10 space-y-10">
              {/* Photo Upload Area */}
              <div className="group relative aspect-video bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-500/5 hover:border-orange-500/20 transition-all overflow-hidden">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                  <i className="fas fa-camera-retro text-3xl text-orange-500"></i>
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-orange-500 transition-colors">Capture the Moment</span>
                <input type="file" className="hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Restaurant</label>
                  <input 
                    type="text" 
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    placeholder="Where did you dine?"
                    className="w-full bg-gray-50 border-0 rounded-[2rem] py-6 px-8 focus:ring-[8px] focus:ring-orange-500/5 outline-none text-gray-900 font-bold text-lg transition-all placeholder:text-gray-200"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">The Rating</label>
                  <div className="flex items-center gap-3 py-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`text-4xl transition-all duration-300 transform ${
                          star <= (hoverRating || rating) ? 'text-orange-500 scale-125' : 'text-gray-100 scale-100'
                        }`}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Your Experience</label>
                <textarea 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us everything about the vibes, the flavors, and that one special dish..."
                  rows={4}
                  className="w-full bg-gray-50 border-0 rounded-[2rem] py-8 px-8 focus:ring-[8px] focus:ring-orange-500/5 outline-none resize-none text-gray-900 font-bold text-lg transition-all placeholder:text-gray-200"
                />
              </div>

              <button 
                onClick={() => { resetForm(); setIsOpen(false); }}
                className="w-full bg-gray-900 text-white font-black py-8 rounded-[2.5rem] shadow-2xl hover:bg-orange-500 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4"
              >
                <i className="fas fa-paper-plane text-xs"></i>
                Publish Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostReview;