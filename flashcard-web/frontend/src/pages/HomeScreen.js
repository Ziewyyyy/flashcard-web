import React, { useState, useRef, useEffect } from "react";
import "../css/Home.css";
import "../css/CreateDeck.css";
import { useNavigate } from "react-router-dom";
import { getDecks, createDeck } from "../api/deckApi";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState(""); 
  const menuRef = useRef();
  const navigate = useNavigate();

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
      setShowModal(false);
      setDeckName("");
      await loadDeck();
    } catch (err) {
      console.error("Failed to create deck", err);
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
          <button className="btn">Add</button>
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
                <tr key={deck.id}>
                  <td>{deck.name}</td>
                  <td>0</td>
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
            onClick={() => setShowModal(true)}
          >
            Create Deck
          </button>
          <button className="btn">Delete Deck</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
              <button onClick={() => setShowModal(false)}>
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
    </>
  );
}

export default Home;