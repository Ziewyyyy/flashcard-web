package com.flashcard.flashcard_web.service;

import com.flashcard.flashcard_web.entity.Deck;
import com.flashcard.flashcard_web.entity.StudySession;
import com.flashcard.flashcard_web.repository.DeckRepository;
import com.flashcard.flashcard_web.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.*;


@Service
@RequiredArgsConstructor

public class StudySessionService {
    private final StudySessionRepository studyRepo;
    private final DeckRepository deckRepo;

    public StudySession startSession(Long deckId) {
        Deck deck = deckRepo.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));

        StudySession session = new StudySession();
        session.setDeck(deck);
        session.setStartTime(LocalDateTime.now());

        return studyRepo.save(session);
    }

    public StudySession endSession(Long sessionId, int cardsLearned) {
        StudySession session = studyRepo.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndTime(LocalDateTime.now());
        session.setCardsLearned(cardsLearned);

        long seconds = Duration.between(
                session.getStartTime(),
                session.getEndTime()
        ).getSeconds();

        session.setDuration((int) seconds);

        return studyRepo.save(session);
    }

    public Map<String, Object> getStats() {
        List<StudySession> sessions = studyRepo.findAll();

        int totalTime = sessions.stream()
                .mapToInt(StudySession::getDuration)
                .sum();

        Map<Long, Integer> timeByDeck = new HashMap<>();

        for (StudySession s : sessions) {
            Long deckId = s.getDeck().getId();
            timeByDeck.put(
                    deckId,
                    timeByDeck.getOrDefault(deckId, 0) + s.getDuration()
            );
        }

        int streak = getStreak();
        int longestStreak = getLongestStreak();

        Map<String, Object> result = new HashMap<>();
        result.put("totalTime", totalTime);
        result.put("timeByDeck", timeByDeck);
        result.put("streak", streak);
        result.put("longestStreak", longestStreak);

        return result;
    }

    public int getStreak() {
        List<StudySession> sessions = studyRepo.findAll();

        Set<LocalDate> studyDays = sessions.stream()
                .map(s -> s.getStartTime().toLocalDate())
                .collect(Collectors.toSet());

        int streak = 0;
        LocalDate today = LocalDate.now();

        while (studyDays.contains(today.minusDays(streak))) {
            streak++;
        }

        return streak;
    }

    public int getLongestStreak() {
        List<StudySession> sessions = studyRepo.findAll();

        if (sessions.isEmpty()) return 0;

        Set<LocalDate> studyDaysSet = sessions.stream()
                .map(s -> s.getStartTime().toLocalDate())
                .collect(Collectors.toSet());

        List<LocalDate> studyDays = new ArrayList<>(studyDaysSet);
        Collections.sort(studyDays);

        int maxStreak = 1;
        int currentStreak = 1;

        for (int i = 1; i < studyDays.size(); i++) {
            LocalDate prev = studyDays.get(i - 1);
            LocalDate curr = studyDays.get(i);

            if (curr.equals(prev.plusDays(1))) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }

            maxStreak = Math.max(maxStreak, currentStreak);
        }

        return maxStreak;
    }
}
