  import React, { useState, useRef, useEffect } from "react";
  import { useParams } from "react-router-dom";
  import "../css/Home.css";
  import "../css/CreateDeck.css";
  import "../css/Card.css";
  import { getCards } from "../api/cardApi";

  function StudyScreen() {
    const { deckId } = useParams();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        loadCards();
    }, [deckId]);

    const loadCards = async () => {
        try{
            const res = await getCards(deckId);
            setCards(res.data);
        }catch(err){
            console.error("Failed to load cards", err);
        }
    };

    const handleShow = () => {
        setShowBack(true);
    }

    const handleNext = () => {
        setShowBack(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }
    const currentCard = cards[currentIndex];
    if (!currentCard) return <div>Loading...</div>;
     

    return (
        <div className="study-container">
            <div className="card-panel">
                <div className="card-front">
                    {currentCard.front}
                </div>
                {showBack && (
                    <div className="card-back">
                        {currentCard.back}
                    </div>
                )}
            </div>

            <div className="control-panel">
                {!showBack ? (
                    <button className="btn" onClick={handleShow}>
                        Show
                    </button>
                ) : (
                    <button className="btn" onClick={handleNext}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
export default StudyScreen;