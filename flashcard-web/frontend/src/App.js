import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomeScreen";
import CardScreen from "./pages/CardScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards/:deckId" element={<CardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;