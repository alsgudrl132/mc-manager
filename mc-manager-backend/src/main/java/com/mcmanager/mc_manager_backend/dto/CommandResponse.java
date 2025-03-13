package com.mcmanager.mc_manager_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandResponse {
    private boolean success;
    private String message;
}