import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomeScreen";
import CardScreen from "./pages/CardScreen";
import StudyScreen from "./pages/StudyScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards/:deckId" element={<CardScreen />} />
        <Route path="/study/:deckId" element={<StudyScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;