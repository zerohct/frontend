import React, { useState, useEffect } from "react";
import { Filter, RefreshCcw } from "lucide-react";
import { getAllRegistrations } from "api/eventsApi";

const RegistrationTable = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    mssv: "",
    event: "",
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Apply filters based on user input
  const applyFilters = () => {
    const filtered = registrations.filter((item) => {
      const nameMatch = item.user?.nickname
        ?.toLowerCase()
        .includes(search.name.toLowerCase());
      const mssvMatch = item.user?.username
        ?.toLowerCase()
        .includes(search.mssv.toLowerCase());
      const eventMatch = item.event?.title
        ?.toLowerCase()
        .includes(search.event.toLowerCase());

      return nameMatch && mssvMatch && eventMatch;
    });

    setFilteredRegistrations(filtered);
  };

  // Reset filters to initial state
  const handleReset = () => {
    setSearch({
      name: "",
      mssv: "",
      event: "",
    });
    setFilteredRegistrations(registrations);
  };

  // Fetch registrations from API when the component is mounted
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await getAllRegistrations();
        setRegistrations(response.data || []);
        setFilteredRegistrations(response.data || []);
      } catch (error) {
        console.error("Error fetching registrations:", error.message);
        setRegistrations([]);
        setFilteredRegistrations([]);
      }
    };

    fetchRegistrations();
  }, []);

  // Apply filters whenever search values change
  useEffect(() => {
    applyFilters();
  }, [search]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Quản Lý Đăng Ký Sự Kiện
      </h1>

      {/* Advanced Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <Filter className="mr-2 text-blue-500" />
            Bộ Lọc
          </h2>
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {isFilterExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
            isFilterExpanded ? "block" : "hidden"
          }`}
        >
          <input
            type="text"
            placeholder="Tìm theo tên"
            value={search.name}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 transition"
          />
          <input
            type="text"
            placeholder="Tìm theo MSSV"
            value={search.mssv}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, mssv: e.target.value }))
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 transition"
          />
          <input
            type="text"
            placeholder="Tìm theo sự kiện"
            value={search.event}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, event: e.target.value }))
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>

        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCcw className="mr-2 w-4 h-4" /> Đặt lại
          </button>
        </div>
      </div>

      {/* Registration Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              {["STT", "Tên", "MSSV", "Sự Kiện", "Thời Gian Đăng Ký"].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3">{item.user?.nickname || "N/A"}</td>
                  <td className="px-4 py-3">{item.user?.username || "N/A"}</td>
                  <td className="px-4 py-3">{item.event?.title || "N/A"}</td>
                  <td className="px-4 py-3">
                    {item.registration_time || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không tìm thấy dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Result Summary */}
        <div className="mt-4 text-right text-gray-600">
          Tổng số kết quả: {filteredRegistrations.length}
        </div>
      </div>
    </div>
  );
};

export default RegistrationTable;
