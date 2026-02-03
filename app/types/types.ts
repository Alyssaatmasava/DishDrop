export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    following: number;
    followers: number;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    restaurantName: string;
    rating: number;
    content: string;
    imageUrl: string;
    timestamp: string;
    location?: string;
}

export interface GroundingSource {
    title?: string;
    uri?: string;
}

export interface Recommendation {
    restaturant: string;
    reason: string;
    highlights: string[];
    sources: GroundingSource[];
}

export type AppTab = 'feed' | 'discover' | 'profile';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}