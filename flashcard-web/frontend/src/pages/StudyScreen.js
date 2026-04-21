import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/StudyScreen.css";
import { getCards, getStudyCards } from "../api/cardApi";
import { endStudy } from "../api/studyApi";

function StudyScreen() {
    const { deckId } = useParams();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [learnedCount, setLearnedCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        loadCards();
    }, [deckId]);

    const loadCards = async () => {
        try {
            setIsLoading(true);
            const res = await getStudyCards(deckId);
            setCards(res.data);
            if (res.data.length === 0) {
                setIsFinished(true);
            }
        } catch (err) {
            console.error("Failed to load cards", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShow = () => {
        setShowBack(true);
    }

    const handleNext = () => {
        setLearnedCount((prev) => prev + 1);
        if (currentIndex + 1 >= cards.length) {
            setIsFinished(true);
            return;
        }
        setShowBack(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);

    }

    const finishStudy = async () => {
        const sessionId = localStorage.getItem("sessionId");

        try {
            await endStudy(sessionId, learnedCount); 
            localStorage.removeItem("sessionId");
            navigate("/home");
        } catch (err) {
            console.error("Finish study failed", err);
        }
    };

    if (isLoading) {
        return (
            <div className="study-container">
                <h2>Loading...</h2>
            </div>
        )
    }


    if (isFinished) {
        return (
            <div className="study-container">
                <h2>🎉 Finish!</h2>
                <button className="btn1" onClick={finishStudy}>
                    Return
                </button>
            </div>
        )
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