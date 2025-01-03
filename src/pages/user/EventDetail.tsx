import React, { useEffect } from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import EventDetail1 from "components/detail/EventDetail";

const EventDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <EventDetail1 />
      <Footer />
    </div>
  );
};

export default EventDetail;
