import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/StudyScreen.css";
import { getStudyCards, markLearned } from "../api/cardApi";
import { endStudy } from "../api/studyApi";
import { useStudy } from "../context/StudyContext";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function StudyScreen() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { updateDeckProgress } = useStudy();

    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [learnedCount, setLearnedCount] = useState(0);

    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem("fontSize");
        return saved && !isNaN(saved) ? Number(saved) : 24;
    });

    const [fontFamily, setFontFamily] = useState(() => {
        return localStorage.getItem("fontFamily") || "Arial";
    });

    useEffect(() => {
        localStorage.setItem("fontFamily", fontFamily);
    }, [fontFamily]);

    useEffect(() => {
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

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

    const handleShow = async () => {
        if (showBack) return;

        setShowBack(true);
        const currentCard = cards[currentIndex];

        try {
            await markLearned(currentCard.id);
            updateDeckProgress(deckId);
            setLearnedCount((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to mark learned", err);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 >= cards.length) {
            setIsFinished(true);
            return;
        }
        setShowBack(false);
        setCurrentIndex((prev) => prev + 1);
    };

    const finishStudy = async () => {
        const sessionId = localStorage.getItem("sessionId");

        try {
            await endStudy(sessionId, learnedCount);
        } catch (err) {
            console.error("Finish study failed", err);
        }

        localStorage.removeItem("sessionId");
        navigate("/");
    };

    const increaseFont = () => {
        setFontSize((prev) => Math.min(prev + 2, 60));
    };

    const decreaseFont = () => {
        setFontSize((prev) => Math.max(prev - 2, 14));
    };


    if (isLoading) {
        return (
            <div className="study-container">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="study-container">
                <h2>🎉 Finish!</h2>
                <button className="btn1" onClick={finishStudy}>
                    Return
                </button>
            </div>
        );
    }

    const currentCard = cards[currentIndex];
    if (!currentCard) return <div>Loading...</div>;

    return (
        <div className="study-container">
            <div className="card-panel">

                <div className="font-controls">
                    <IconButton size="small" onClick={decreaseFont}>
                        <RemoveIcon />
                    </IconButton>
                    <IconButton size="small" onClick={increaseFont}>
                        <AddIcon />
                    </IconButton>
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="font-select"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Tahoma">Tahoma</option>
                    </select>
                </div>

                <div
                    className="card-front"
                    style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }}
                >
                    {currentCard.front}
                </div>

                {showBack && (
                    <div
                        className="card-back"
                        style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }}
                    >
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
