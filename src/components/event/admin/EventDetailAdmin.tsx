import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createEvent,
  fetchDropdownData,
  getEventById,
  toggleRegistration,
  uploadEventImage,
} from "api/eventsApi";
import { Event, EventType, Semester, AcademicYear } from "types/eventTypes";
import {
  Camera,
  FileText,
  Calendar,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { showToast } from "utils/toast";

interface DropdownData {
  eventTypes: EventType[];
  semesters: Semester[];
  academicYears: AcademicYear[];
}

const EventDetailAdmin: React.FC = () => {
    const { eventId } = useParams(); // Lấy eventId từ URL
    const [event, setEvent] = useState<Event | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false); // Lưu trạng thái đăng ký
    const [isToggling, setIsToggling] = useState(false); // Trạng thái đang xử lý toggle
    const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);

    // Lấy chi tiết sự kiện từ API và trạng thái đăng ký
    useEffect(() => {
      const fetchEventDetail = async () => {
        setLoading(true); // Set loading to true at the beginning
  
        try {
          if (!eventId) {
            setError("Không tìm thấy ID sự kiện.");
            setLoading(false);
            return;
          }
  
          // Fetch event details first
          const eventResponse = await getEventById(eventId);
          setEvent(eventResponse.data);
          setImagePreview(eventResponse.data.image);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Lỗi khi tải thông tin sự kiện.",
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchEventDetail();
    }, [eventId]); // Dependency array includes 'id' to refetch if it changes
  
    // Định dạng thời gian
    const formatDateTime = (dateString: string) => {
      return new Date(dateString).toLocaleString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);


  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const data = await fetchDropdownData();
        setDropdownData(data);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
        alert("Không thể tải dữ liệu. Vui lòng thử lại sau!");
      }
    };
    loadDropdownData();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-indigo-500">Đang tải thông tin sự kiện...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Không tìm thấy sự kiện.
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-5 max-h-[500px] overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-lg p-10">
        {/* Form Header */}
        <div className="flex items-center justify-between">
        <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mb-4 hover:bg-blue-200 transition"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
      </button>
      <button
        onClick={() => navigate(`/admin/event-update/${eventId}`)}
        className="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mb-4 hover:bg-blue-200 transition"
      >
        Chỉnh sửa <ArrowRight className="ml-2 w-4 h-4" /> 
      </button>
      </div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-indigo-800 mb-4">
            Thông tin chi tiết
          </h2>
          <p className="text-2xl text-gray-700">
            {event.title}
          </p>
        </div>

        <form >
          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center text-indigo-800 mb-6 gap-2">
              <FileText className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Thông tin cơ bản</h3>
            </div>

            <div className="space-y-6">

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  readOnly
                  value={event.description}
                  // onChange={handleInputChange}
                  // placeholder="Mô tả ngắn gọn về sự kiện"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[120px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 "
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Nội dung chi tiết
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={event.content}
                  readOnly
                  // onChange={handleInputChange}
                  placeholder="Nội dung chi tiết của sự kiện"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[120px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Time and Location Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center text-indigo-800 mb-6 gap-2">
              <Calendar className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Thời gian và địa điểm</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="startTime"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  // type="datetime-local"
                  id="startTime"
                  name="start_time"
                  readOnly
                  value={event.start_time}
                  // onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label
                  htmlFor="end_time"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Thời gian kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  // type="datetime-local"
                  id="end_time"
                  name="end_time"
                  readOnly
                  value={event.end_time}
                  // onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <label className="flex-grow font-medium text-gray-700">
                Hình thức tổ chức
              </label>
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={event.is_online}
                    readOnly
                    className="sr-only peer"
                  />
                  {/* {event.is_online} */}
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span>{event.is_online ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="site"
                className="block mb-2 font-medium text-gray-700"
              >
                Địa điểm/Link tham gia <span className="text-red-500">*</span>
              </label>
              <input
                // type="text"
                id="site"
                name="site"
                readOnly
                value={event.site}
                // onChange={handleInputChange}
                placeholder="Nhập địa điểm tổ chức"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Registration Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center text-indigo-800 mb-6 gap-2">
              <Users className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Thông tin đăng ký</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Số lượng tham gia tối đa
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  min="0"
                  readOnly
                  value={event.max_participants}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label
                  htmlFor="registration_deadline"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Hạn đăng ký
                </label>
                <input
                  // type="datetime-local"
                  id="registration_deadline"
                  name="registration_deadline"
                  value={event.registration_deadline}
                  readOnly
                  // onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center text-indigo-800 mb-6 gap-2">
              <Camera className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Phân loại</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Event Type Dropdown */}
              <div>
                <label
                  htmlFor="eventTypeId"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Loại sự kiện <span className="text-red-500">*</span>
                </label>
                <p
                  id="eventType"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white"
                >
                  {dropdownData?.eventTypes.find((type) => type.id === event?.event_type_id)?.name || "Không xác định"}
                </p>
              </div>

              {/* Semester Dropdown */}
              <div>
                <label
                  htmlFor="semesterId"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Học kỳ <span className="text-red-500">*</span>
                </label>
                <p
                  id="semester"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-800"
                >
                  {dropdownData?.semesters.find((semester) => semester.id === event?.semester_id)?.name || "Không xác định"}
                </p>
              </div>

              {/* Academic Year Dropdown */}
              <div>
                <label
                  htmlFor="academicYearId"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Năm học <span className="text-red-500">*</span>
                </label>
                <p
                  id="academicYear"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-800"
                >
                  {dropdownData?.academicYears.find((year) => year.id === event?.academic_year_id)?.name || "Không xác định"}
                </p>
              </div>
            </div>


            <div className="mt-6">
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center 
                  ${imagePreview ? "border-indigo-500" : "border-gray-300"} 
                  relative h-72 flex flex-col justify-center items-center`}
                          >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview}
                            alt="Event Image"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Không có hình ảnh nào để hiển thị.
                        </p>
                      )}

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventDetailAdmin;
