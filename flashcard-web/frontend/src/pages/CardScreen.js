import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../css/Home.css";
import "../css/CreateDeck.css";
import "../css/Card.css";
import { getCards, updateCard, deleteCard } from "../api/cardApi";
import { getDeckById } from "../api/deckApi";
import { resetAllCards } from "../api/cardApi";
import { useNavigate } from "react-router-dom";


function CardScreen() {
  const { deckId } = useParams();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [showModalCard, setShowModalCard] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const rowRefs = useRef({});
  const toastTimer = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (deckId) {
      loadCards();
      loadDeckName();
    }
  }, [deckId]);

  const loadDeckName = async () => {
    try {
      const res = await getDeckById(deckId);
      setDeckName(res.data.name);
    } catch (err) {
      console.error("Failed to load deck name", err);
    }
  };

  const loadCards = async () => {
    try {
      const res = await getCards(deckId);
      setCards(res.data);
      setFilteredCards(res.data);
    } catch (err) {
      console.error("Failed to load cards", err);
    }
  };

  const handleEditCard = async () => {
    try {
      await updateCard(selectedCard.id, { front, back });
      loadCards();
      setShowModalCard(false);
      setSelectedCard(null);
    } catch (err) {
      console.error("Failed to edit card", err);
    }
  }

  const handleDeleteCard = async (id) => {
    try {
      await deleteCard(id);
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  }

  const handleResetAll = async () => {
    try {
      await resetAllCards(deckId);
      await loadCards();
    } catch (err) {
      console.error("Failed to reset cards", err);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    setHasSearched(true);
    if (!term) {
      setFilteredCards(cards);
      return;
    }
    const results = cards.filter(
      (card) =>
        card.front.toLowerCase().includes(term) ||
        card.back.toLowerCase().includes(term)
    );
    setFilteredCards(results);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCards(cards);
      setHasSearched(false);
    }
  }, [searchTerm, cards]);

  return (
    <>
      <div className="app">
        <div className="card-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1 className="deck-title">{deckName}</h1>
        </div>

        <div className="flex justify-center mt-6 px-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-end mb-4">
              <input
                type="text"
                placeholder="Search card..."
                className="border px-3 py-2 rounded-lg text-sm w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm"
              >
                Search
              </button>
            </div>

            {hasSearched && (
              <p>Found {filteredCards.length} cards</p>
            )}

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="px-5 py-4">Front</th>
                  <th className="px-5 py-4">Back</th>
                  <th className="px-5 py-4 text-center">Learned</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      ref={(el) => (rowRefs.current[card.id] = el)}
                      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer 
                        ${selectedCard?.id === card.id ? "bg-blue-100" : ""}`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <td className="px-5 py-4">{card.front}</td>
                      <td className="px-5 py-4">{card.back}</td>
                      <td className="px-5 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={card.learned}
                          onClick={(e) => e.stopPropagation()}
                          onChange={async (e) => {
                            try {
                              await updateCard(card.id, { ...card, learned: e.target.checked });
                              loadCards();
                            } catch (err) {
                              console.error("Failed to update card", err);
                            }
                          }}
                          className="w-4 h-4 border border-gray-400 rounded-sm"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-400">
                      No cards found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
            onClick={() => {
              if (!selectedCard) {
                alert("Please select a card to edit");
                return;
              }
              setFront(selectedCard.front);
              setBack(selectedCard.back);
              setShowModalCard(true);
            }}
          >
            Edit Card
          </button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
            onClick={async () => {
              if (!selectedCard) {
                alert("Please select a card to delete");
                return;
              }
              if (window.confirm("Are you sure?")) {
                await handleDeleteCard(selectedCard.id);
                loadCards();
                setSelectedCard(null);
              }
            }}
          >
            Delete Card
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow"
            onClick={handleResetAll}
          >
            Reset All
          </button>
        </div>
      </div>

      {showModalCard && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Card</h3>
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
              <button onClick={() => setShowModalCard(false)}>Cancel</button>
              <button onClick={handleEditCard}>Edit</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </>
  );
}

export default CardScreen;