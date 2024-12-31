import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  CalendarCheck,
  Users,
  TrendingUp,
  Filter,
  BarChart as BarChartIcon,
  ChevronRight,
} from "lucide-react";

// Enhanced event data with more comprehensive information
const eventData = [
  {
    id: 1,
    name: "Digital Innovation Summit",
    type: "Hội thảo",
    participants: 120,
    date: "2024-03-15",
    revenue: 45000,
    satisfaction: 92,
    location: "Hà Nội",
  },
  {
    id: 2,
    name: "Tech Startup Workshop",
    type: "Workshop",
    participants: 80,
    date: "2024-04-22",
    revenue: 32000,
    satisfaction: 88,
    location: "Hồ Chí Minh",
  },
  {
    id: 3,
    name: "Business Networking Conference",
    type: "Hội thảo",
    participants: 200,
    date: "2024-05-10",
    revenue: 75000,
    satisfaction: 95,
    location: "Đà Nẵng",
  },
  {
    id: 4,
    name: "Community Engagement Meet",
    type: "Giao lưu",
    participants: 50,
    date: "2024-06-05",
    revenue: 15000,
    satisfaction: 85,
    location: "Cần Thơ",
  },
];

const Dashboard = () => {
  const [selectedEventType, setSelectedEventType] = useState("Tất cả");

  // Advanced memoized calculations
  const totalParticipants = useMemo(
    () => eventData.reduce((sum, event) => sum + event.participants, 0),
    [],
  );

  const totalRevenue = useMemo(
    () => eventData.reduce((sum, event) => sum + event.revenue, 0),
    [],
  );

  const averageSatisfaction = useMemo(
    () =>
      (
        eventData.reduce((sum, event) => sum + event.satisfaction, 0) /
        eventData.length
      ).toFixed(1),
    [],
  );

  const filteredEvents = useMemo(() => {
    return selectedEventType === "Tất cả"
      ? eventData
      : eventData.filter((event) => event.type === selectedEventType);
  }, [selectedEventType]);

  const statsCards = [
    {
      icon: CalendarCheck,
      title: "Tổng Sự Kiện",
      value: eventData.length,
      bgGradient: "from-cyan-100 via-blue-200 to-indigo-300",
      iconColor: "text-blue-700",
    },
    {
      icon: Users,
      title: "Người Tham Dự",
      value: totalParticipants,
      bgGradient: "from-green-100 via-emerald-200 to-teal-300",
      iconColor: "text-green-700",
    },
    {
      icon: TrendingUp,
      title: "Mức Độ Hài Lòng",
      value: `${averageSatisfaction}%`,
      bgGradient: "from-purple-100 via-violet-200 to-pink-300",
      iconColor: "text-purple-700",
    },
  ];

  const eventTypes = ["Tất cả", "Hội thảo", "Workshop", "Giao lưu"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
        {/* Elegant Header with Glassmorphism */}
        <div className="relative bg-gradient-to-r from-blue-600/80 to-indigo-700/80 text-white p-8 flex items-center justify-between backdrop-blur-sm">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Bảng Điều Khiển Sự Kiện
            </h1>
            <p className="text-white/80 text-lg font-light">
              Phân tích toàn diện và chuyên sâu
            </p>
          </div>
          <BarChartIcon
            className="w-16 h-16 text-white/10 absolute right-8 top-1/2 -translate-y-1/2"
            strokeWidth={1}
          />
        </div>

        {/* Advanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`
                bg-gradient-to-br ${card.bgGradient} 
                rounded-3xl p-6 flex items-center space-x-6 
                shadow-2xl hover:scale-105 transition duration-500 
                transform hover:shadow-2xl relative overflow-hidden
                border border-white/20
              `}
            >
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <card.icon
                  className={`w-24 h-24 ${card.iconColor}`}
                  strokeWidth={1}
                />
              </div>
              <card.icon
                className={`w-14 h-14 ${card.iconColor} z-10`}
                strokeWidth={1.5}
              />
              <div className="z-10">
                <p className="text-white/80 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-black text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Event Type Filter with Advanced Styling */}
        <div className="px-8 pb-2">
          <div className="flex justify-center space-x-4 mb-6 bg-gray-100/50 backdrop-blur-sm p-3 rounded-full border border-white/30 shadow-lg">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`
                  px-5 py-2 rounded-full text-sm font-bold 
                  transition-all duration-500 ease-in-out relative
                  ${
                    selectedEventType === type
                      ? "bg-blue-600 text-white shadow-xl"
                      : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
              >
                {type}
                {selectedEventType === type && (
                  <span className="absolute -right-2 -top-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {filteredEvents.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Advanced Event Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Số Lượng Người Tham Dự
                </h2>
                <BarChartIcon className="w-6 h-6 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredEvents}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "transparent" }}
                    formatter={(value) => [`${value} người`, "Người tham dự"]}
                    labelFormatter={(label) => `Sự kiện: ${label}`}
                  />
                  <Bar dataKey="participants" radius={[10, 10, 0, 0]}>
                    {filteredEvents.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(220, 70%, ${70 - index * 10}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Event Satisfaction Card */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl p-6 shadow-xl border border-white/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Mức Độ Hài Lòng
                </h2>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/60 rounded-2xl p-4 shadow-md"
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {event.name}
                    </p>
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3"
                        style={{
                          background: `conic-gradient(#3B82F6 ${event.satisfaction * 3.6}deg, #e0e0e0 0deg)`,
                        }}
                      >
                        <span className="bg-white rounded-full w-7 h-7 flex items-center justify-center">
                          {event.satisfaction}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">% Hài Lòng</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Event Table */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Chi Tiết Sự Kiện
              </h2>
              <button className="text-blue-600 font-semibold flex items-center hover:text-blue-800 transition">
                Xem Thêm <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100/50 text-gray-600 text-sm">
                    <th className="px-6 py-3 text-left">Tên Sự Kiện</th>
                    <th className="px-6 py-3 text-left">Địa Điểm</th>
                    <th className="px-6 py-3 text-right">Người Tham Dự</th>
                    <th className="px-6 py-3 text-right">Ngày</th>
                    <th className="px-6 py-3 text-right">Hài Lòng</th>
                    <th className="px-6 py-3 text-right">Doanh Thu</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b hover:bg-blue-50/50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {event.participants}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {new Date(event.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-semibold">
                          {event.satisfaction}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(event.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
