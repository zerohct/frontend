import React from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import EventList1 from "components/List/EvenList1";

const Event = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <EventList1 />
      <Footer />
    </div>
  );
};

export default Event;
