import { useState, useEffect } from "react";
import { login, googleLogin } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {

    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API}/api/decks`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          navigate("/");
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    };

    checkToken();
  }, [navigate, API]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      console.log("LOGIN RESPONSE:", res);
      localStorage.setItem("token", res.data.token);
      toast.success("Login success!", {
        onClose: () => navigate("/")
      });
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      localStorage.setItem("token", res.data.token);
      toast.success("Google login success!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error("Google login failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };


  return (
    <>

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-800">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6">
            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-2 border-gray-700 px-3 py-2 text-black font-medium"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-2 border-gray-700 px-3 py-2 text-black font-medium"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-400"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="flex-1 rounded-md bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-400"
                >
                  Register
                </button>
              </div>

          </form>
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex justify-center" style={{ minWidth: "300px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="300"
            />
          </div>
        </div>
      </div>
    </>
  );
}