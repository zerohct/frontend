import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Event, EventStatus } from "types/eventTypes";

interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer flex relative max-w-[1100px] mx-auto h-48"
      onClick={() => onSelect && onSelect(event)}
    >
      <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full px-4 py-1.5 text-base font-semibold shadow-md z-10">
        {formatDate(event.startDate)}
      </div>

      <div className="w-48 relative flex-shrink-0 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={`Image for ${event.title}`}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image</span>
          </div>
        )}
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-indigo-900 leading-tight line-clamp-2">
            {event.title}
          </h3>

          <div className="text-gray-600">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="text-base">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="text-base truncate">{event.location}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-base italic line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
