package com.flashcard.flashcard_web.repository;

import com.flashcard.flashcard_web.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
}
