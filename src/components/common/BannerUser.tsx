import React, { useState, useEffect } from "react";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UniversityEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    "/assets/images/banner/image1.png",
    "/assets/images/banner/image2.jpg",
    "/assets/images/banner/image3.jpg",
    "/assets/images/banner/images.jpg",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Hero Section with Animated Background */}
      <section className="relative h-[500px] overflow-hidden flex items-center justify-center text-white text-center">
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              backgroundSize: "cover",
            }}
          >
            <div className="bg-black/40 absolute inset-0 z-0"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-4 drop-shadow-lg"
          >
            Discover Amazing University Events
          </motion.h2>

          {/* Search Bar with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center items-center mb-6"
          >
            <input
              type="text"
              placeholder="Search for events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-lg px-4 py-2 border text-black border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg flex items-center transition-all duration-300 transform hover:scale-105">
              <Search className="mr-2" size={20} />
              Search
            </button>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            href="#events"
            className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-medium inline-block transition-all duration-300 transform hover:scale-105 group"
          >
            <Calendar className="inline-block mr-2" size={24} />
            Explore Events
            <ChevronRight
              className="inline-block ml-2 group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </motion.a>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to University Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Stay updated with the latest university events, webinars, and tech
            conferences.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default UniversityEvents;
