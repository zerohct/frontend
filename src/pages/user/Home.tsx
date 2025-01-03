import React from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import Banner from "components/common/BannerUser";
import EventList from "components/List/EventList";
import CompanyList from "components/List/CompanyList";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Banner />
      <EventList />
      <CompanyList />
      <Footer />
    </div>
  );
};

export default Home;
