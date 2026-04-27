import React, { useState, useRef, useEffect } from "react";
import "../css/Home.css";
import "../css/CreateDeck.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { getDecks, createDeck, deleteDeck } from "../api/deckApi";
import { createCard } from "../api/cardApi";
import { startStudy } from "../api/studyApi";
import { useStudy } from "../context/StudyContext";
import { exportDecks } from "../api/deckApi";
import { importDecks } from "../api/deckApi";
import { toast } from "react-toastify";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModalDeck, setShowModalDeck] = useState(false);
  const [showModalCard, setShowModalCard] = useState(false);
  const [showModalStudy, setShowModalStudy] = useState(false);
  const [showModalStats, setShowModalStats] = useState(false);
  const { decks, setDecks } = useStudy();
  const [deckName, setDeckName] = useState("");
  const menuRef = useRef();
  const navigate = useNavigate();
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isShuffle, setIsShuffle] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadDeck();
  }, []);

  const loadDeck = async () => {
    try {
      const res = await getDecks();
      console.log("GET decks:", res.data);
      setDecks(res.data);
    } catch (err) {
      console.error("Failed to load decks", err);
    }
  };

  const handleCreateDeck = async () => {
    if (!deckName.trim()) return;
    try {
      await createDeck({ name: deckName });
      setShowModalDeck(false);
      setDeckName("");
      await loadDeck();
    } catch (err) {
      console.error("Failed to create deck", err);
    }
  }

  const deleteDeckById = async (id) => {
    if (!id) return;
    try {
      await deleteDeck(id);
      await loadDeck();
    } catch (err) {
      console.error("Failed to delete deck", err);
    }
  }

  const handleCreateCard = async () => {
    if (!front.trim() || !back.trim() || !selectedDeckId) return;
    try {
      await createCard({ deck: { id: selectedDeckId }, front, back });
      setShowModalCard(false);
      setFront("");
      setBack("");
      await loadDeck();
      console.log("Created card in deck:", selectedDeckId);
    } catch (err) {
      console.error("Failed to create card", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleStartStudy = async () => {
    try {
      const res = await startStudy(selectedDeck.id);
      localStorage.setItem("sessionId", res.data.id);
    } catch (err) {
      console.error("Failed to start study session", err);
    }
  }

  const handleExport = async () => {
    try {
      const res = await exportDecks();

      const blob = new Blob(
        [JSON.stringify(res.data, null, 2)],
        { type: "application/json" }
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const username = res.data.user || "flashcards";
      a.download = `${username}.json`;
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      await importDecks(json);

      toast.success("Import success!");

      await loadDeck();

    } catch (err) {
      console.error("Import failed", err);
      toast.error("Import failed!");
    }
  };

  const handleShuffleDeck = () => {
    const newState = !isShuffle;
    setIsShuffle(newState);

    if (newState) {
      sessionStorage.setItem("shuffle", "true");
      toast.info("Shuffle ON");
    } else {
      sessionStorage.removeItem("shuffle");
      toast.info("Shuffle OFF");
    }
  };

  const handleReverse = () => {
    const current = sessionStorage.getItem("reverse");

    if (current) {
      sessionStorage.removeItem("reverse");
      toast.info("Reverse OFF");
    } else {
      sessionStorage.setItem("reverse", "true");
      toast.info("Reverse ON");
    }
  };

  const selectedDeck = decks.find(d => d.id === selectedDeckId);
  return (
    <>
      <div className="app">
        <div className="topbar flex justify-between items-center px-4">
          <div className="menu-left flex gap-4 items-center">
            <div className="file-menu" ref={menuRef}>
              <span onClick={() => setShowMenu(!showMenu)}>File</span>

              {showMenu && (
                <div className="dropdown">
                  <div className="item">
                    <label className="import-btn">
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        hidden
                      />
                    </label>
                  </div>
                  <div
                    className="item"
                    onClick={handleExport}
                  >
                    Export
                  </div>
                </div>
              )}
            </div>

            <span>Settings</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>

        </div>

        <div className="inline-flex mt-4 justify-center">
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-l-full">Decks</button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            disabled={!selectedDeckId}
            onClick={() => setShowModalCard(true)}
          >
            Add
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            disabled={!selectedDeckId}
            onClick={() => navigate(`/cards/${selectedDeckId}`)}
          >
            Browse
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            disabled={!selectedDeckId}
            onClick={() => setShowModalStats(true)}
          >
            Stats
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-r-full">Sync</button>
        </div>

        {/* Table */}
        <div className="flex justify-center mt-6">
          <div className="w-[800px] bg-white rounded-xl shadow p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Deck</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Remaining</th>
                  <th className="px-4 py-2">Learn</th>
                </tr>
              </thead>
              <tbody>
                {decks.map((deck) => (
                  <tr
                    key={deck.id}
                    className={`cursor-pointer ${selectedDeckId === deck.id ? "selected-row" : ""
                      }`}
                  >
                    <td
                      className="border px-4 py-2 text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedDeckId(deck.id);
                        setShowModalStudy(true);
                      }}
                    >
                      {deck.name}
                    </td>

                    <td
                      className="border px-4 py-2 text-blue-600 hover:underline"
                    >
                      {deck.cardCount + deck.learnedCount}
                    </td>

                    <td
                      className="border px-4 py-2 text-blue-600 hover:underline"
                      onClick={() => setSelectedDeckId(deck.id)}
                    >
                      {deck.cardCount}
                    </td>

                    <td
                      className="border px-4 py-2 text-center align-middle text-blue-600 hover:underline"
                      onClick={() => setSelectedDeckId(deck.id)}
                    >
                      {deck.learnedCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
            onClick={() => setShowModalDeck(true)}
          >
            Create Deck
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
            onClick={() => deleteDeckById(selectedDeckId)}
          >
            Delete Deck
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModalStudy && selectedDeck && (
        <div className="modal-overlay">
          <div className="modal study-modal">
            <div className="study-left">
              <h2>{selectedDeck.name}
                <p>Cards: {selectedDeck.cardCount}</p>
                <button className="shuffle-btn" onClick={handleShuffleDeck}>
                  Shuffle
                </button>
                <button className="shuffle-btn" onClick={handleReverse}>
                  Reverse
                </button>
              </h2>
            </div>

            <div className="study-right">
              <button
                className="study-btn"
                onClick={async () => {
                  setShowModalStudy(false);
                  await handleStartStudy();
                  navigate(`/study/${selectedDeck.id}`);
                }}
              >
                Study
              </button>
              <button
                className="typing-btn"
                onClick={async () => {
                  setShowModalStudy(false);
                  await handleStartStudy();
                  navigate(`/typing/${selectedDeck.id}`);
                }}
              >
                Typing
              </button>
              <button
                onClick={() => {
                  setShowModalStudy(false);
                  sessionStorage.removeItem("shuffle");
                  sessionStorage.removeItem("reverse");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalStats && selectedDeck && (() => {
        const learned = selectedDeck.learnedCount;
        const total = selectedDeck.cardCount + selectedDeck.learnedCount;
        const notLearned = total - learned;
        const percent = total ? Math.round((learned / total) * 100) : 0;

        const data = [
          { name: "Learned", value: learned },
          { name: "Remaining", value: notLearned },
        ];

        return (
          <div className="modal-overlay">
            <div className="modal stats-modal text-center">

              <h2 className="text-xl font-bold mb-4">
                {selectedDeck.name} - Stats
              </h2>

              <div className="flex justify-center">
                <PieChart width={250} height={250}>
                  <Pie
                    data={data}
                    dataKey="value"
                    outerRadius={100}

                    labelLine={false}
                  >
                    <Cell fill="#4CAF50" />
                    <Cell fill="#ccc" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              <div className="mt-4">
                <p>Progress: <b>{percent}%</b></p>
                <p>Learned: {learned} / {total}</p>
                <p>Study time: 120 minutes</p>
              </div>

              <button
                className="mt-4 px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModalStats(false)}
              >
                Close
              </button>

            </div>
          </div>
        );
      })()}

      {showModalDeck && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Deck</h3>
            <input
              type="text"
              placeholder="Deck name"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowModalDeck(false)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCreateDeck();
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalCard && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Card</h3>

            <input
              type="text"
              placeholder="Front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />

            <input
              type="text"
              placeholder="Back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setShowModalCard(false)}>
                Cancel
              </button>

              <button onClick={handleCreateCard}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>


  );
}

export default Home;
