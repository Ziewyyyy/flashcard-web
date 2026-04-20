package com.flashcard.flashcard_web.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int duration;

    private int cardsLearned;

    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Deck deck;
}