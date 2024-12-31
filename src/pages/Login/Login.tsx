// src/pages/Login/Login.tsx
import React from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import Login from "components/auth/Login";

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Login />
      <Footer />
    </div>
  );
};

export default LoginPage;
