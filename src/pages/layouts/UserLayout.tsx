import React from "react";
import { Outlet } from "react-router-dom";
// import Header from "../components/Header";

const UserLayout = () => (
  <div>
    {/* <Header /> */}
    <main>
      <Outlet />
    </main>
  </div>
);

export default UserLayout;
