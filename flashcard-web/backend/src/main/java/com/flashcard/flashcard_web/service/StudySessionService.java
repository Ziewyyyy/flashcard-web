package com.flashcard.flashcard_web.service;

import com.flashcard.flashcard_web.entity.StudySession;
import com.flashcard.flashcard_web.repository.DeckRepository;
import com.flashcard.flashcard_web.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class StudySessionService {
    private final StudySessionRepository repo;
    private final DeckRepository deckRepo;

    public StudySession startSession(Long deckId) {
        StudySession session = new StudySession();
        session.setStartTime(LocalDateTime.now());
        session.setDeck(deckRepo.findById(deckId).orElseThrow());
        return repo.save(session);
    }

    public StudySession endSession(Long sessionId, int cardsLearned) {
        StudySession session = repo.findById(sessionId)
            .orElseThrow();
        LocalDateTime end = LocalDateTime.now();
        session.setEndTime(end);
        session.setCardsLearned(cardsLearned);

        long minutes = java.time.Duration.between(
                session.getStartTime(), end
        ).toMinutes();

        session.setDuration((int) minutes);

        return repo.save(session);
    }
}
