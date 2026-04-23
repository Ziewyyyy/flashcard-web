import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../css/Home.css";
import "../css/CreateDeck.css";
import "../css/Card.css";
import { getCards, updateCard, deleteCard } from "../api/cardApi";
import { getDeckById } from "../api/deckApi";
import { resetAllCards } from "../api/cardApi";


function CardScreen() {
  const { deckId } = useParams();
  const [cards, setCards] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [showModalCard, setShowModalCard] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (deckId) {
      loadCards();
      loadDeckName();
    }
  }, [deckId]);

  const loadDeckName = async () => {
    try {
      const res = await getDeckById(deckId);
      console.log("GET deck:", res.data);
      setDeckName(res.data.name);
    } catch (err) {
      console.error("Failed to load deck name", err);
    }
  };

  const loadCards = async () => {
    try {
      const res = await getCards(deckId);
      console.log("GET cards:", res.data);
      setCards(res.data);
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
  return (
    <>
      <div className="app">
        <div className="card-screen">
          <h1>{deckName}</h1>
        </div>
        <div className="flex justify-center mt-6 px-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="px-5 py-4" >Front</th>
                  <th className="px-5 py-4">Back</th>
                  <th className="px-5 py-4 text-center">Learned</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer 
                                ${selectedCard?.id === card.id ? "bg-blue-100" : ""}`} onClick={() => setSelectedCard(card)}>
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
                        id={`checkbox-${card.id}`}
                        className="w-4 h-4 border border-gray-400 rounded-sm"
                      />
                    </td>
                  </tr>
                ))}
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
              <button onClick={() => setShowModalCard(false)}>
                Cancel
              </button>

              <button onClick={handleEditCard}>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardScreen;