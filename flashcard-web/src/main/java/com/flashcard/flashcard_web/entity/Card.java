package com.flashcard.flashcard_web.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "card")
@Data


public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private String answer;

    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Deck deck;
}
