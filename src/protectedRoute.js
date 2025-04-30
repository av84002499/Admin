import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or use context/auth state
  if(!token){
    // alert("Please Login...");
    Swal.fire({
            icon: 'error',
            title: 'Please login to view this page!',
            showConfirmButton: false,
            timer: 2000,
          });
  }
  return token ? children : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;