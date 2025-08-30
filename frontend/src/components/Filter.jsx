import React from 'react'
import { Calendar, DollarSign, Clock } from 'lucide-react';

export default function Filter({ filters, setFilters }) {

    const time = Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: `${String(i).padStart(2, "0")}:00`,
    }));


    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[1.01] font-inter">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">
                    <DollarSign className="w-6 h-6" />
                </span>
                Refine Your Search
            </h2>
            <div className="space-y-6">
                {/* Date Range */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="text-blue-500" />
                        Date Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="date" value={filters.dateRange.startDate}
                            onChange={e => setFilters(f => ({ ...f, dateRange: { ...f.dateRange, startDate: e.target.value } }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                        <input type="date" value={filters.dateRange.endDate}
                            onChange={e => setFilters(f => ({ ...f, dateRange: { ...f.dateRange, endDate: e.target.value } }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                    </div>
                </div>

                {/* Amount Range */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="text-blue-500" />
                        Amount Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="number" value={filters.minAmount}
                            min={0}
                            step={1}
                            onChange={e => setFilters(f => ({ ...f, minAmount: +e.target.value }))}
                            placeholder="Min Amount" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                        <input type="number" value={filters.maxAmount}
                            min={0}
                            step={1}
                            onChange={e => setFilters(f => ({ ...f, maxAmount: +e.target.value }))}
                            placeholder="Max Amount" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                    </div>
                </div>

                {/* Hours */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        Hour Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={filters.minHour}
                            onChange={e => setFilters(f => ({ ...f, minHour: +e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors">
                            <option value="" disabled>Select Min Hour</option>
                            {time.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <select value={filters.maxHour}
                            onChange={e => setFilters(f => ({ ...f, maxHour: +e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors">
                            <option value="" disabled>Select Max Hour</option>
                            {time.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}