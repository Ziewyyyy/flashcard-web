package com.flashcard.flashcard_web.repository;

import com.flashcard.flashcard_web.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByUserId(Long userId);
}
