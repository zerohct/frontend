import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Event } from "types/eventTypes";
import EventCard from "../card/EventCard1";
import { eventApi } from "api/eventsApi";
import { useNavigate } from "react-router-dom";

const EventList1: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventApi.getAll();

        // Sort events by start date descending
        const sortedEvents = [...data].sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );

        setEvents(sortedEvents);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Không thể tải danh sách sự kiện");
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-12 text-center">
          Danh sách sự kiện
        </h1>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Không có sự kiện nào
          </div>
        ) : (
          <div className="space-y-6">
            {currentEvents.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onSelect={(selectedEvent) =>
                  navigate(`/event/${selectedEvent.eventId}`)
                }
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 flex items-center"
              onClick={() => setCurrentPage((curr) => curr - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Trang trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-md ${
                  page === currentPage
                    ? "bg-indigo-700 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 flex items-center"
              onClick={() => setCurrentPage((curr) => curr + 1)}
              disabled={currentPage === totalPages}
            >
              Trang sau <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList1;
