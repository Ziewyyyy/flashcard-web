  import React, { useState, useRef, useEffect } from "react";
  import "../css/Home.css";
  import "../css/CreateDeck.css";
  import { useNavigate } from "react-router-dom";
  import { getDecks, createDeck } from "../api/deckApi";
  import { createCard } from "../api/cardApi";

  function Home() {
    const [showMenu, setShowMenu] = useState(false);
    const [showModalDeck, setShowModalDeck] = useState(false);
    const [showModalCard, setShowModalCard] = useState(false);
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
          <div className="top-buttons">
            <button className="btn">Decks</button>
            <button
              className="btn"
              disabled={!selectedDeckId}
              onClick={() => setShowModalCard(true)}
            >
              Add
            </button>
            <button className="btn">Browse</button>
            <button className="btn">Stats</button>
            <button className="btn">Sync</button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Deck</th>
                  <th>Amount</th>
                  <th>Learn</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {decks.map((deck) => (
                <tr
                  key={deck.id}
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={selectedDeckId === deck.id ? "selected-row" : ""}
                >
                <td>{deck.name}</td>
                <td>{deck.cardCount}</td>
                <td>0</td>
                <td>
                  <button>Study</button>
                </td>
              </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Bottom buttons */}
          <div className="bottom-buttons">
            <button
              className="btn"
              onClick={() => setShowModalDeck(true)}
            >
              Create Deck
            </button>
            <button className="btn">Delete Deck</button>
          </div>
        </div>

        {/* Modal */}
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
