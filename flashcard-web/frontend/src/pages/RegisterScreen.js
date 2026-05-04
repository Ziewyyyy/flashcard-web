import { useState } from "react";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { translations } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];


  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t.passwordNotMatch);
      return;
    }
    try {
      const res = await register({ username, password });
      toast.success(t.registerSuccess);

      navigate("/login");
    } catch (err) {
      toast.error(t.registerFailed + ": " + err.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-800">
          {t.registerTitle}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6">
          <form onSubmit={handleRegister} className="space-y-6">

            <div>
              <input
                type="text"
                placeholder={t.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-2 border-gray-700 px-3 py-2 text-black font-medium"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-2 border-gray-700 px-3 py-2 text-black font-medium"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder={t.confirmPassword}
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
                {t.register}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}