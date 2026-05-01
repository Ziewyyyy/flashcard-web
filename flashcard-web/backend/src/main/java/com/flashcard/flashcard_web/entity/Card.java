package com.flashcard.flashcard_web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    private String front;

    @Column(nullable = false)
    private String back;

    @ManyToOne
    @JoinColumn(name = "deck_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Deck deck;

    @Column(nullable = false)
    private boolean learned = false;

    @Column(columnDefinition = "LONGTEXT")
    private String media;

    @Column
    private String mediaType;

    public boolean isLearned() {
        return learned;
    }

    public void setLearned(boolean learned) {
        this.learned = learned;
    }
}