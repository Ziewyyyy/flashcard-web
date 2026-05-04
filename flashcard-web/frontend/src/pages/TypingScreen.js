import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../css/Typing.css";
import { translations } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

export default function TypingScreen() {
    const { deckId } = useParams();
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [current, setCurrent] = useState(0);
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [progressCount, setProgressCount] = useState(0);

    const inputRef = useRef();
    const { lang } = useLanguage();
    const t = translations[lang];
    const isReverse = sessionStorage.getItem("reverse");

    useEffect(() => {
        const loadCards = async () => {
            const res = await axiosClient.get(`/api/cards/deck/${deckId}`);

            let cards = res.data;

            const isShuffle = sessionStorage.getItem("shuffle");

            if (isShuffle) {
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }
            }

            setCards(cards);
        };

        loadCards();
    }, [deckId]);

    const card = cards[current];

    if (!cards.length) return <div>No cards available</div>;
    if (!card) return <div>Loading...</div>;

    const isImageCard = card.media && card.mediaType === "image";
    const effectiveReverse = isImageCard ? false : isReverse;
    const isLastCard = current === cards.length - 1;



    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.repeat) {
            e.preventDefault();

            if (!result && input.trim() !== "") {
                checkAnswer();
                return;
            }

            if (result && !isLastCard) {
                nextCard();
                return;
            }
        }
    };
    const checkAnswer = () => {
        const correctAnswer = effectiveReverse ? card.front : card.back;

        if (input.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            setResult("correct");
        } else {
            setResult("wrong");
        }

        setProgressCount(prev => prev + 1);
    };

    const nextCard = () => {
        setInput("");
        setResult(null);
        setCurrent(prev => prev + 1);
    };

    return (
        <div className="typing-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ←
            </button>

            <div className="card-box">
                {effectiveReverse ? (
                    <p className="card-text">
                        {card.back}
                    </p>
                ) : card.media ? (
                    card.mediaType === "image" ? (
                        <img src={card.media} alt="card" className="media" />
                    ) : (
                        <video src={card.media} controls className="media" />
                    )
                ) : (
                    <p className="card-text">
                        {card.front}
                    </p>
                )}
            </div>

            <input
                ref={inputRef}
                type="text"
                placeholder={t.typingPlaceholder || "Type your answer..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${(progressCount / cards.length) * 100}%` }}
                />
            </div>

            <div className="actions flex gap-4 mt-6">

                {!result && (
                    <button
                        onClick={checkAnswer}
                        className="px-6 py-3 text-lg font-semibold bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
                    >
                        {t.check || "Check"}
                    </button>
                )}

                {result && !isLastCard && (
                    <button
                        onClick={nextCard}
                        className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
                    >
                        {t.next || "Next"}
                    </button>
                )}

                {result && isLastCard && (
                    <>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 text-lg font-semibold bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition"
                        >
                            {t.finish || "Finish"}
                        </button>

                        <button
                            onClick={() => {
                                setCurrent(0);
                                setInput("");
                                setResult(null);
                            }}
                            className="px-6 py-3 text-lg font-semibold bg-gray-500 text-white rounded-xl shadow hover:bg-gray-600 transition"
                        >
                            {t.redo || "Redo"}
                        </button>
                    </>
                )}

            </div>

            {result === "correct" && (
                <p className="result-text correct">{t.correct || "Correct!"}</p>
            )}
            {result === "wrong" && (
                <p className="result-text wrong">{t.wrong || "Wrong!"}</p>
            )}
        </div>
    );
}