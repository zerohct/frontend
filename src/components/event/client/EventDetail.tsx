import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  toggleRegistration,
  getRegistrationStatus,
} from "../../../api/eventsApi";
import {
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
  Phone,
  MailIcon,
  Store,
  UniversityIcon,
} from "lucide-react";
import { Event } from "types/eventTypes";
import { showToast } from "utils/toast";
import ImageDisplay from "components/common/ImageDisplay";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false); // Lưu trạng thái đăng ký
  const [isToggling, setIsToggling] = useState(false); // Trạng thái đang xử lý toggle

  // Lấy chi tiết sự kiện từ API và trạng thái đăng ký
  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true); // Set loading to true at the beginning

      try {
        if (!id) {
          setError("Không tìm thấy ID sự kiện.");
          setLoading(false);
          return;
        }

        // Fetch event details first
        const eventResponse = await getEventById(id);
        setEvent(eventResponse.data);

        // Now, fetch the registration status for the event
        const registrationResponse = await getRegistrationStatus(id);
        setIsRegistered(registrationResponse.data.is_registered || false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải thông tin sự kiện.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]); // Dependency array includes 'id' to refetch if it changes

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

  // Xử lý quay lại trang trước
  const handleGoBack = () => {
    navigate(-1);
  };

  // Xử lý đăng ký hoặc hủy đăng ký sự kiện
  const handleToggleRegistration = async () => {
    if (isToggling) return;

    if (!id) {
      alert("Event ID is missing!");
      return;
    }

    setIsToggling(true);
    try {
      console.log("Sending event ID:", id);
      const response = await toggleRegistration(id);
      if (response.data) setIsRegistered(response.data.is_registered);
      showToast(response);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while toggling registration.",
      );
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-indigo-500">Đang tải thông tin sự kiện...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div className="text-center">
          <p>{error}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded"
          >
            Quay lại
          </button>
        </div>
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
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <button
          onClick={handleGoBack}
          className=" top-4 left-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white/90 transition"
        >
          <ArrowLeft className="w-6 h-6 text-indigo-600" />
        </button>
        <div
      className="h-96 bg-cover bg-center relative"
      style={{
        backgroundImage: event.image 
          ? `url(${event.image})` 
          : 'none'
      }}
    >
      {event.image ? (
        <ImageDisplay
          base64Image={event.image}
          alt={`Image for ${event.title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <ImageDisplay
      base64Image="/assets/images/banner/image1.png" 
      alt="Default event image"
      className="absolute inset-0 w-full h-full object-cover"
    />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white text-center px-4">
          {event.title}
        </h1>
      </div>
    </div>
        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              Chi tiết sự kiện
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-indigo-500" />
                <span>{formatDate(event.start_time)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-indigo-500" />
                <span>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-indigo-500" />
                <span>{event.site || "Địa điểm chưa xác định"}</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-3">
                Mô tả
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>
            <div className="mt-6">
              <p className="text-gray-600 leading-relaxed">{event.content}</p>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-indigo-800">
                Thông tin đăng ký
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Hình thức:</span>
                  <span className="font-medium">
                    {event.is_online ? "Trực tuyến" : "Trực tiếp"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Hạn đăng ký:</span>
                  <span className="font-medium">
                    {event.registration_deadline
                      ? formatDateTime(event.registration_deadline)
                      : "Không giới hạn"}
                  </span>
                </p>
              </div>
              <button
                onClick={handleToggleRegistration}
                className={`w-full py-3 rounded-lg transition-colors ${
                  isRegistered
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                disabled={isToggling} // Disable khi đang xử lý
              >
                {isRegistered ? "Hủy đăng ký" : "Đăng ký tham gia"}
              </button>
            </div>
            <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                Thông tin liên hệ
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <UniversityIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Văn phòng khoa CNTT: E1 - 02.06
                    </p>
                    <p className="text-gray-600 text-sm">
                      Trường Đại học Công nghệ TP.HCM (HUTECH)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <MailIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a
                      href="mailto:contact@uit.edu.vn"
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      khoa.cntt@hutech.edu.vn
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Số điện thoại</p>
                    <a
                      href="tel:+84123456789"
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      (028) 7101 2388
                    </a>
                  </div>
                </div>
              </div>
              {/* <div className="mt-6 bg-white border border-indigo-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm mb-2">Cần hỗ trợ thêm?</p>
                <button className="w-full bg-indigo-100 text-indigo-700 py-2 rounded-md hover:bg-indigo-200 transition-colors">
                  Liên hệ hỗ trợ
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
