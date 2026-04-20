package com.flashcard.flashcard_web.service;

import com.flashcard.flashcard_web.repository.DeckRepository;
import com.flashcard.flashcard_web.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class StudySessionService {
    private final StudySessionRepository repo;
    private final DeckRepository deckRepo;

}
