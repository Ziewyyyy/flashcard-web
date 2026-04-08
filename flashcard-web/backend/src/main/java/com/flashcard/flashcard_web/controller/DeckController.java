package com.flashcard.flashcard_web.controller;

import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.repository.DeckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decks")
@CrossOrigin

public class DeckController {
    @Autowired
    private DeckRepository deckRepository;

    @GetMapping
    public List<Deck> getAll(){
        return deckRepository.findAll();
    }

    @PostMapping
    public Deck create(@RequestBody Deck deck) {
        return deckRepository.save(deck);
    }
}
