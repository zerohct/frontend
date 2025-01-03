import React from "react";
import { Calendar, Image as ImageIcon } from "lucide-react";
import { Event, EventStatus } from "types/eventTypes";

interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer max-w-[400px]"
      onClick={() => onSelect && onSelect(event)}
    >
      <div className="relative h-52 -mx-6 -mt-6 mb-8 rounded-t-lg overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={`Image for ${event.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
            <span className="text-gray-400">Không có hình ảnh</span>
          </div>
        )}
      </div>

      <h3 className="text-blue-500 text-2xl font-medium mb-5 line-clamp-2">
        {event.title}
      </h3>

      <div className="flex items-center text-gray-600 text-base mb-5">
        <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
        {formatDate(event.startDate)}
      </div>

      <p className="text-gray-500 text-base line-clamp-2">
        {event.description}
      </p>
    </div>
  );
};

export default EventCard;
