import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <ToastContainer />
      <AppRoutes />
      <AdminRoutes />
    </Router>
  );
}

export default App;
