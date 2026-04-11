package com.flashcard.flashcard_web.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
