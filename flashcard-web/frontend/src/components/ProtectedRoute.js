import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        await axiosClient.get("/api/decks");
        setIsValid(true); 
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isValid === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;