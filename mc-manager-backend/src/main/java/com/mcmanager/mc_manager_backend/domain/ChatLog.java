package com.mcmanager.mc_manager_backend.domain;

import lombok.Data;
import java.time.Instant;

@Data
public class ChatLog {
    private String player;
    private String message;
    private long timestamp;

    public Instant getTimestamp() {
        return Instant.ofEpochMilli(timestamp);
    }
}