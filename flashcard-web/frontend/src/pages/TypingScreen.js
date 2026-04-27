import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../css/Typing.css";

export default function TypingScreen() {
    const { deckId } = useParams();
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [current, setCurrent] = useState(0);
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [progressCount, setProgressCount] = useState(0);

    const inputRef = useRef();

    const card = cards[current];
    const isLastCard = current === cards.length - 1;

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




    if (!cards.length) return <div>No cards available</div>;
    if (!card) return <div>Loading...</div>;

    const checkAnswer = () => {
        const correctAnswer = isReverse ? card.front : card.back;

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
                <p className="card-text">
                    {isReverse ? card.back : card.front}
                </p>
            </div>

            <input
                ref={inputRef}
                type="text"
                placeholder="Type your answer..."
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
                        Check
                    </button>
                )}

                {result && !isLastCard && (
                    <button
                        onClick={nextCard}
                        className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
                    >
                        Next
                    </button>
                )}

                {result && isLastCard && (
                    <>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 text-lg font-semibold bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition"
                        >
                            Finish
                        </button>

                        <button
                            onClick={() => {
                                setCurrent(0);
                                setInput("");
                                setResult(null);
                            }}
                            className="px-6 py-3 text-lg font-semibold bg-gray-500 text-white rounded-xl shadow hover:bg-gray-600 transition"
                        >
                            Redo
                        </button>
                    </>
                )}

            </div>

            {result === "correct" && (
                <p className="result-text correct">Correct!</p>
            )}
            {result === "wrong" && (
                <p className="result-text wrong">Wrong!</p>
            )}
        </div>
    );
}