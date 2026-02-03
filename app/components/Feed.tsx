'use client';

import React, { useEffect, useState } from 'react';
import ReviewCard from "./ReviewCard";
import { Review } from "../types/types";
import { supabase } from '../lib/supabase';

const Feed: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const formattedReviews: Review[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        userName: item.profiles.full_name,
        userAvatar: item.profiles.avatar_url || `https://picsum.photos/seed/${item.user_id}/100/100`,
        restaurantName: item.restaurant_name,
        rating: item.rating,
        content: item.content,
        imageUrl: item.image_url || 'https://picsum.photos/seed/food/800/600',
        timestamp: new Date(item.created_at).toLocaleDateString(),
        location: item.location
      }));
      setReviews(formattedReviews);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 max-w-xl mx-auto py-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold">No reviews yet. Be the first to drop one!</p>
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