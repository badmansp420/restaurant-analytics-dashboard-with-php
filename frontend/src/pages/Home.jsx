import React, { useState, useEffect } from "react";

import moment from "moment";
import { Search, SortAsc, SortDesc, MapPin } from "lucide-react";
import axios from "axios";
import Filter from "../components/Filter";
import RestaurantList from "../components/RestaurantList";
import TopThreeList from "../components/TopThreeList";
import Trends from "../components/Trends";

const BASE_URL = "http://localhost:8080/api";

export default function Home() {
    return <Dashboard />;
}



function Dashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [tempRestaurants, setTempRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");

    const [filters, setFilters] = useState({
        dateRange: { startDate: "2025-06-22", endDate: "2025-06-28" },
        minAmount: 0,
        maxAmount: 100000,
        minHour: 0,
        maxHour: 23,
    });

    // Fetch Restaurants
    useEffect(() => {
        axios.get(`${BASE_URL}/restaurants`)
            .then(res => {
                setRestaurants(res.data.data);
                setTempRestaurants(res.data.data);
            })
            .catch(err => console.error("Restaurant fetch error:", err));
    }, []);

    // Fetch Orders
    useEffect(() => {
        const params = {
            limit: 200,
            start_date: filters.dateRange.startDate,
            end_date: filters.dateRange.endDate,
            min_price: filters.minAmount,
            max_price: filters.maxAmount,
            start_hour: filters.minHour !== 0 ? `${String(filters.minHour).padStart(2, "0")}:00` : undefined,
            end_hour: filters.maxHour !== 23 ? `${String(filters.maxHour).padStart(2, "0")}:59` : undefined,
            sort: "date",
            order: "asc",
        };
        
        axios.get(`${BASE_URL}/orders`, { params })
            .then(res => setOrders(res.data.data))
            .catch(err => console.error("Orders fetch error:", err));
    }, [filters]);

    useEffect(() => {
        if (searchQuery) {
            setTempRestaurants(
                restaurants.filter(r =>
                    r.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else setTempRestaurants(restaurants);
    }, [searchQuery, restaurants]);

    useEffect(() => {
        let temp = orders.filter(o => {
            const amt = parseFloat(o.order_amount);
            const hour = moment(o.order_time).hour();
            return (
                amt >= filters.minAmount &&
                amt <= filters.maxAmount &&
                hour >= filters.minHour &&
                hour <= filters.maxHour
            );
        });
        setFilteredOrders(temp);
    }, [orders, filters]);

    const calcRevenue = id =>
        filteredOrders
            .filter(o => o.restaurant_id === id)
            .reduce((s, o) => s + parseFloat(o.order_amount), 0);

    const sortedRestaurants = [...tempRestaurants].sort((a, b) => {
        if (sortBy === "name") {
            return sortOrder === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        if (sortBy === "revenue") {
            return sortOrder === "asc"
                ? calcRevenue(a.id) - calcRevenue(b.id)
                : calcRevenue(b.id) - calcRevenue(a.id);
        }
        return 0;
    });

    const top3 = restaurants
        .map(r => ({ ...r, totalRevenue: calcRevenue(r.id) }))
        .sort((a, b) => parseFloat(b.totalRevenue) - parseFloat(a.totalRevenue))
        .slice(0, 3);

    const getTrendsData = restaurant => {
        const resOrders = filteredOrders.filter(o => o.restaurant_id === restaurant.id);

        const daily = resOrders.reduce((acc, o) => {
            const d = moment(o.order_time).format("YYYY-MM-DD");
            if (!acc[d]) acc[d] = { date: d, orderCount: 0, totalRevenue: 0, orderAmounts: [] };
            acc[d].orderCount++;
            acc[d].totalRevenue += parseFloat(o.order_amount);
            acc[d].orderAmounts.push(parseFloat(o.order_amount));
            return acc;
        }, {});

        const chartData = Object.values(daily).map(d => ({
            ...d,
            averageOrderValue: d.orderCount > 0 ? d.totalRevenue / d.orderCount : 0,
        }));

        const hourly = resOrders.reduce((acc, o) => {
            const hr = moment(o.order_time).hour();
            const d = moment(o.order_time).format("YYYY-MM-DD");
            acc[d] = acc[d] || {};
            acc[d][hr] = (acc[d][hr] || 0) + 1;
            return acc;
        }, {});

        const peakHourData = Object.entries(hourly).map(([date, hours]) => {
            let peakHour = "N/A", max = 0;
            for (const [h, c] of Object.entries(hours)) {
                if (c > max) { max = c; peakHour = `${String(h).padStart(2, "0")}:00`; }
            }
            return { date, peakHour, maxOrders: max };
        });

        return { chartData, peakHourData };
    };

    const trendsData = selectedRestaurant ? getTrendsData(selectedRestaurant) : null;

    return (
        <div className="min-h-screen bg-slate-100/70 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Restaurant Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">

                    {/* Filters */}
                    <Filter
                        filters={filters}
                        setFilters={setFilters}
                    />

                    {/* Restaurant List */}
                    <RestaurantList
                        sortedRestaurants={sortedRestaurants}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        selectedRestaurant={selectedRestaurant}
                        setSelectedRestaurant={setSelectedRestaurant}
                    />
                </div>

                <div className="rounded-2xl md:col-span-2 space-y-6">
                    {/* Top 3 */}
                    <TopThreeList top3={top3} />

                    {/* Trends */}
                    {selectedRestaurant && trendsData && (
                        <Trends
                            selectedRestaurant={selectedRestaurant}
                            filters={filters}
                            trendsData={trendsData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
