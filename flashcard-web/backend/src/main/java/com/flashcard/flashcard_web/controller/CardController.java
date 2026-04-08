package com.flashcard.flashcard_web.controller;

import com.flashcard.flashcard_web.entity.Card;
import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
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


    @GetMapping("/deck/{deckId}")
    public List<Card> getByDeck(@PathVariable Long deckId){
        return service.getByDeck(deckId);
    }

    @PostMapping
    public Card create(@RequestBody Card c){
        return service.create(c);
    }



}
