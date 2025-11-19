import React from 'react'
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  // Check if user is logged in
  // This example uses a token in localStorage. Adjust if you use Redux or Context.
  const token = localStorage.getItem("token");

  if (!token) {
    // If not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  // If logged in, render the children (protected page)
  return children;
  
};

export default ProtectedRoute
