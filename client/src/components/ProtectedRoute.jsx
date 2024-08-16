// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  // Verify Token
  useEffect(() => {
    const validateUser = async () => {
      try {
        const verifiedUser = await api.get(
          "/users/verify-token",
          { withCredentials: true }
        );
        const data = verifiedUser;
        console.log(data);
      } catch (error) {
        if (error.response.status != 200) {
          navigate('/login');
        }
      }
    };
    validateUser();
  }, []);

  return children;
};

export default ProtectedRoute;
