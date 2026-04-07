package com.flashcard.flashcard_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "users")
@Data

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // 1 user có nhiều deck
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Deck> decks;
}
