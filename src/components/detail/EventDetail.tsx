import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventApi } from "api/eventsApi";
import { eventRegistrationApi } from "api/eventRegistrationApi";
import {
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  MailIcon,
  UniversityIcon,
} from "lucide-react";
import { Event, EventStatus } from "types/eventTypes";
import ImageDisplay from "components/common/ImageDisplay";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      try {
        if (!id) {
          setError("ID sự kiện không tồn tại");
          return;
        }

        const eventData = await eventApi.getById(id);
        setEvent(eventData);

        const registrations = await eventRegistrationApi.getByEventId(id);
        setIsRegistered(registrations.length > 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải thông tin sự kiện"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleGoBack = () => navigate(-1);

  const handleToggleRegistration = async () => {
    if (!id || isToggling || !event) return;

    if (
      event.status !== EventStatus.SắpDiễnRa ||
      event.currentParticipants >= event.maxParticipants ||
      new Date(event.registrationDeadline) < new Date()
    ) {
      alert("Không thể đăng ký sự kiện này");
      return;
    }

    setIsToggling(true);
    try {
      await eventRegistrationApi.toggleRegistration(id);
      setIsRegistered(!isRegistered);
      alert(isRegistered ? "Hủy đăng ký thành công!" : "Đăng ký thành công!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Lỗi xử lý đăng ký");
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600">Đang tải thông tin sự kiện...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div className="text-center">
          <p>{error || "Không tìm thấy sự kiện"}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-10 mb-10">
        {/* Thanh điều hướng mới */}
        <div className="h-10 bg-gray-50 flex items-center px-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-10 h-7 mr-1" />
          </button>
        </div>

        <div className="relative">
          <ImageDisplay
            base64Image={event.image || "/assets/images/default-event.jpg"}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white text-center px-4">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Chi tiết sự kiện
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>{event.location || "Địa điểm chưa xác định"}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Mô tả
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {event.description || "Không có mô tả chi tiết."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Thông tin đăng ký
              </h3>
              <div className="space-y-3">
                <p className="flex justify-between text-gray-600">
                  <span>Hình Thức:</span>
                  <span className="font-medium">Trực tiếp</span>
                </p>

                <p className="flex justify-between text-gray-600">
                  <span>Hạn đăng ký:</span>
                  <span className="font-medium">
                    {formatDate(event.registrationDeadline)}
                  </span>
                </p>
                <button
                  onClick={handleToggleRegistration}
                  disabled={
                    isToggling ||
                    event.status !== EventStatus.SắpDiễnRa ||
                    event.currentParticipants >= event.maxParticipants ||
                    new Date(event.registrationDeadline) < new Date()
                  }
                  className={`w-full py-2 rounded-lg transition-colors ${
                    isRegistered
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isToggling
                    ? "Đang xử lý..."
                    : isRegistered
                      ? "Hủy đăng ký"
                      : "Đăng ký tham gia"}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-gray-300 rounded-lg p-6 border border-indigo-100">
              <h2 className="text-2xl font-semibold  text-gray-100 mb-4  text-center">
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
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Giờ làm việc</p>
                    <p className="text-gray-600 text-sm">07:30 am - 16:30 pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
