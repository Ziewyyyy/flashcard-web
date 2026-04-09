  import React, { useState, useRef, useEffect } from "react";
  import { useParams } from "react-router-dom";
  import "../css/Home.css";
  import "../css/CreateDeck.css";
  import "../css/Card.css";
  import { getCards } from "../api/cardApi";

  function CardScreen() {
    const { deckId } = useParams();
    const [cards, setCards] = useState([]);
    useEffect(() => {
          if(deckId)loadCards();
        }, [deckId]);

    const loadCards = async () => {
          try {
            const res = await getCards(deckId);
            console.log("GET cards:", res.data);
            setCards(res.data);
          } catch (err) {
            console.error("Failed to load cards", err);
          }
        };
    return (
    <div className="app">
        <div className="card-screen">
            <h1>Card Screen</h1>
        </div>

        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Front</th>
                        <th>Back</th>
                    </tr>
                </thead>
                <tbody>
                    {cards.map((card) => (
                        <tr key={card.id}>
                            <td>{card.front}</td>
                            <td>{card.back}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
  }

  export default CardScreen;