import React, { useState, useEffect } from "react";
import { Event } from "types/eventTypes";
import EventCard from "../card/EventCard";
import { eventApi } from "api/eventsApi";
import { useNavigate } from "react-router-dom";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventApi.getAll();
        setEvents(data.slice(0, 3)); // Limit to first 3 events
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách sự kiện");
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải sự kiện...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl text-blue-500 font-medium text-center mb-8">
        Sự kiện nổi bật
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            onSelect={(event) => navigate(`/event/${event.eventId}`)}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          className="bg-black text-white px-6 py-2 rounded-md"
          onClick={() => navigate("/events")}
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default EventList;
