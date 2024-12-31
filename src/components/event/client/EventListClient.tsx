import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Event } from "types/eventTypes";
import EventCard from "./EventCard1";
import { getEvents } from "api/eventsApi";
import { useNavigate } from "react-router-dom";

interface EventListProps {
  onEventSelect?: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Số sự kiện mỗi trang
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents();

        // Adjust this part to match your actual API response structure
        const fetchedEvents = Array.isArray(response)
          ? response
          : response.data || [];

        // Sắp xếp sự kiện theo thời gian tổ chức giảm dần
        fetchedEvents.sort(
          (a, b) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
        );

        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setIsLoading(false);
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
    setCurrentPage(1); // Reset về trang đầu khi lọc
  }, [selectedDate, events]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendar = [];
    const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(
        <div key={`empty-${i}`} className="w-12 h-12 opacity-50"></div>,
      );
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isToday = dayDate.toDateString() === new Date().toDateString();
      const isSelected =
        selectedDate && dayDate.toDateString() === selectedDate.toDateString();
      const dayClassName = `w-12 h-12 flex items-center justify-center rounded-full 
        ${isToday ? "bg-indigo-500 text-white font-bold" : "hover:bg-gray-200"}
        ${isSelected ? "bg-indigo-300 text-white font-bold" : ""}
        cursor-pointer transition-colors`;

      calendar.push(
        <div
          key={`day-${i}`}
          className={dayClassName}
          onClick={() => {
            // Nếu ngày đã được chọn trước đó, bỏ chọn và hiển thị lại tất cả sự kiện
            if (isSelected) {
              setSelectedDate(null);
            } else {
              setSelectedDate(dayDate);
            }
          }}
        >
          {i}
        </div>,
      );
    }

    return { calendar, weekDays };
  };

  const handleWeekSelect = (weekStartDate: Date, weekEndDate: Date) => {
    // Kiểm tra nếu tuần này đã được chọn, thì bỏ lọc
    if (
      selectedWeek &&
      selectedWeek.start.getTime() === weekStartDate.getTime() &&
      selectedWeek.end.getTime() === weekEndDate.getTime()
    ) {
      setFilteredEvents(events); // Hiển thị lại tất cả sự kiện
      setSelectedWeek(null); // Đặt lại tuần đã chọn
    } else {
      // Chuyển đổi weekStartDate và weekEndDate thành dạng chỉ có ngày (xóa phần giờ, phút, giây)
      const startOfWeek = new Date(weekStartDate);
      startOfWeek.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây của ngày bắt đầu bằng 0
      const endOfWeek = new Date(weekEndDate);
      endOfWeek.setHours(23, 59, 59, 999); // Đặt giờ, phút, giây của ngày kết thúc là cuối ngày

      const filtered = events.filter((event) => {
        const eventDate = new Date(event.start_time);
        eventDate.setHours(0, 0, 0, 0); // Đảm bảo chỉ so sánh ngày, không tính phần giờ
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      });
      setFilteredEvents(filtered); // Cập nhật sự kiện theo tuần
      setSelectedWeek({ start: weekStartDate, end: weekEndDate }); // Lưu tuần đã chọn
    }
  };

  // Modify the generateWeekInfo method in the EventList component
  const generateWeekInfo = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const weeks: Array<{
      weekNumber: number;
      weekLabel: string;
      startDate: string;
      endDate: string;
      eventCount: number;
      isAcrossMonths: boolean;
      startDateObj: Date;
      endDateObj: Date;
    }> = [];

    // Get the first and last day of the current month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Determine the start of the first week (Monday before or on the first day of the month)
    const startOfFirstWeek = new Date(firstDayOfMonth);
    startOfFirstWeek.setDate(
      firstDayOfMonth.getDate() - ((firstDayOfMonth.getDay() + 6) % 7),
    );

    // Determine the end of the last week (Sunday after or on the last day of the month)
    const endOfLastWeek = new Date(lastDayOfMonth);
    endOfLastWeek.setDate(
      lastDayOfMonth.getDate() + (6 - ((lastDayOfMonth.getDay() + 6) % 7)),
    );

    let currentWeekStart = new Date(startOfFirstWeek);
    let weekCounter = 1;

    while (currentWeekStart <= endOfLastWeek) {
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Find events within this week
      const weekEvents = events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return eventDate >= weekStart && eventDate <= weekEnd;
      });

      // Determine week label and type
      let weekLabel = `Tuần ${weekCounter}`;
      let isAcrossMonths = false;

      // Special labeling for weeks spanning month boundaries
      if (weekStart.getMonth() !== month && weekEnd.getMonth() !== month) {
        // Skip weeks entirely outside the current month
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        continue;
      }

      if (weekStart.getMonth() !== month || weekEnd.getMonth() !== month) {
        isAcrossMonths = true;

        if (weekStart.getMonth() !== month) {
          weekLabel = `Tuần đầu ${currentDate.toLocaleString("vi-VN", { month: "long" })}`;
        } else {
          weekLabel = `Tuần cuối ${new Date(year, month).toLocaleString("vi-VN", { month: "long" })}`;
        }
      }

      // Create a more precise representation of the week
      weeks.push({
        weekNumber: weekCounter,
        weekLabel,
        startDate: weekStart.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
        endDate: weekEnd.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
        eventCount: events.filter((event) => {
          const eventDate = new Date(event.start_time);
          return eventDate >= weekStart && eventDate <= weekEnd;
        }).length,
        isAcrossMonths,
        startDateObj: weekStart,
        endDateObj: weekEnd,
      });

      // Move to the next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekCounter++;
    }

    return weeks;
  };

  const changeMonth = (direction: "next" | "prev") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDate(null); // Reset selected date when changing month
  };

  const { calendar, weekDays } = generateCalendar();
  const weekInfo = generateWeekInfo();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-indigo-500">Đang tải sự kiện...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto grid grid-cols-3 gap-6">
        {/* Event List Section */}
        <div className="col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-indigo-800 mb-6">
            Danh sách sự kiện
          </h1>
          {/* {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Không có sự kiện nào phù hợp
            </div>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(selectedEvent) =>
                  navigate(`/event/${selectedEvent.id}`)
                }
              />
            ))
          )} */}
          {paginatedEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Không có sự kiện nào phù hợp
            </div>
          ) : (
            paginatedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(selectedEvent) =>
                  navigate(`/event/${selectedEvent.id}`)
                }
              />
            ))
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              className="px-3 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 flex items-center"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-md ${
                    page === currentPage
                      ? "bg-indigo-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ),
            )}
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 flex items-center"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Trang sau <ArrowRight className="ml-2 w-4 h-4" /> 
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-800">
                {currentDate.toLocaleString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changeMonth("prev")}
                  className="text-indigo-500 hover:bg-indigo-100 p-1 rounded-full"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => changeMonth("next")}
                  className="text-indigo-500 hover:bg-indigo-100 p-1 rounded-full"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-gray-600 mb-4">
              {weekDays.map((day, index) => (
                <div key={index} className="font-medium text-center text-sm">
                  {day}
                </div>
              ))}
              {calendar}
            </div>

            {/* Week Information */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                Các tuần
              </h3>
              {weekInfo.map((week) => {
                const isSelected =
                  selectedWeek &&
                  selectedWeek.start.getTime() ===
                    new Date(week.startDate).getTime() &&
                  selectedWeek.end.getTime() ===
                    new Date(week.endDate).getTime();

                return (
                  <div
                    key={week.weekNumber}
                    className={`cursor-pointer bg-gray-100 rounded-lg p-3 mb-2 hover:bg-gray-200 transition-colors ${
                      week.isAcrossMonths ? "border-2 border-indigo-200" : ""
                    }`}
                    // Khi nhấp vào tuần, lọc sự kiện
                    onClick={() =>
                      handleWeekSelect(week.startDateObj, week.endDateObj)
                    }
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-indigo-700">
                        {week.weekLabel}
                      </span>
                      <div className="flex space-x-2">
                        <span className="text-gray-600">
                          {week.startDate} - {week.endDate}
                        </span>
                        {week.eventCount > 0 && (
                          <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1">
                            {week.eventCount} sự kiện
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
