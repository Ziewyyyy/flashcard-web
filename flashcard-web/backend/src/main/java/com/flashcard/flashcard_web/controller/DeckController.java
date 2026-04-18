package com.flashcard.flashcard_web.controller;

import com.flashcard.flashcard_web.entity.Card;
import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.entity.User;
import com.flashcard.flashcard_web.repository.CardRepository;
import com.flashcard.flashcard_web.repository.DeckRepository;
import com.flashcard.flashcard_web.repository.UserRepository;
import com.flashcard.flashcard_web.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/decks")
@CrossOrigin

public class DeckController {
    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private CardService cardService;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Deck create(@RequestBody Deck deck, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        deck.setUser(user);
        return deckRepository.save(deck);
    }

    @GetMapping
    public List<Map<String, Object>> getAll(Principal principal) {
        List<Deck> decks = deckRepository.findByUserUsername(principal.getName());
        return decks.stream().map(deck -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", deck.getId());
            map.put("name", deck.getName());
            long totalCards = cardService.countCards(deck.getId());
            long learnedCards = cardService.countLearnedCards(deck.getId());
            map.put("cardCount", totalCards - learnedCards);
            map.put("learnedCount", learnedCards);
            return map;
        }).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deck> getDeckById(@PathVariable Long id) {
        return deckRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeck(@PathVariable Long id) {
        if(!deckRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        deckRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }



}
