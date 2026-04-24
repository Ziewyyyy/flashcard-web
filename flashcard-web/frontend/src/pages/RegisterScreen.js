import { useState } from "react";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Confirm password does not match!");
      return;
    }
    try {
      const res = await register({ username, password });
      toast.success("Register success!");

      navigate("/login");
    } catch (err) {
      toast.error("Register failed: " + err.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-800">
          Register a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6">
          <form onSubmit={handleRegister} className="space-y-6">

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

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-2 border-gray-700 px-3 py-2 text-black font-medium"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-400"
              >
                Register
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}