import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomeScreen";
import CardScreen from "./pages/CardScreen";
import StudyScreen from "./pages/StudyScreen";
import Login from "./pages/LoginScreen";
import Register from "./pages/RegisterScreen";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/" element={
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;