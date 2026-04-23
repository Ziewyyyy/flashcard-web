import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/StudyScreen.css";
import { getStudyCards, markLearned } from "../api/cardApi";
import { endStudy } from "../api/studyApi";
import { useStudy } from "../context/StudyContext";
import { createCard } from "../api/cardApi";

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
    const [showModalCard, setShowModalCard] = useState(false);
    const [showModalStats, setShowModalStats] = useState(false);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem("fontSize");
        return saved && !isNaN(saved) ? Number(saved) : 24;
    });

    const [fontFamily, setFontFamily] = useState(() => {
        return localStorage.getItem("fontFamily") || "Arial";
    });

    const [fontColor, setFontColor] = useState(() => {
        return localStorage.getItem("fontColor") || "#000000";
    });

    useEffect(() => {
        localStorage.setItem("fontFamily", fontFamily);
    }, [fontFamily]);

    useEffect(() => {
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem("fontColor", fontColor);
    }, [fontColor]);

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

    const handleCreateCard = async () => {
        if (!front.trim() || !back.trim()) return;

        try {
            await createCard({
                deck: { id: deckId },
                front,
                back
            });

            setShowModalCard(false);
            setFront("");
            setBack("");

            await loadCards();
        } catch (err) {
            console.error("Create card failed", err);
        }
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
        <>
            <div className="study-container">
                <div className="flex justify-center mb-4">
                    <div className="inline-flex">
                        <button
                            className="bg-white hover:bg-gray-100 px-4 py-2 border rounded-l-full"
                            onClick={() => navigate("/")}
                        >
                            Decks
                        </button>

                        <button
                            className="bg-white hover:bg-gray-100 px-4 py-2 border"
                            onClick={() => setShowModalCard(true)}
                        >
                            Add
                        </button>

                        <button
                            className="bg-white hover:bg-gray-100 px-4 py-2 border"
                            onClick={() => navigate(`/cards/${deckId}`)}
                        >
                            Browse
                        </button>

                        <button
                            className="bg-white hover:bg-gray-100 px-4 py-2 border"
                            onClick={() => setShowModalStats(true)}
                        >
                            Stats
                        </button>

                        <button className="bg-white hover:bg-gray-100 px-4 py-2 border rounded-r-full">
                            Sync
                        </button>
                    </div>
                </div>

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

                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="w-8 h-8 border rounded cursor-pointer ml-2"
                        />
                    </div>

                    <div
                        className="card-front"
                        style={{
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            color: fontColor
                        }}
                    >
                        {currentCard.front}
                    </div>

                    {showBack && (
                        <div
                            className="card-back"
                            style={{
                                fontSize: `${fontSize}px`,
                                fontFamily: fontFamily,
                                color: fontColor
                            }}
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

            {showModalStats && (() => {
                const total = cards.length;
                const learned = learnedCount;
                const percent = total ? Math.round((learned / total) * 100) : 0;

                return (
                    <div className="modal-overlay">
                        <div className="modal stats-modal text-center">

                            <h2 className="text-xl font-bold mb-4">
                                Study Stats
                            </h2>

                            <div className="mt-4">
                                <p>Progress: <b>{percent}%</b></p>
                                <p>Learned: {learned} / {total}</p>
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
        </>
    );
}

export default StudyScreen;
