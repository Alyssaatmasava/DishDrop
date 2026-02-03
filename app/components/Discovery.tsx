import React, { useState } from "react";
import { findRestaurantsByCraving } from "../services/geminiService";

const Discovery: React.FC = () => {
    const [craving, setCraving] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ text: string; sources: any[]} | null>(null);
    
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!craving.trim()) return;

        setLoading(true);
        setResults(null);

        try {
            const location = await new Promise<{ lat: number, lng: number } | undefined>((resolve) => {
                if (!navigator.geolocation) {
                    resolve(undefined);
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => resolve(undefined),
                    { timeout: 5000 }
                );
            });

            const res = await findRestaurantsByCraving(craving, location);
            setResults(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 rounded-2xl mb-6 shadow-sm">
                    <i className="fas fa-sparkles text-xs"></i>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">GenAI Discovery</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">DishDrop AI</h2>
                <p className="text-gray-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Tell us exactly what you're in the mood for. No filters, just flavors.
                </p>
            </div>

            <form onSubmit={handleSearch} className="mb-20 relative group max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 blur-3xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-all duration-700"></div>
                <div className="relative">
                    <input
                        type="text"
                        value={craving}
                        onChange={(e) => setCraving(e.target.value)}
                        placeholder="e.g. 'Crunchy tempura and sake in a dark, quiet bar'"
                        className="w-full bg-white border-0 rounded-[2.5rem] py-8 px-10 pr-24 focus:outline-none focus:ring-[12px] focus:ring-orange-500/5 shadow-[0_20px_-15px_rgba(0,0,0,0.1)] text-lg sm:text-2xl transition-all placeholder:text-gray-200 font-bold tracking-tight"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-4 top-4 bottom-4 bg-gray-900 text-white rounded-[1.8rem] px-8 hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-300 disabled:scale-100"
                    >
                        {loading ? <i className="fas fa-spinner animate-spin text-xl"></i> : <i className="fas fa-paper-plane text-xl"></i>}
                    </button>
                </div>
            </form>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                    <div className="relative mb-10">
                        <div className="w-32 h-32 border-[6px] border-orange-50 border-t-orange-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center animate-pulse">
                                <i className="fas fa-utensils text-2xl text-orange-500"></i>
                            </div>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-gray-900 font-black text-2xl tracking-tight italic uppercase">Analyzing Cravings...</p>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scouring local gems for you</p>
                    </div>
                </div>
            )}

            {results && (
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="bg-white rounded-[3.5rem] p-10 sm:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.12)] border border-gray-50 relative overflow-hidden">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl flex items-xenter justify-center text-white shadow-2xl shadow-orange-200 transform -rotate-6">
                                    <i className="fas fa-magic text-2xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-[900] text-gray-900 italic tracking-tight uppercase leading-none">The Craving Log</h3>
                                    <p className="text-orange-500 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Personalized Recommendations</p>
                                </div>
                            </div>
                            <div className="px-6 py-2 bg-gray-50 rounded-2xl text-xs font-bold text-gray-400 border border-gray-100">
                                Found {results.sources.length} Matches
                            </div>
                        </div>

                        <div className="relative mb-16">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 rounded-full"></div>
                            <div className="pl-10 text-gray-700 text-xl sm:text-2xl leading-relaxed italic font-medium">
                                "{results.text}"
                            </div>
                        </div>

                        {results.sources.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="h-[1px] flex-1 bg-gray-100"></span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Reservations & Menues</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.sources.map((chunk, idx) => {
                                        const link = chunk.web?.uri || chunk.search_entry?.url || chunk.maps?.uri;
                                        const title = chunk.web?.title || chunk.search_entry?.title || chunk.maps?.title || 'View Details';
                                        if (!link) return null;
                                        return(
                                            <a
                                                key={idx}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between group bg-gray-50/50 hover:bg-gray-900 p-6 rounded-[2rem] border border-transparent hover:border-gray-900 transition-all duration-300"
                                            >
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Source {idx + 1}</span>
                                                    <span className="text-lg font-bold text-gray-900 group-hover:text-white truncate">{title}</span>
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:bg-orange-500 group-hover:text-white shadow-sm transition-all group-hover:translate-x-1">
                                                    <i className="fas fa-arrow-right text-sm"></i>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discovery;