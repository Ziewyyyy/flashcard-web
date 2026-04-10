  import React, { useState, useRef, useEffect } from "react";
  import { useParams, useLocation } from "react-router-dom";
  import "../css/Home.css";
  import "../css/CreateDeck.css";
  import "../css/Card.css";
  import { getCards } from "../api/cardApi";
  import { getDeckById } from "../api/deckApi";

  function CardScreen() {
    const { deckId } = useParams();
    const [cards, setCards] = useState([]);
    const [deckName, setDeckName] = useState("");

    useEffect(() => {
          if(deckId)
          {
            loadCards();
            loadDeckName();
          }
        }, [deckId]);
    
    const loadDeckName = async () => {
        try {
            const res = await getDeckById(deckId);
            console.log("GET deck:", res.data);
            setDeckName(res.data.name);
        }catch (err) {
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
    return (
    <div className="app">
        <div className="card-screen">
            <h1>{deckName}</h1>
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