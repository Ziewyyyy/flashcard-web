package com.flashcard.flashcard_web.entity;

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
    private User user;

    // 1 deck có nhiều card
    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    private List<Card> cards;
}
