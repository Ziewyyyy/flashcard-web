package com.flashcard.flashcard_web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "deck")
@Data
public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Card> cards;

    @Transient
    public int getCardCount() {
        return cards != null ? cards.size() : 0;
    }
}