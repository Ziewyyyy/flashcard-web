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
  const [editMedia, setEditMedia] = useState(null);
  const [editMediaPreview, setEditMediaPreview] = useState(null);
  const [editMediaType, setEditMediaType] = useState(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const editFileInputRef = useRef();
  const rowRefs = useRef({});
  const toastTimer = useRef(null);
  const navigate = useNavigate();
  const tableRef = useRef();
  const actionRef = useRef();
  const modalRef = useRef();

  const displayMedia = editMediaPreview || selectedCard?.media;

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inTable = tableRef.current?.contains(e.target);
      const inActions = actionRef.current?.contains(e.target);
      const inModal = modalRef.current?.contains(e.target);
      if (!inTable && !inActions && !inModal) {
        setSelectedCard(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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

  const loadCards = async (term = searchTerm) => {
    try {
      const res = await getCards(deckId);
      const newCards = res.data;
      setCards(newCards);

      const t = term.trim().toLowerCase();
      if (!t) {
        setFilteredCards(newCards);
      } else {
        setFilteredCards(
          newCards.filter(
            (card) =>
              card.front.toLowerCase().includes(t) ||
              card.back.toLowerCase().includes(t)
          )
        );
      }
    } catch (err) {
      console.error("Failed to load cards", err);
    }
  };

  const handleEditCard = async () => {
    try {
      const res = await updateCard(selectedCard.id, {
        front: (editMedia || selectedCard?.media) ? "" : front,
        back,
        learned: selectedCard.learned,
        media: editMedia || selectedCard.media || null,
        mediaType: editMediaType || selectedCard.mediaType || null,
      });

      console.log("Response:", res.data);

      handleCloseModal();
      setSelectedCard(null);
      await loadCards("");

    } catch (err) {
      console.error("Failed to edit card", err);
    }
  };

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

  const handleEditMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setEditMediaPreview(preview);
    setEditMediaType(file.type.startsWith("video") ? "video" : "image");
    setIsReadingFile(true);

    const reader = new FileReader();
    reader.onload = () => {
      setEditMedia(reader.result);
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCloseModal = () => {
    setShowModalCard(false);
    setEditMedia(null);
    setEditMediaPreview(null);
    setEditMediaType(null);
    setIsReadingFile(false);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  return (
    <>
      <div className="app">
        <div className="card-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1 className="deck-title">{deckName}</h1>
        </div>

        <div className="flex justify-center mt-6 px-4" ref={tableRef}>
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
                      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedCard?.id === card.id ? "selected-row" : ""
                        }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <td className="px-5 py-4">
                        {card.media ? (
                          card.mediaType === "image" ? (
                            <img
                              src={card.media}
                              alt={card.front}
                              style={{ maxHeight: "60px", maxWidth: "100px", borderRadius: "6px", objectFit: "cover" }}
                            />
                          ) : (
                            <video
                              src={card.media}
                              style={{ maxHeight: "60px", maxWidth: "100px", borderRadius: "6px" }}
                            />
                          )
                        ) : (
                          card.front
                        )}
                      </td>
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

        <div className="flex gap-4 justify-center mt-6" ref={actionRef}>
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
          <div className="modal" ref={modalRef}>
            <h3>Edit Card</h3>

            {(editMedia || selectedCard?.media) ? (
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                {(editMediaType || selectedCard?.mediaType) === "image" ? (
                  <img
                    src={displayMedia}
                    alt="media"
                    style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "8px" }}
                  />
                ) : (
                  <video
                    src={displayMedia}
                    controls
                    style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "8px" }}
                  />
                )}

                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={handleEditMediaChange}
                  />
                  <button
                    type="button"
                    className="media-attach-btn"
                    onClick={() => editFileInputRef.current.click()}
                  >
                    🔄 Change file
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
              />
            )}

            <input
              type="text"
              placeholder="Back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button onClick={handleEditCard} disabled={isReadingFile}>
                {isReadingFile ? "Loading..." : "Edit"}
              </button>
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