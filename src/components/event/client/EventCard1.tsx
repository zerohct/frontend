import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Event } from "../../../types/eventTypes";
import ImageDisplay from "components/common/ImageDisplay";

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
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer flex relative"
      onClick={() => onSelect && onSelect(event)}
    >
      {/* Date Badge - Positioned at top right */}
      <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md z-10">
        {formatDate(event.start_time)}
      </div>

      {/* Event Image Column - Centered with Overlay Effect */}
      <div className="w-56 relative flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20 z-[1] transition-all duration-300 group-hover:opacity-10"></div>
        {event.image ? (
          <ImageDisplay
            base64Image={event.image}
            alt={`Image for ${event.title}`}
            className="w-full h-full object-cover"
          />
        ):(
          <ImageDisplay
        base64Image="/assets/images/banner/image1.png" 
        alt="Default event image"
        className="absolute inset-0 w-full h-full object-cover"
      />
        )
        }
      </div>

      {/* Event Details Column - Flexible */}
      <div className="flex-grow p-10 flex flex-col justify-between relative">
        <div>
          <h3 className="text-2xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-700 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 text-gray-600 mb-4">
            {/* Time and Site with small gap */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate">{event.site}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm italic line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Subtle Hover Effect */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
      </div>
    </div>
  );
};

export default EventCard;
