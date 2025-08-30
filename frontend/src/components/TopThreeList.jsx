import React from 'react';
import { Trophy, MapPin, UtensilsCrossed, TrendingUp } from 'lucide-react';


export default function TopThreeList({ top3 }) {
    const rankStyles = [
        // 1st Place (Gold)
        {
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
        },
        // 2nd Place (Silver)
        {
            bgColor: 'bg-slate-100',
            textColor: 'text-slate-700',
            borderColor: 'border-slate-200',
        },
        // 3rd Place (Bronze)
        {
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700',
            borderColor: 'border-orange-200',
        },
    ];

    // Medals for the top 3 ranks
    const medals = ["🥇", "🥈", "🥉"];

    return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Trophy className="text-amber-500" size={28} />
                    <span>Top 3 Performing Restaurants</span>
                </h2>

                <div className="space-y-4">
                    {top3.map((restaurant, index) => {
                        const styles = rankStyles[index];
                        return (
                            <div
                                key={restaurant.id}
                                className={`
                                    flex flex-col sm:flex-row items-start sm:items-center justify-between
                                    p-4 rounded-lg border transition-all duration-300
                                    hover:shadow-md hover:border-transparent
                                    ${styles.bgColor} ${styles.borderColor}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rank medal */}
                                    <span className="text-3xl w-8 text-center">
                                        {medals[index]}
                                    </span>

                                    {/* Restaurant Info */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-slate-900 truncate" title={restaurant.name}>
                                            {restaurant.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 mt-1">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} />
                                                <span className="truncate" title={restaurant.location}>{restaurant.location}</span>
                                            </div>
                                            <span className="hidden sm:inline text-slate-300">|</span>
                                            <div className="flex items-center gap-1.5">
                                                <UtensilsCrossed size={14} />
                                                <span className="truncate" title={restaurant.cuisine}>{restaurant.cuisine}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue on the right */}
                                <div className={`
                                    flex items-center gap-2 font-bold text-lg mt-3 sm:mt-0 sm:ml-4 shrink-0
                                    ${styles.textColor}
                                `}>
                                    <TrendingUp size={20} />
                                    <span>
                                        ₹{restaurant.totalRevenue.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    );
}

