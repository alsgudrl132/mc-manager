package com.mcmanager.mc_manager_backend.domain;

import lombok.Data;
import java.util.List;

@Data
public class ServerStatus {
    private double tps;
    private int maxPlayers;
    private int onlinePlayers;
    private RamUsage ramUsage;
    private List<Player> players;
    private String uptime;
}
