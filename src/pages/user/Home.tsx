import React, { useEffect } from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import EventList from "components/event/client/EventListClient";
import BannerUser from "components/common/BannerUser";
import { isAuthenticated } from "api/authApi";

const Home = () => {
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BannerUser />
      <EventList />
      <Footer />
    </div>
  );
};

export default Home;
