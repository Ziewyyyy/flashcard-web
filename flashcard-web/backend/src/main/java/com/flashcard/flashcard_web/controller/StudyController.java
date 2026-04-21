package com.flashcard.flashcard_web.controller;

import com.flashcard.flashcard_web.entity.StudySession;
import com.flashcard.flashcard_web.service.StudySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class StudyController {
    private final StudySessionService studyService;

    @PostMapping("/start/{deckId}")
    public StudySession start(@PathVariable Long deckId){
        return studyService.startSession(deckId);
    }

    @PostMapping("/end/{sessionId}")
    public StudySession end(@PathVariable Long sessionId, @RequestParam int cardLearned){
        return studyService.endSession(sessionId, cardLearned);
    }
}
