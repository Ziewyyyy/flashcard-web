package com.flashcard.flashcard_web.repository;

import com.flashcard.flashcard_web.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByDeckId(Long deckId);
    long countByDeckId(Long deckId);
    List<Card> findByDeckIdAndLearnedFalse(Long deckId);
    long countByDeckIdAndLearnedTrue(Long deckId);
}
