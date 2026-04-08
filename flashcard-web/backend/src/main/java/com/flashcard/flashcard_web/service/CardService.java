package com.flashcard.flashcard_web.service;

import com.flashcard.flashcard_web.entity.Card;
import com.flashcard.flashcard_web.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CardService {
    @Autowired
    private CardRepository repo;

    public List<Card> getByDeck(Long deckId){
        return repo.findByDeckId(deckId);
    }

    public Card create(Card c)
    {
        return repo.save(c);
    }
}
