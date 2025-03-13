package com.mcmanager.mc_manager_backend.dto;

import com.mcmanager.mc_manager_backend.model.Player;
import com.mcmanager.mc_manager_backend.model.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDetails {
    private Player player;
    private PlayerStatus currentStatus;
    private Map<String, Object> stats;
}