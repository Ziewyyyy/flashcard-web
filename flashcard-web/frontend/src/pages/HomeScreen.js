  import React, { useState, useRef, useEffect } from "react";
  import "../css/Home.css";
  import "../css/CreateDeck.css";
  import { useNavigate } from "react-router-dom";
  import { getDecks, createDeck, deleteDeck } from "../api/deckApi";
  import { createCard } from "../api/cardApi";

  function Home() {
    const [showMenu, setShowMenu] = useState(false);
    const [showModalDeck, setShowModalDeck] = useState(false);
    const [showModalCard, setShowModalCard] = useState(false);
    const [showModalStudy, setShowModalStudy] = useState(false);
    const [decks, setDecks] = useState([]);
    const [deckName, setDeckName] = useState(""); 
    const menuRef = useRef();
    const navigate = useNavigate();
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

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
    const selectedDeck = decks.find(d => d.id === selectedDeckId);
    return (
      <>
        <div className="app">
          {/* Top menu */}
          <div className="topbar">
            <div className="menu-left">
              <div className="file-menu" ref={menuRef}>
                <span onClick={() => setShowMenu(!showMenu)}>File</span>

                {showMenu && (
                  <div className="dropdown">
                    <div className="item">Import</div>
                    <div className="item">Export</div>
                  </div>
                )}
              </div>

              <span>Settings</span>
            </div>
          </div>

          {/* Navigation */}
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
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Stats</button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-r-full">Sync</button>
          </div>

          {/* Table */}
        <div className="flex justify-center mt-6">
          <div className="w-[800px] bg-white rounded-xl shadow p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Deck</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Learn</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {decks.map((deck) => (
                <tr
                  key={deck.id}
                  className={`cursor-pointer ${
                    selectedDeckId === deck.id ? "selected-row" : ""
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
                    className="border px-4 py-2"
                    onClick={() => setSelectedDeckId(deck.id)}
                  >
                    {deck.cardCount}
                  </td>

                  <td
                    className="border px-4 py-2"
                    onClick={() => setSelectedDeckId(deck.id)}
                  >
                    0
                  </td>

                  <td className="border px-4 py-2">
                    <button>Study</button>
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
        {showModalStudy && selectedDeck &&(
          <div className="modal-overlay">
            <div className="modal study-modal">
              <div className="study-left">
                <h2>{selectedDeck.name}
                  <p>Cards: {selectedDeck.cardCount}</p>
                </h2>
              </div>

              <div className="study-right">
                <button
                  className="study-btn"
                  onClick={() => {
                  setShowModalStudy(false);
                  navigate(`/study/${selectedDeck.id}`);
                  }}
                >
                 Study
                </button>
                <button onClick={() => setShowModalStudy(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
