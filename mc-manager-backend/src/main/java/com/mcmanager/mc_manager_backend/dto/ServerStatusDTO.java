package com.mcmanager.mc_manager_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServerStatusDTO {
    private int maxPlayers;
    private int onlinePlayers;
    private String ramUsage;
    private double tps;
    private List<PlayerDTO> players;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlayerDTO {
        private int level;
        private String name;
        private double health;
        private String world;
    }
}