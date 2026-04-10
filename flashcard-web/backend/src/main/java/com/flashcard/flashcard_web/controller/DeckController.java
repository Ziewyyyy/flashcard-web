package com.flashcard.flashcard_web.controller;

import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.repository.DeckRepository;
import com.flashcard.flashcard_web.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public Deck create(@RequestBody Deck deck) {
        return deckRepository.save(deck);
    }

    @GetMapping
    public List<Map<String, Object>> getAll(){
        List<Deck> decks = deckRepository.findAll();
        return decks.stream().map(deck -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", deck.getId());
            map.put("name", deck.getName());
            map.put("cardCount", cardService.countCards(deck.getId()));

            return map;
        }).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deck> getDeckById(@PathVariable Long id) {
        return deckRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
