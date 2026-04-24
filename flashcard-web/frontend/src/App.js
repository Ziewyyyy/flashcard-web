import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomeScreen";
import CardScreen from "./pages/CardScreen";
import StudyScreen from "./pages/StudyScreen";
import Login from "./pages/LoginScreen";
import Register from "./pages/RegisterScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import { StudyProvider } from "./context/StudyContext";
import TypingScreen from "./pages/TypingScreen";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <StudyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cards/:deckId"
            element={
              <ProtectedRoute>
                <CardScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/study/:deckId"
            element={
              <ProtectedRoute>
                <StudyScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/typing/:deckId"
            element={
              <ProtectedRoute>
                <TypingScreen />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </StudyProvider>
  );
}

export default App;