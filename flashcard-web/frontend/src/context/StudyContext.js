import { createContext, useContext, useState } from "react";

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);

  const updateDeckProgress = (deckId) => {
    setDecks(prev =>
      prev.map(deck =>
        deck.id === deckId
          ? {
              ...deck,
              learnedCount: deck.learnedCount + 1,
              cardCount: deck.cardCount - 1
            }
          : deck
      )
    );
  };

  return (
    <StudyContext.Provider value={{ decks, setDecks, updateDeckProgress }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);