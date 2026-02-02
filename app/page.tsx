'use client';

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { AppTab } from "./types/types";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('feed');
   
  // Smooth scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);
    
  return (
    <div className="min-h-screen pb-32 md:pb-10 selection:bg-orange-100 selection:text-orange-600">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-5">
        <div className="container mx-auto">
          {/* {activeTab === 'feed' && <Feed />} */}
          {/* {activeTab === 'discover' && <Discovery />}
          {activeTab === 'profile' && <ProfileView />} */}
        </div>
      </main>

      <h1>Welcome to the App</h1>
      <p>This is the main page of the application.</p>
    </div>
  )
};

export default App;