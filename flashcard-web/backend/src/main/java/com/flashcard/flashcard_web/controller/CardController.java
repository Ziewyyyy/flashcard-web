package com.flashcard.flashcard_web.controller;

import com.flashcard.flashcard_web.entity.Card;
import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.repository.CardRepository;
import com.flashcard.flashcard_web.repository.DeckRepository;
import com.flashcard.flashcard_web.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000")

public class CardController {
    @Autowired
    private CardService service;

    @Autowired
    private CardRepository cardRepository;

    @GetMapping("/deck/{deckId}")
    public List<Card> getByDeck(@PathVariable Long deckId) {
        return service.getByDeck(deckId);
    }

    @PostMapping
    public Card create(@RequestBody Card c) {
        return service.create(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCard(@PathVariable Long id, @RequestBody Card card) {
        Card existing = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        existing.setFront(card.getFront());
        existing.setBack(card.getBack());
        existing.setLearned(card.isLearned());
        existing.setMedia(card.getMedia());
        existing.setMediaType(card.getMediaType());

        cardRepository.save(existing);

        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable Long id) {
        if (!cardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cardRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/deck/{deckId}/study")
    public List<Card> getStudyCards(@PathVariable Long deckId) {
        return cardRepository.findByDeckIdAndLearnedFalse(deckId);
    }

    @PutMapping("/{id}/learn")
    public ResponseEntity<?> markLearned(@PathVariable Long id) {
        Card updated = service.markLearned(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/reset/{deckId}")
    public ResponseEntity<?> resetAll(@PathVariable Long deckId) {
        service.resetAll(deckId);
        return ResponseEntity.ok().build();
    }

}
