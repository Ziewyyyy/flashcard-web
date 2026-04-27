import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/StudyScreen.css";
import { getStudyCards, markLearned, createCard } from "../api/cardApi";
import { endStudy } from "../api/studyApi";
import { useStudy } from "../context/StudyContext";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function StudyScreen() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { updateDeckProgress } = useStudy();

    const containerRef = useRef();

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

    const isReverse = sessionStorage.getItem("reverse");

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
        containerRef.current?.focus();
    }, []);

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

            let cards = res.data;

            const isShuffle = sessionStorage.getItem("shuffle");

            if (isShuffle) {
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }
            }

            setCards(cards);
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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
                e.preventDefault();
                if (!showBack) {
                    handleShow();
                    return;
                }
                if (currentIndex + 1 >= cards.length) {
                    setIsFinished(true);
                    return;
                }
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showBack, currentIndex, cards.length]);

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
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ←
                </button>

                <div className="inline-flex mt-4 mb-6 justify-center">
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-l-full" onClick={() => navigate("/")}>Decks</button>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => setShowModalCard(true)}>Add</button>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => navigate(`/cards/${deckId}`)}>Browse</button>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => setShowModalStats(true)}>Stats</button>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-r-full">Sync</button>
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
                        >
                            <option>Arial</option>
                            <option>Times New Roman</option>
                            <option>Courier New</option>
                            <option>Verdana</option>
                            <option>Tahoma</option>
                        </select>

                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>

                    <div
                        className="card-front"
                        style={{
                            fontSize: `${fontSize}px`,
                            fontFamily,
                            color: fontColor
                        }}
                    >
                        {isReverse ? currentCard.back : currentCard.front}
                    </div>

                    {showBack && (
                        <div
                            className="card-back"
                            style={{
                                fontSize: `${fontSize}px`,
                                fontFamily,
                                color: fontColor
                            }}
                        >
                            {isReverse ? currentCard.front : currentCard.back}
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
                        <input type="text" placeholder="Front" value={front} onChange={(e) => setFront(e.target.value)} />
                        <input type="text" placeholder="Back" value={back} onChange={(e) => setBack(e.target.value)} />

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
                        <div className="modal text-center">
                            <h2>Study Stats</h2>
                            <p>Progress: {percent}%</p>
                            <p>{learned} / {total}</p>
                            <button onClick={() => setShowModalStats(false)}>
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