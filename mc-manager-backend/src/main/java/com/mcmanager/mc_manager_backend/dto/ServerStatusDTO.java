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
    private RamUsageDTO ramUsage;
    private double tps;
    private List<PlayerDTO> players;
    private String uptime;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RamUsageDTO {
        private long total;
        private String formatted;
        private long used;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlayerDTO {
        private String name;
        private int level;
        private double health;
        private String world;
        private boolean online;
        private String skinUrl;
    }
}