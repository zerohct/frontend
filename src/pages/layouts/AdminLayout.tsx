import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "components/sidebar/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
