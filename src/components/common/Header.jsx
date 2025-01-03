import React, { useState, useEffect } from "react";
import { UserCircle, LogOut, User, ChevronDown, ChevronUp } from "lucide-react";

// import { logoutApi, getUserInfo, isAuthenticated } from "../../api/authApi";

const HutechLogo = ["/assets/images/logo/logo.png"];

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // useEffect(() => {
  //   const userInfo = getUserInfo();
  //   if (isAuthenticated() && userInfo) {
  //     setIsLoggedIn(true);
  //     setUsername(userInfo.nickname || userInfo.username || "User");
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // const handleLogout = () => {
  //   logoutApi(); // Use the logout function from authApi
  // };

  return (
    <header className="bg-gray-300 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-2 py flex justify-between items-center">
        {/* Logo Section */}
        <a href="/" className="flex items-center space-x-3">
          <img
            src={HutechLogo}
            alt="Hutech Logo"
            className="h-14 w-auto object-contain"
          />
          <h1 className=" text-xl font-serif font-bold">Hutech Events</h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {[
            { label: "Trang chủ", href: "/" },
            { label: "Sự kiện", href: "/events" },
            { label: "Liên hệ", href: "/contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className=" hover:text-white transition-colors duration-300 font-medium text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <a
                href="/login"
                className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
              >
                Đăng nhập
              </a>
              <a
                href="https://itcoder.hutech.edu.vn/site/signup"
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg font-medium shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
              >
                Đăng ký
              </a>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg font-medium shadow-md transition-all duration-300"
              >
                <span className="truncate max-w-[200px]">{username}</span>
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="py-1">
                    <a
                      href="/admin"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <User size={16} className="mr-3" />
                      Admin page
                    </a>
                    {/* <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-left"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
