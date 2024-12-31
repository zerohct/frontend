import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

interface CreateEventTypeFormProps {
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}

const CreateEventTypeForm: React.FC<CreateEventTypeFormProps> = ({ onSave, onCancel }) => {
  const [newEventTypeName, setNewEventTypeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newEventTypeName.trim();

    if (!trimmedName) {
      setError('Tên loại sự kiện không được để trống');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(trimmedName);
      setNewEventTypeName('');
      onCancel(); // Đóng popup ngay khi lưu thành công
      navigate(`/admin/event-types`);
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo loại sự kiện');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90vw]">
        <h2 className="text-2xl font-bold mb-5 text-indigo-800">Thêm loại sự kiện</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={newEventTypeName}
              onChange={(e) => setNewEventTypeName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl 
                        focus:outline-none focus:border-indigo-500 focus:ring-2 
                        focus:ring-indigo-100 transition-colors"
              placeholder="Nhập tên loại sự kiện"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                        hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
                        hover:bg-indigo-700 transition-colors disabled:opacity-50 
                        flex items-center"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                'Lưu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventTypeForm;