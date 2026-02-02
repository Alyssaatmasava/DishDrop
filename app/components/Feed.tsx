import React from "react";
import ReviewCard from "./ReviewCard";
import { Review } from "../types/types";

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Alex Rivera',
    userAvatar: 'https://picsum.photos/seed/u1/100/100',
    restaurantName: 'Taco Haven',
    rating: 4.8,
    content: 'Hands down the best al pastor I have had outside of Mexico City. The pineapple was perfectly caramelized and the salsa verde had just the right amount of kick!',
    imageUrl: 'https://picsum.photos/seed/tacos/800/600',
    timestamp: '2 hours ago',
    location: 'Austin, TX'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/u2/100/100',
    restaurantName: 'Miso & Co',
    rating: 4.5,
    content: 'Very cozy atmosphere. The tonkotsu broth was rich and creamy. Great for a rainy Tuesday night.',
    imageUrl: 'https://picsum.photos/seed/ramen/800/600',
    timestamp: '5 hours ago',
    location: 'New York, NY'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Jamie Chen',
    userAvatar: 'https://picsum.photos/seed/u3/100/100',
    restaurantName: 'The Golden Crust',
    rating: 5.0,
    content: 'Best sourdough pizza in the city. The crust is chewy and flavorful, and the burrata topping is to die for.',
    imageUrl: 'https://picsum.photos/seed/pizza/800/600',
    timestamp: '1 day ago',
    location: 'San Francisco, CA'
  }
];

const Feed: React.FC = () => {
    return (
        <div className="max-w-xl mx-auto py-8 px-4">
            {MOCK_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};

export default Feed;