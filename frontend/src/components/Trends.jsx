import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from "recharts";
import moment from "moment";
import { ShoppingBag, IndianRupee, Wallet, Clock } from 'lucide-react';



// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200">
                <p className="font-semibold text-slate-800">{data.fullDate}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="text-sm">
                        {`${p.name}: `}
                        <span className="font-bold">
                            {p.dataKey.includes('Revenue') || p.dataKey.includes('Value')
                                ? `₹${p.value.toLocaleString('en-IN')}`
                                : p.value}
                        </span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


export default function Trends({ selectedRestaurant, filters, trendsData }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    {selectedRestaurant.name} - Performance Trends
                </h2>
                <p className="text-base text-slate-500 mt-1">
                    Showing data from {filters.dateRange.startDate} to {filters.dateRange.endDate}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Orders */}
                <div className="p-5 bg-slate-100/50 rounded-xl border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <ShoppingBag className="text-blue-500" size={20} />
                        <span>Daily Orders</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={trendsData.chartData}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="orderCount" name="Orders" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Daily Revenue */}
                <div className="p-5 bg-slate-100/50 rounded-xl border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <IndianRupee className="text-green-500" size={20} />
                        <span>Daily Revenue</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={trendsData.chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="totalRevenue" name="Revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Avg Order Value */}
                <div className="p-5 bg-slate-100/50 rounded-xl border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <Wallet className="text-amber-500" size={20} />
                        <span>Average Order Value</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={trendsData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }} />
                            <Bar dataKey="averageOrderValue" name="Avg. Order Value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Peak Order Hours */}
                <div className="p-5 bg-slate-100/50 rounded-xl border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <Clock className="text-purple-500" size={20} />
                        <span>Peak Order Hours</span>
                    </h3>
                    <div className="space-y-3 h-[250px] overflow-y-auto pr-2">
                        {trendsData.peakHourData.map(d => (
                            <div key={d.date} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                                <span className="text-slate-600 text-sm">{moment(d.date).format("dddd, MMM Do")}</span>
                                <span className="bg-purple-100 text-purple-700 font-bold text-sm px-3 py-1 rounded-full">{d.peakHour}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}