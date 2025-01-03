import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "pages/user/Home";
import Login from "pages/Login/Login";
// import EventDetail from "pages/user/EventDetail";
import Contact from "pages/user/Contact";
import Register from "pages/Login/Register";
import EventList1 from "pages/user/Event";
import AdminEventList from "components/List/EventListAdmin";
import EventDetail from "pages/user/EventDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/events" element={<EventList1 />} />
      {/* <Route path="/create" element={<CreateEventForm />} /> */}
      <Route path="/event/:id" element={<EventDetail />} />
    </Routes>
  );
};

export default AppRoutes;
