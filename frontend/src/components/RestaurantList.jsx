import React from 'react'
import { Search, SortAsc, SortDesc, MapPin } from 'lucide-react';

export default function RestaurantList({ sortedRestaurants, searchQuery, setSearchQuery, sortBy, setSortBy, sortOrder, setSortOrder, selectedRestaurant, setSelectedRestaurant }) {
    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl font-inter">
            {/* Header section with title and subtitle */}
            <h2 className="text-2xl font-bold text-gray-800">Restaurant Directory</h2>
            <p className="text-sm text-gray-500 mb-6">Find your next favorite meal.</p>

            {/* Search and Sort controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-6 space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search for a restaurant..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <div className="flex space-x-2">
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="revenue">Sort by Revenue</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(o => (o === "asc" ? "desc" : "asc"))}
                        className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                    >
                        {sortOrder === "asc" ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Restaurant List */}
            <ul className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                {sortedRestaurants.length > 0 ? (
                    sortedRestaurants.map(r => (
                        <li
                            key={r.id}
                            onClick={() => setSelectedRestaurant(r)}
                            className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 shadow-sm
                                ${selectedRestaurant?.id === r.id
                                    ? "bg-blue-50 border-blue-500 shadow-md transform scale-[1.01] -translate-y-1"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-md"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-bold text-lg text-gray-800">{r.name}</div>
                                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{r.cuisine}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin className="mr-1 h-4 w-4 text-gray-400" /> {r.location}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-xl">
                        No restaurants found. Please adjust your search or filters.
                    </li>
                )}
            </ul>

        </div>
    )
}