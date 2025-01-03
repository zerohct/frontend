import React, { useState, useEffect } from "react";
import { Eye, Pencil, Download, Trash2 } from "lucide-react";
import { Event, EventStatus } from "types/eventTypes";
import { eventApi } from "api/eventsApi";

const AdminEventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 7;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventApi.getAll();
      setEvents(data);
      setTotalEvents(data.length);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  return (
    <div className="min-h-screen bg-[#EFF6FF]">
      <div className="max-w-6xl mx-auto pt-6 px-6">
        <h1 className="text-3xl font-bold text-[#0066FF] text-center mb-6">
          Quản lý Sự kiện
        </h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold">Danh sách sự kiện</h2>
            <button className="bg-[#0066FF] text-white px-4 py-2 rounded-md hover:bg-blue-600">
              + Thêm sự kiện
            </button>
          </div>

          <div className="w-full">
            <div className="bg-gray-100">
              <div className="grid grid-cols-4 px-6 py-3">
                <div className="text-gray-600">Tên sự kiện</div>
                <div className="text-gray-600">Ngày diễn ra</div>
                <div className="text-gray-600">Địa điểm</div>
                <div className="text-gray-600 text-center">Hành động</div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {paginatedEvents.map((event) => (
                <div
                  key={event.eventId}
                  className="grid grid-cols-4 px-6 py-4 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">HỘI THẢO: "TESTING & QA"</div>
                    <div className="text-sm text-gray-500">Hội Thảo</div>
                  </div>
                  <div className="self-center">10/12/2024</div>
                  <div className="self-center">E3-05.01</div>
                  <div className="flex justify-center space-x-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-3 bg-white border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Hiển thị 1 - 7 trên tổng số 10 sự kiện
              </span>
              <div className="flex space-x-1">
                <button
                  className="px-3 py-1 bg-gray-200 rounded text-gray-600"
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 rounded text-gray-600"
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventList;
