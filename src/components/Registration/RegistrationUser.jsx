import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Filter, RefreshCcw, ArrowLeft, Scan } from "lucide-react";
import { getAllRegistrationUsers } from "api/eventsApi";

const RegistrationUser = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    mssv: "",
    email:"",
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [eventTitle, setEventTitle] = useState("");

  // Apply filters based on user input
  const applyFilters = () => {
    const filtered = registrations.filter((item) => {
      const nameMatch = item.nickname
        ?.toLowerCase()
        .includes(search.name.toLowerCase());
      const mssvMatch = item.username
        ?.toLowerCase()
        .includes(search.mssv.toLowerCase());
      const emailMatch = item.email
        ?.toLowerCase()
        .includes(search.email.toLowerCase());  
      return nameMatch && mssvMatch && emailMatch;
    });

    setFilteredRegistrations(filtered);
  };

  // Reset filters to initial state
  const handleReset = () => {
    setSearch({
      name: "",
      mssv: "",
      email: "",
    });
    setFilteredRegistrations(registrations);
  };

  // Fetch registrations from API when the component is mounted
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (eventId) {
        try {
          const response = await getAllRegistrationUsers(eventId);
  
          // Directly use response.data which contains the user list
          const registrationData = response.data || [];
  
          setRegistrations(registrationData);
          setFilteredRegistrations(registrationData);
  
          // Update the table rendering to match the new structure
          const titleFromState = location.state?.eventTitle || "Sự kiện";
          setEventTitle(titleFromState);
        } catch (error) {
          console.error("Error fetching registrations:", error);
          setRegistrations([]);
          setFilteredRegistrations([]);
        }
      }
    };
  
    fetchRegistrations();
  }, [eventId]);

  // Apply filters whenever search values change
  useEffect(() => {
    applyFilters();
  }, [search]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-6xl mx-auto">
        <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mb-4 hover:bg-blue-200 transition"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
      </button>
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-800">
        Quản Lý Đăng Ký Sự Kiện 
      </h1>
      <h3 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        {eventTitle}
      </h3>

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
            placeholder="Tìm theo email"
            value={search.email}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, email: e.target.value }))
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
          <button
            onClick={() => navigate(`/admin/events/${eventId}/poster`)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <Scan className="mr-2 w-4 h-4" /> Xem Poster
          </button>
        </div>
      </div>

      {/* Registration Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              {["STT", "Tên", "MSSV","Email", "Thời Gian Đăng Ký"].map(
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
                <tr key={item.user_id} className="border-b hover:bg-blue-50 transition">
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3">{item.nickname || "N/A"}</td>
                    <td className="px-4 py-3">{item.username || "N/A"}</td>
                    <td className="px-4 py-3">{item.email || "N/A"}</td>
                    <td className="px-4 py-3">{item.registration_time || "N/A"}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                    Chưa có sinh viên đăng ký.
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

export default RegistrationUser;
