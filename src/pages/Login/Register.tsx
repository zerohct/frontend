// src/pages/Login/Login.tsx
import React from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import Register from "components/auth/Register";

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Register />
      <Footer />
    </div>
  );
};

export default LoginPage;
