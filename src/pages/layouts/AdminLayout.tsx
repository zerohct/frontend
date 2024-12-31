import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "components/sidebar/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Nội dung chính */}
      <div className="flex-1 p-6 ml-72 bg-gray-100 transition-all">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Outlet /> {/* Render các nested routes tại đây */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
