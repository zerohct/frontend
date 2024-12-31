import React, { useEffect, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import { EventType } from "types/eventTypes";
import CreateEventTypeForm from './CreateEventTypeForm';
import { 
  getAllEventTypes, 
  createEventType, 
  updateEventType, 
  deleteEventType 
} from 'api/eventTypeApi';
import { showToast } from "utils/toast";
import { useNavigate } from "react-router-dom";

const EventTypeList: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const navigate = useNavigate();

  const fetchEventTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEventTypes();
      console.log("Fetched Event Types:", response.data);
      setEventTypes(response.data); // Cập nhật danh sách
      if (response.statusCode === 200 && response.data) {
        setEventTypes(response.data);
      } else {
        setError("Failed to fetch event types");
      }
    } catch (err) {
      setError("Failed to fetch event types. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const handleSaveNewEventType = async (name: string) => {
    setLoading(true);
    try {
      // Check for duplicates
      if (eventTypes.some((eventType) => eventType.name.toLowerCase() === name.toLowerCase())) {
        showToast({
          statusCode: 400,
          message: "Loại sự kiện đã tồn tại"
        });
        return;
      }
  
      const response = await createEventType(name);
      console.log('Create response:', response); // Kiểm tra phản hồi từ API
      if (response?.statusCode === 201 && response.data) {
              // Cập nhật danh sách loại sự kiện ngay lập tức
        // setEventTypes((prev) => [...prev, response.data]);
        await fetchEventTypes(); // Fetch lại danh sách sau khi tạo
        setIsCreating(false); // Thoát popup
              // Đặt lại trang hiện tại (nếu cần)
        setCurrentPage(Math.ceil((eventTypes.length + 1) / eventsPerPage));
        setIsCreating(false); // Thoát popup
        showToast({
          statusCode: 201,
          message: "Tạo loại sự kiện thành công",
        });
      } else if (response?.statusCode && response?.statusCode !== 201) {
        showToast({
          statusCode: response.statusCode,
          message: response.message || "Không thể tạo loại sự kiện",
        });
      }
    } catch (error) {
      console.error("Error creating event type:", error);
      showToast({
        statusCode: 500,
        message: "Đã xảy ra lỗi khi tạo loại sự kiện"
      });
    } finally {
      setLoading(false);
      setIsCreating(false); // Thoát popup
    }
  };
  

  const handleEdit = async (id: string, newName: string) => {
    try {
      const response = await updateEventType(id, newName);
      if (response.statusCode === 200 && response.data) {
        setEventTypes(prev => 
          prev.map(type => type.id === id ? response.data : type)
        );
        showToast({
          statusCode: 200,
          message: "Cập nhật loại sự kiện thành công"
        });
      }
    } catch (error) {
      console.error("Error updating event type:", error);
      showToast({
        statusCode: 500,
        message: "Không thể cập nhật loại sự kiện"
      });
    }
  };


  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại sự kiện này?")) {
      return;
    }
  
    try {
      const response = await deleteEventType(id);
      console.log('Delete response:', response); // Kiểm tra phản hồi từ API
      if (response && response.statusCode && response.statusCode === 204) {
        // Sau khi xóa, reload lại danh sách loại sự kiện
        await fetchEventTypes(); // Fetch lại danh sách sau khi xóa
        // const updatedEventTypes = eventTypes.filter(type => type.id !== id);
        // setEventTypes(updatedEventTypes);
        const newTotalPages = Math.ceil(eventTypes.length / eventsPerPage);
        // const newTotalPages = Math.ceil(updatedEventTypes.length / eventsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(Math.max(1, newTotalPages)); 
        }
        showToast({
          statusCode: 200,
          message: "Xóa loại sự kiện thành công"
        });
      }else {
        console.log("Xóa thất bại, mã trạng thái:", response?.statusCode);
        showToast({
          statusCode: 500,
          message: "Không thể xóa loại sự kiện"
        });
      }
    } catch (error) {
      console.error("Error deleting event type:", error);
      showToast({
        statusCode: 500,
        message: "Không thể xóa loại sự kiện"
      });
    }
  };
  

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  if (loading && eventTypes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(eventTypes.length / eventsPerPage);
  const paginatedEventTypes = eventTypes.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 mt-2">
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight text-indigo-800">
            Quản lý Loại sự kiện
          </h1>
        </header>
      </div>

      <section className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 mt-10">
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-white border-b">
          <h2 className="text-2xl font-bold text-slate-800">
            Danh sách loại sự kiện
          </h2>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="mr-2 h-5 w-5" /> Thêm loại sự kiện
          </button>
        </div>

        {isCreating && (
          <CreateEventTypeForm
            onSave={handleSaveNewEventType}
            onCancel={handleCancelCreate}
          />
        )}

        {error && (
          <div className="p-4 text-red-600 bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}

        {paginatedEventTypes.length === 0 ? (
          <div className="text-center py-10 text-slate-600">
            Không có loại sự kiện nào được tìm thấy
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Tên loại sự kiện
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEventTypes.map((type) => (
                    <tr key={type.id} className="border-b hover:bg-indigo-50 transition-colors group">
                      <td className="px-6 py-4 font-medium group-hover:text-indigo-700 transition-colors align-middle">
                        {type.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(type.id, type.name)}
                            className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-100"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-white border-t">
              <span className="text-sm text-slate-600">
                Hiển thị {(currentPage - 1) * eventsPerPage + 1} -{" "}
                {Math.min(currentPage * eventsPerPage, eventTypes.length)} trên tổng số{" "}
                {eventTypes.length} loại sự kiện
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white text-slate-600 rounded-lg border border-slate-300 hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white text-slate-600 rounded-lg border border-slate-300 hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default EventTypeList;