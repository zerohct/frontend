import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchDropdownData,
  getEventById,
  uploadEventImage,
  updateEvent,
} from "api/eventsApi";
import { Event, EventType, Semester, AcademicYear } from "types/eventTypes";
import {
  Camera,
  FileText,
  Calendar,
  Users,
  Upload,
  X,
  ArrowLeft,
} from "lucide-react";
import { showToast } from "utils/toast";

interface DropdownData {
  eventTypes: EventType[];
  semesters: Semester[];
  academicYears: AcademicYear[];
}

const UpdateEventForm: React.FC = () => {
    const { eventId } = useParams(); // Lấy eventId từ URL
    console.log(eventId); // id sẽ là "21" trong trường hợp của bạn
    // const [event, setEvent] = useState<Event | null>();
    const [event, setEvent] = useState({
      title: "",
      description: "",
      content: "",
      event_type_id: "",
      semester_id: "",
      academic_year_id: "",
      start_time: "",
      end_time: "",
      site: "",
      image: "",
      is_online: false,
      max_participants: 0,
      registration_deadline: "",
      status: 1,
      
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
    const [isEditing, setIsEditing] = useState(false); // Thêm trạng thái chỉnh sửa

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEvent((prevEvent) => {
        if (!prevEvent) return prevEvent;
        return { ...prevEvent, [name]: value,       
          ...(name === "is_online" && { site: "" }), // Reset site when changing online status
         };
      });
    };

      const [formData, setFormData] = useState<Event>({
        id: "",
        title: "",
        description: "",
        content: "",
        event_type_id: "",
        semester_id: "",
        academic_year_id: "",
        start_time: "",
        end_time: "",
        site: "",
        image: "",
        is_online: false,
        max_participants: 0,
        registration_deadline: "",
        status: 1,
      });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [is_online, setIsOnline] = useState<boolean>(false);

    const handleCheckboxChange = () => {
      const newIsOnline = !is_online;
      setIsOnline(newIsOnline); // Cập nhật trạng thái cục bộ
      if (event) {
        setEvent({
          ...event,
          is_online: newIsOnline,
          title: event.title || "", // Cung cấp giá trị mặc định nếu undefined
          description: event.description || "",
          content: event.content || "",
          start_time: event.start_time || "",
          end_time: event.end_time || "",
          site: event.site || "",
        });
      }
    };

    const handleMaxParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (event) {
        const value = Math.max(0, parseInt(e.target.value) || 0);
    
        setEvent((prevEvent) => {
          if (prevEvent) {
            return {
              ...prevEvent,
              max_participants: value,
            };
          }
          return prevEvent;  // Trả về prevEvent nếu nó là null hoặc undefined
        });
      }
    };
  


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

const validateForm = (): boolean => {
    const requiredFields: (keyof Event)[] = [
      "title",
      "description",
      "start_time",
      "end_time",
      "event_type_id",
      "semester_id",
      "academic_year_id",
      "site",
    ];
    const startTime = new Date(formData.start_time);
    const endTime = new Date(formData.end_time);

    if (endTime <= startTime) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu");
      return false;
    }

    if (is_online) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.site)) {
        alert("Vui lòng nhập đúng định dạng URL cho địa điểm online");
        return false;
      }
    }

    return true;
  };
  
  useEffect(() => {
    if (event && event.image) {

      setImagePreview(event.image); // Hiển thị ảnh hiện tại như preview ban đầu
    }
  }, [event]);// Chỉ theo dõi event, không sử dụng trực tiếp event.image

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("Vui lòng chọn một tệp hình ảnh.");
      return;
    }
    setImageFile(file);
    // Kiểm tra định dạng file
    const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
    if (!validExtensions.includes(file.type)) {
      alert("Chỉ hỗ trợ tải lên các định dạng PNG, JPEG hoặc JPG.");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      try {
        // Upload image và nhận phản hồi từ API
        const response = await uploadEventImage(file);

        // Đảm bảo rằng response.data có chứa base64Image
        const base64Image = response.data?.base64Image;
        if (base64Image) {
          // Cập nhật formData với base64 image
          setFormData((prev) => ({
            ...prev,
            image: base64Image, // Lưu base64 vào formData
          }));
          setImagePreview(base64Image); 
        } else {
          alert("Không nhận được base64 image từ API");
        }
      } catch (error) {
        console.error("Image upload failed", error);
        alert("Tải ảnh thất bại");
      }
    } else {
      alert("Vui lòng chọn một tệp hình ảnh.");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Add a null check for eventId
    if (!eventId) {
      alert("Không tìm thấy ID sự kiện.");
      return;
    }
  
    if (!validateForm()) return;
  
    try {
      // Use the existing event data directly
      const submissionData: Event = {
        ...event, // Spread the entire existing event data
        start_time: event.start_time
          ? new Date(event.start_time).toLocaleString("sv-SE").replace(",", "")
          : "",
        end_time: event.end_time
          ? new Date(event.end_time).toLocaleString("sv-SE").replace(",", "")
          : "",
        registration_deadline: event.registration_deadline
          ? new Date(event.registration_deadline).toLocaleString("sv-SE").replace(",", "")
          : "",
        is_online: (event.is_online ? 1 : 0) as any,
        image: imageFile as any, 
      };  
      // Use the eventId from the URL parameter
      const response = await updateEvent(eventId, submissionData);
      
      // Handle successful update
      showToast({ message: "Cập nhật sự kiện thành công", statusCode: 200 });
      navigate(`/admin/events`);
    } catch (error) {
      console.error(error);
      showToast({ message: "Cập nhật sự kiện thất bại", statusCode: 500 });
    }
  };

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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-indigo-800 mb-4">
            Chỉnh sửa thông tin sự kiện
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center text-indigo-800 mb-6 gap-2">
              <FileText className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Thông tin cơ bản</h3>
            </div>

            <div className="space-y-6">
            <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Tên sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={event.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sự kiện"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={event.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả ngắn gọn về sự kiện"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[120px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 "
                />
              </div>

              <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Nội dung chi tiết
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={event.content}
                  // readOnly
                  onChange={handleInputChange}
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
                  className="block mb-2 font-medium text-gray-700"
                >
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="start_time"
                  required
                  value={event.start_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Thời gian kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  name="end_time"
                  required
                  value={event.end_time}
                  onChange={handleInputChange}
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
                    id="isOnline"
                    checked={event.is_online}
                    onChange={handleCheckboxChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span>{event.is_online ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div>
              <label
                className="block mb-2 font-medium text-gray-700"
              >
                Địa điểm/Link tham gia <span className="text-red-500">*</span>
              </label>
              <input
                // type="text"
                id="site"
                name="site"
                required
                value={event.site}
                onChange={handleInputChange}
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
                  className="block mb-2 font-medium text-gray-700"
                >
                  Số lượng tham gia tối đa
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="max_participants"
                  min="0"
                  value={event.max_participants}
                  onChange={handleMaxParticipantsChange}
                  placeholder="Không giới hạn"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Hạn đăng ký
                </label>
                <input
                  type="datetime-local"
                  id="registration_deadline"
                  name="registration_deadline"
                  value={event.registration_deadline}
                  required
                  onChange={handleInputChange}
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
                  className="block mb-2 font-medium text-gray-700"
                >
                  Loại sự kiện <span className="text-red-500">*</span>
                </label>
                <select
                  id="eventTypeId"
                  name="event_type_id"
                  required
                  value={event?.event_type_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Chọn loại sự kiện</option>
                  {dropdownData?.eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Học kỳ <span className="text-red-500">*</span>
                </label>
                <select
                  id="semesterId"
                  name="semester_id"
                  required
                  value={event?.semester_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Chọn học kỳ</option>
                  {dropdownData?.semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year Dropdown */}
              <div>
                <label
                  className="block mb-2 font-medium text-gray-700"
                >
                  Năm học <span className="text-red-500">*</span>
                </label>
                <select
                  id="academicYearId"
                  name="academic_year_id"
                  required
                  value={event?.academic_year_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Chọn năm học</option>
                  {dropdownData?.academicYears.map((academicYear) => (
                    <option key={academicYear.id} value={academicYear.id}>
                      {academicYear.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mt-6">
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center 
                  ${imagePreview ? "border-indigo-500" : "border-gray-300"} 
                  relative h-72 flex flex-col justify-center items-center`}
                          >
                {!imagePreview ? (
                  <>
                    <Upload className="w-12 h-12 text-indigo-500 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Kéo và thả ảnh vào đây hoặc
                    </p>
                    <label
                      htmlFor="fileInput"
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600"
                    >
                      Chọn ảnh từ máy tính
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null); // Xóa preview hiện tại
                        setFormData((prev) => ({ ...prev, image: "" })); // Xóa ảnh khỏi formData
                      }}
                      // onClick={handleRemoveImage}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              {/* Nút "Chọn ảnh từ máy tính" hoặc "Thay đổi ảnh" */}
              {imagePreview && (
                <label
                  htmlFor="fileInput"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600 mt-4 block text-center"
                >
                  Thay đổi ảnh
                </label>
              )}
              {/* Input file luôn có mặt để chọn ảnh */}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
        
            </div>
            <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventForm;
