import React, { useEffect } from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import Event from "components/event/client/EventDetail";
import { isAuthenticated } from "api/authApi";

const EventDetail = () => {
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <Event />
      <Footer />
    </div>
  );
};

export default EventDetail;
