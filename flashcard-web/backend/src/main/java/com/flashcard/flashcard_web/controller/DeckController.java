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
import java.util.Optional;

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
        List<Deck> decks = deckRepository.findByUserUsernameWithCards(principal.getName());
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

    @GetMapping("/export")
    public ResponseEntity<?> exportDecks(Principal principal) {
        List<Deck> decks = deckRepository
                .findByUserUsernameWithCards(principal.getName());

        List<Map<String, Object>> result = decks.stream().map(deck -> {
            Map<String, Object> deckMap = new HashMap<>();
            deckMap.put("name", deck.getName());

            List<Map<String, Object>> cards = deck.getCards().stream().map(card -> {
                Map<String, Object> c = new HashMap<>();
                c.put("front", card.getFront());
                c.put("back", card.getBack());
                c.put("learned", card.isLearned());
                return c;
            }).toList();

            deckMap.put("cards", cards);
            return deckMap;
        }).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("user", principal.getName());
        response.put("decks", result);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importDecks(
            @RequestBody Map<String, Object> data,
            Principal principal
    ) {
        if (data.get("decks") == null) {
            return ResponseEntity.badRequest().body("Invalid file format");
        }

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Map<String, Object>> decks =
                (List<Map<String, Object>>) data.get("decks");

        for (Map<String, Object> deckData : decks) {

            Optional<Deck> existing = deckRepository
                    .findByUserUsername(principal.getName())
                    .stream()
                    .filter(d -> d.getName().equals(deckData.get("name")))
                    .findFirst();

            Deck deck = existing.orElseGet(() -> {
                Deck d = new Deck();
                d.setName((String) deckData.get("name"));
                d.setUser(user);
                return deckRepository.save(d);
            });

            List<Map<String, Object>> cards =
                    (List<Map<String, Object>>) deckData.get("cards");

            for (Map<String, Object> cardData : cards) {

                boolean exists = cardRepository.findByDeckId(deck.getId())
                        .stream()
                        .anyMatch(c ->
                                c.getFront().equals(cardData.get("front")) &&
                                        c.getBack().equals(cardData.get("back"))
                        );

                if (!exists) {
                    Card card = new Card();
                    card.setFront((String) cardData.get("front"));
                    card.setBack((String) cardData.get("back"));
                    card.setLearned((Boolean) cardData.get("learned"));
                    card.setDeck(deck);

                    cardRepository.save(card);
                }
            }
        }

        return ResponseEntity.ok("Import success");
    }


}
