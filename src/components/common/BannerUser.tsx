import React, { useState, useEffect } from "react";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Banner = () => {
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
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
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
    </section>
  );
};

export default Banner;
