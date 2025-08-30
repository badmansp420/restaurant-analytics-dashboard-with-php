import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import moment from "moment";
import { Search, SortAsc, SortDesc } from 'lucide-react'
import axios from 'axios';
import { Map } from "lucide-react";
import { MapPin } from "lucide-react";
import { Utensils } from "lucide-react";

const BASE_URL = "http://localhost:8080/api";


export default function Home() {
    return (
        <Dashboard />
    )
}


const time = [
    {
        value: 0,
        label: "00:00"
    },
    {
        value: 1,
        label: "01:00"
    },
    {
        value: 2,
        label: "02:00"
    },
    {
        value: 3,
        label: "03:00"
    },
    {
        value: 4,
        label: "04:00"
    },
    {
        value: 5,
        label: "05:00"
    },
    {
        value: 6,
        label: "06:00"
    },
    {
        value: 7,
        label: "07:00"
    },
    {
        value: 8,
        label: "08:00"
    },
    {
        value: 9,
        label: "09:00"
    },
    {
        value: 10,
        label: "10:00"
    },
    {
        value: 11,
        label: "11:00"
    },
    {
        value: 12,
        label: "12:00"
    },
    {
        value: 13,
        label: "13:00"
    },
    {
        value: 14,
        label: "14:00"
    },
    {
        value: 15,
        label: "15:00"
    },
    {
        value: 16,
        label: "16:00"
    },
    {
        value: 17,
        label: "17:00"
    },
    {
        value: 18,
        label: "18:00"
    },
    {
        value: 19,
        label: "19:00"
    },
    {
        value: 20,
        label: "20:00"
    },
    {
        value: 21,
        label: "21:00"
    },
    {
        value: 22,
        label: "22:00"
    },
    {
        value: 23,
        label: "23:59"
    }
];




function Dashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [tempRestaurants, setTempRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        dateRange: {
            startDate: '2025-06-22',
            endDate: '2025-06-28'
        },
        minAmount: 0,
        maxAmount: 100000,
        minHour: 0,
        maxHour: 23,
    });
    const [searchQuery, setSearchQuery] = useState('');

    // RESTAURANTS data ko fetch karein
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/restaurants`);
                setRestaurants(response.data.data);
                setTempRestaurants(response.data.data);
            } catch (error) {
                console.error("Error fetching restaurants data:", error);
            }
        };
        fetchRestaurants();
    }, []);

    // ORDERS data ko fetch aur filter karein
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const params = {
                    limit: 200,
                    start_date: filters.dateRange.startDate || undefined,
                    end_date: filters.dateRange.endDate || undefined,
                    min_price: filters.minAmount || undefined,
                    max_price: filters.maxAmount || undefined,
                    start_hour: filters.minHour !== 0 ? `${String(filters.minHour).padStart(2, '0')}:00` : undefined,
                    end_hour: filters.maxHour !== 23 ? `${String(filters.maxHour).padStart(2, '0')}:59` : undefined,
                    sort: 'date',
                    order: 'asc'
                };
                const response = await axios.get(`${BASE_URL}/orders`, { params });
                setOrders(response.data.data);
            } catch (error) {
                console.error("Error fetching orders data:", error);
            }
        };
        fetchOrders();
    }, [filters]);

    useEffect(() => {
        if (searchQuery) {
            const filteredRestaurants = restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setTempRestaurants(filteredRestaurants);
        } else {
            setTempRestaurants(restaurants);
        }
    }, [searchQuery]);

    useEffect(() => {
        // Client-side filtering and sorting
        let tempOrders = orders;

        // const matchingRestaurantIds = restaurants
        //     .filter(r => r.name.toLowerCase().includes(filters.searchQuery?.toLowerCase()))
        //     .map(r => r.id);

        // if (filters.searchQuery) {
        //     tempOrders = orders.filter(order => matchingRestaurantIds.includes(order.restaurant_id));
        // }

        const applyTimeFilter = (order) => {
            const orderHour = new Date(`1970/01/01 ${moment(order.order_time).format('HH:mm')}`).getHours();
            return orderHour >= filters.minHour && orderHour <= filters.maxHour;
        };

        tempOrders = tempOrders.filter(order => parseFloat(order.order_amount) >= parseFloat(filters.minAmount) && parseFloat(order.order_amount) <= parseFloat(filters.maxAmount) && applyTimeFilter(order));

        setFilteredOrders(tempOrders);

    }, [orders, filters, restaurants]);


    const calculateTotalRevenue = (restaurantId) => {
        return filteredOrders
            .filter(order => order.restaurant_id === restaurantId)
            .reduce((sum, order) => parseFloat(sum) + parseFloat(order.order_amount), 0);
    };

    const sortedRestaurants = [...tempRestaurants].sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortBy === 'revenue') {
            const revenueA = calculateTotalRevenue(a.id);
            const revenueB = calculateTotalRevenue(b.id);
            return sortOrder === 'asc' ? revenueA - revenueB : revenueB - revenueA;
        }
        return 0;
    });

    const top3 = restaurants
        .map(r => ({ ...r, totalRevenue: calculateTotalRevenue(r.id) }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 3);

    const getTrendsData = (restaurant) => {
        const restaurantOrders = filteredOrders.filter(order => order.restaurant_id === restaurant.id);

        // Daily Orders, Revenue & Average Order Value
        const dailyData = restaurantOrders.reduce((acc, order) => {
            const date = moment(order.order_time).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = { date, orderCount: 0, totalRevenue: 0, orderAmounts: [] };
            }
            acc[date].orderCount++;
            acc[date].totalRevenue += parseFloat(order.order_amount);
            acc[date].orderAmounts.push(parseFloat(order.order_amount));
            return acc;
        }, {});

        const chartData = Object.values(dailyData).map(day => ({
            ...day,
            averageOrderValue: day.orderCount > 0 ? day.totalRevenue / day.orderCount : 0
        }));

        // Peak Order Hour
        const hourlyData = restaurantOrders.reduce((acc, order) => {
            const hour = moment(order.order_time).hour();
            const date = moment(order.order_time).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = {};
            }
            acc[date][hour] = (acc[date][hour] || 0) + 1;
            return acc;
        }, {});

        const peakHourData = Object.entries(hourlyData).map(([date, hours]) => {
            let peakHour = 'N/A';
            let maxOrders = 0;
            for (const [hour, count] of Object.entries(hours)) {
                if (count > maxOrders) {
                    maxOrders = count;
                    peakHour = `${String(hour).padStart(2, '0')}:00 - ${String(parseInt(hour) + 1).padStart(2, '0')}:00`;
                }
            }
            return { date, peakHour, maxOrders };
        });

        return { chartData, peakHourData };
    };

    const trendsData = selectedRestaurant ? getTrendsData(selectedRestaurant) : null;

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Restaurant Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Side Column */}
                <div className="md:col-span-1 space-y-6">
                    {/* Filters Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Filters</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Date Range</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={filters.dateRange.startDate}
                                        onChange={(e) => setFilters(p => ({ ...p, dateRange: { ...p.dateRange, startDate: e.target.value } }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={filters.dateRange.endDate}
                                        onChange={(e) => setFilters(p => ({ ...p, dateRange: { ...p.dateRange, endDate: e.target.value } }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Amount Range</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        name="minAmount"
                                        value={filters.minAmount}
                                        onChange={(e) => setFilters(p => ({ ...p, minAmount: Number(e.target.value) }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Min Amount"
                                    />
                                    <input
                                        type="number"
                                        name="maxAmount"
                                        value={filters.maxAmount}
                                        onChange={(e) => setFilters(p => ({ ...p, maxAmount: Number(e.target.value) }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Max Amount"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Hour Range (24h)</label>
                                <div className="flex space-x-2">
                                    {/* <input
                                        type="number"
                                        name="minHour"
                                        value={filters.minHour}
                                        onChange={(e) => setFilters(p => ({ ...p, minHour: Number(e.target.value) }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Min Hour"
                                    /> */}

                                    <select name="minHour" id="minHour"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filters.minHour} onChange={(e) => setFilters(p => ({ ...p, minHour: Number(e.target.value) }))}>
                                        {time.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select name="maxHour" id="maxHour"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filters.maxHour} onChange={(e) => setFilters(p => ({ ...p, maxHour: Number(e.target.value) }))}>
                                        {time.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Restaurant List Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Restaurants</h2>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search restaurants..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="flex items-center space-x-1">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="name">Name</option>
                                    <option value="revenue">Revenue</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {sortBy === 'name' ? (
                                        sortOrder === 'asc' ? <SortAsc /> : <SortDesc />
                                    ) : (
                                        sortOrder === 'asc' ? <SortAsc /> : <SortDesc />
                                    )}
                                </button>
                            </div>
                        </div>
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {sortedRestaurants.map(restaurant => (
                                <li
                                    key={restaurant.id}
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ease-in-out relative ${selectedRestaurant && selectedRestaurant.id === restaurant.id ? 'bg-blue-50 border-blue-500 shadow-inner' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                                >
                                    <div className="font-bold text-gray-800">{restaurant.name}</div>
                                    <div className="text-sm text-gray-500 flex items-center "><MapPin className="mr-1 h-5 w-5 text-blue-500" />{restaurant.location}</div>
                                    <div className="absolute top-1 right-1 px-2 text-sm text-gray-600 bg-teal-100 rounded-full border border-gray-50  flex items-center gap-1">
                                        {/* <Utensils className="h-4 w-4 text-teal-700" /> */}
                                        {restaurant.cuisine}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Side Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Top Restaurants Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Top 3 Restaurants by Revenue</h2>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <ul className="space-y-2">
                                {top3.map((restaurant, index) => (
                                    <li key={restaurant.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                        <span className="font-bold text-lg text-gray-800">{index + 1}. {restaurant.name}</span>
                                        <span className="text-blue-600 font-semibold text-xl">₹{restaurant.totalRevenue.toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Restaurant Trends Section */}
                    {selectedRestaurant && trendsData && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                {selectedRestaurant.name} - Order Trends
                            </h2>
                            <p className="text-gray-500 mb-6">Displaying trends from {filters.dateRange.startDate} to {filters.dateRange.endDate}</p>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Daily Orders Count */}
                                    <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Orders Count</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={trendsData.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="orderCount" stroke="#3b82f6" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Daily Revenue */}
                                    <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Revenue (₹)</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={trendsData.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                                <Line type="monotone" dataKey="totalRevenue" stroke="#10b981" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Average Order Value */}
                                    <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Average Order Value (₹)</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={trendsData.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                                <Bar dataKey="averageOrderValue" fill="#f59e0b" barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Peak Order Hour per day */}
                                    <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Peak Order Hour per Day</h3>
                                        <ul className="space-y-3">
                                            {trendsData.peakHourData.map((data) => (
                                                <li key={data.date} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0">
                                                    <span className="font-medium text-gray-600">{moment(data.date).format('MMMM Do, YYYY')}</span>
                                                    <span className="text-blue-500 font-bold">{data.peakHour}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
