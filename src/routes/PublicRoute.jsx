import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // If logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, render the login/register page
  return children;
};

export default PublicRoute;
