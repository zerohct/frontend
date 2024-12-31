import React, { useState, useEffect } from "react";
import { Edit, Eye, Trash, Info, Paperclip } from "lucide-react";
import { Event, EventType, Semester, AcademicYear } from "types/eventTypes";
import { fetchDropdownData, deleteEvent } from "api/eventsApi";
import UpdateEventForm from "./UpdateEventForm";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
  renderStatusBadge: (status: number) => React.ReactNode;
  onDelete: (eventId: string) => void; // Callback để xóa sự kiện từ parent component
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  renderStatusBadge,
  onDelete,
}) => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách các loại sự kiện khi component mount
  useEffect(() => {
    const getDropdownData = async () => {
      try {
        const response = await fetchDropdownData(); // Lấy dữ liệu từ API
        if (response && response.eventTypes) {
          setEventTypes(response.eventTypes); // Set dữ liệu eventTypes từ response
        } else {
          console.error("Invalid event types data structure:", response);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    getDropdownData();
  }, []);

  // Tìm tên loại sự kiện từ eventTypeId
  const getEventTypeName = (id: string) => {
    if (!eventTypes || eventTypes.length === 0) {
      return "Unknown Type";
    }
    const eventType = eventTypes.find((type) => String(type.id) === String(id));
    return eventType ? eventType.name : "Unknown Type";
  };

  // Hàm xóa sự kiện
  const handleDelete = async () => {
    if (!event.id) {
      console.error("Event ID is undefined");
      return;
    }
    try {
      await deleteEvent(event.id); // Gọi API để xóa sự kiện
      onDelete(event.id); // Thông báo cho parent component rằng sự kiện đã được xóa
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleViewRegistrations = () => {
    navigate(`/admin/event-registrations/${event.id}`, {
      state: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleUploadPoster = () => {
    navigate(`/admin/events/${event.id}/poster/edit`, {
      state: {
        eventId: event.id,
      },
    });
  };

  const handleUpdate = () => {
    navigate(`/admin/event-update/${event.id}`, {
      state: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleViewDetail = () => {
    navigate(`/admin/event-detail/${event.id}`, {
      state: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };
  

  return (
    <tr className="border-b hover:bg-indigo-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">
              {event.title}
            </div>
            <div className="text-xs text-slate-500">
              {getEventTypeName(event.event_type_id)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {new Date(event.start_time).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{event.site}</td>
      {/* <td className="px-6 py-4">{renderStatusBadge(event.status)}</td> */}
      <td className="px-6 py-4">
        <div className="flex space-x-2">
        <button
            className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-100"
            aria-label="Xem thông tin đăng ký"
            onClick={handleViewRegistrations} // Thêm sự kiện onClick
          >
            <Info size={18} />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-100"
            aria-label="Thiết kế poster"
            onClick={handleUploadPoster} // Thêm sự kiện onClick
          >
            <Paperclip size={18} />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-100"
            aria-label="Xem chi tiết"
            onClick={handleViewDetail} // Thêm sự kiện onClick
          >
            <Eye size={18} />
          </button>
          <button
            className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-100"
            aria-label="Chỉnh sửa"
            onClick={handleUpdate}
          >
            <Edit size={18} />
          </button>
          <button
            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100"
            aria-label="Xóa"
            onClick={handleDelete} // Gọi handleDelete khi nhấn nút xóa
          >
            <Trash size={18} />
          </button>
        </div>
      </td>
      {/* {isEditModalOpen && (
        <UpdateEventForm
          event={event}
          eventTypes={eventTypes ?? []}
          semesters={semesters ?? []}
          academicYears={academicYears ?? []}
          //eventTypes={eventTypes}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedEvent) => {
            // Cập nhật danh sách sự kiện sau khi chỉnh sửa
            console.log("Updated event:", updatedEvent);
          }}
        />
      )} */}
    </tr>
  );
};

export default EventCard;
