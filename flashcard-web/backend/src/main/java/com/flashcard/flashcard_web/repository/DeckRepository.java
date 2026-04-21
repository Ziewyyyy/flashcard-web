package com.flashcard.flashcard_web.repository;

import com.flashcard.flashcard_web.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByUserId(Long userId);
    List<Deck> findByUserUsername(String username);
    @Query("SELECT d FROM Deck d LEFT JOIN FETCH d.cards WHERE d.user.username = :username")
    List<Deck> findByUserUsernameWithCards(@Param("username") String username);
}
