import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  X,
  CheckCircle,
} from "lucide-react";
import { Event } from "../../../types/eventTypes";
import EventCard from "./EventCardAdmin";
import { fetchDropdownData, getEvents } from "../../../api/eventsApi";

interface EventType {
  id: string;
  name: string;
}

interface DropdownDataResponse {
  eventTypes: EventType[];
}

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const isFetchedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    status: 0,
    eventType: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dropdownData, setDropdownData] = useState<DropdownDataResponse | null>(
    null,
  );

  const eventsPerPage = 6;

  useEffect(() => {
    // Chỉ fetch nếu chưa từng fetch
    if (!isFetchedRef.current) {
      const fetchEventsData = async () => {
        try {
          setIsLoading(true);
          const response = await getEvents();
          const dropdownData = await fetchDropdownData();

          const fetchedEvents = Array.isArray(response)
            ? response
            : response.data || [];

          setEvents(fetchedEvents);
          setDropdownData(dropdownData);
          setError(null);
        } catch (err) {
          setError("Failed to fetch events. Please try again later.");
          console.error("Error fetching events:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEventsData();
      isFetchedRef.current = true; // Đánh dấu đã fetch
    }
  }, []);

  const handleDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId)); // Cập nhật lại danh sách sự kiện
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      const matchesDateRange =
        (!filters.startDate ||
          new Date(event.start_time) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(event.end_time) <= new Date(filters.endDate));

      // const matchesStatus =
      //   filters.status === 0 || event.status === filters.status.toString();

      const matchesEventType =
        filters.eventType === "all" ||
        event.event_type_id.toString() === filters.eventType;

      return matchesSearch && matchesDateRange && matchesEventType;
    });
  }, [events, filters]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      startDate: "",
      endDate: "",
      status: 0,
      eventType: "all",
    });
    setCurrentPage(1);
  };

  const renderStatusBadge = (status: number) => {
    const statusColors = {
      1: "bg-blue-100 text-blue-800",
      2: "bg-green-100 text-green-800",
      3: "bg-gray-100 text-gray-800",
    };

    const statusLabels = {
      1: "Sắp diễn ra",
      2: "Đang diễn ra",
      3: "Đã kết thúc",
    };

    // const handleDelete = (eventId: string) => {
    //   setEvents(events.filter((event) => event.id !== eventId)); // Cập nhật lại danh sách sự kiện
    // };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-slate-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Elegant Header with Gradient Text */}
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            Quản lý Sự kiện
          </h1>
        </header>

        {/* Enhanced Advanced Filters with Modern Design */}
        <section className="bg-white shadow-2xl rounded-3xl p-6 border border-slate-200 transition-all duration-500 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Filter className="mr-3 text-indigo-600" /> Bộ lọc nâng cao
            </h2>
            <div className="flex items-center space-x-4">
              {(filters.searchTerm ||
                filters.startDate ||
                filters.endDate ||
                filters.status !== 0 ||
                filters.eventType !== "all") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="mr-2" size={18} /> Xóa bộ lọc
                </button>
              )}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
              >
                {showAdvancedFilters ? (
                  <>
                    <CheckCircle className="mr-2" size={18} /> Thu gọn
                  </>
                ) : (
                  "Hiển thị bộ lọc"
                )}
              </button>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 gap-6 transition-all duration-500 ${
              showAdvancedFilters
                ? "opacity-100 max-h-screen"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Từ ngày
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  className="block w-full py-3 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Đến ngày
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  className="block w-full py-3 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Trạng thái sự kiện
                </label>
                <select
                  name="status"
                  value={filters.status}
                  className="block w-full py-3 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  onChange={handleFilterChange}
                >
                  <option value={0}>Tất cả trạng thái</option>
                  <option value={1}>Sắp diễn ra</option>
                  <option value={2}>Đang diễn ra</option>
                  <option value={3}>Đã kết thúc</option>
                </select>
              </div> */}
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Tìm kiếm sự kiện
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Nhập từ khóa..."
                    value={filters.searchTerm}
                    className="pl-12 pr-4 py-3 block w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    onChange={handleFilterChange}
                    name="searchTerm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Loại sự kiện
                </label>
                <select
                  name="eventType"
                  value={filters.eventType}
                  className="block w-full py-3 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  onChange={(e) =>
                    setFilters({ ...filters, eventType: e.target.value })
                  }
                >
                  <option value="all">Tất cả loại sự kiện</option>
                  {dropdownData &&
                    dropdownData.eventTypes &&
                    dropdownData.eventTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Events Table with Enhanced Design */}
        <section className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-200">
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-white border-b">
            <h2 className="text-2xl font-bold text-slate-800">
              Danh sách sự kiện
            </h2>
            <a
              href="/admin/create-event"
              className="flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-5 w-5" /> Thêm sự kiện
            </a>
          </div>

          {paginatedEvents.length === 0 ? (
            <div className="text-center py-10 text-slate-600">
              Không có sự kiện nào được tìm thấy
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      {[
                        "Tên sự kiện",
                        "Ngày diễn ra",
                        "Địa điểm",
                        // "Trạng thái",
                        "Hành động",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        renderStatusBadge={renderStatusBadge}
                        onDelete={handleDelete} // Truyền onDelete vào EventCard
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-white border-t">
                <span className="text-sm text-slate-600">
                  Hiển thị {(currentPage - 1) * eventsPerPage + 1} -{" "}
                  {Math.min(currentPage * eventsPerPage, filteredEvents.length)}{" "}
                  trên tổng số {filteredEvents.length} sự kiện
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white text-slate-600 rounded-lg border border-slate-300 hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white text-slate-600 rounded-lg border border-slate-300 hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventManagement;
