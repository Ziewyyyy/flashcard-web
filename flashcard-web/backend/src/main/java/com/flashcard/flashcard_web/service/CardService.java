package com.flashcard.flashcard_web.service;

import com.flashcard.flashcard_web.entity.Card;
import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.repository.CardRepository;
import com.flashcard.flashcard_web.repository.DeckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CardService {
    @Autowired
    private CardRepository repo;

    @Autowired
    private DeckRepository deckRepository;

    public List<Card> getByDeck(Long deckId){
        return repo.findByDeckId(deckId);
    }

    public Card create(Card c){
        if (c.getDeck() != null && c.getDeck().getId() != null) {
            Deck deck = deckRepository.findById(c.getDeck().getId())
                    .orElseThrow(() -> new RuntimeException("Deck not found"));
            c.setDeck(deck);
        }

        return repo.save(c);
    }

    public int countCards(Long deckId) {
        return (int) repo.countByDeckId(deckId);
    }

    public long countLearnedCards(Long deckId) {
        return repo.countByDeckIdAndLearnedTrue(deckId);
    }

    public Card markLearned(Long cardId) {
        Card card = repo.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (card.isLearned()) {
            return card;
        }
        card.setLearned(true);
        return repo.save(card);
    }

    public void resetAll(Long deckId) {
        List<Card> cards = repo.findByDeckId(deckId);
        for(Card c : cards) {
            c.setLearned(false);
        }
        repo.saveAll(cards);
    }
}
